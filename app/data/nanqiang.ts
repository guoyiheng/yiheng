import { Marked, Renderer, type Tokens } from 'marked'
import { parse } from 'csv-parse/browser/esm/sync'

export interface NanqiangDocument {
  id: string
  title: string
  sourcePath: string
  content: string
  kind: 'markdown' | 'csv'
}

export interface NanqiangPageDocument {
  id: string
  title: string
  kind: 'markdown' | 'csv'
  html?: string
  rows?: string[][]
}

type ResourceToken = (Tokens.Link | Tokens.Image) & {
  internal?: boolean
  resourceType?: 'audio'
}

type SourceLoader = () => Promise<string | { default: string }> | string | { default: string }
type AssetSource = string | (() => Promise<any>)

interface DocumentSource {
  sourcePath: string
  kind: 'markdown' | 'csv'
  load: SourceLoader
}

const rawMarkdownSources = import.meta.glob('./nanqiang/**/*.md', {
  query: '?raw',
  import: 'default'
}) as Record<string, SourceLoader>

const rawCsvSources = import.meta.glob('./nanqiang/**/*.csv', {
  query: '?raw',
  import: 'default'
}) as Record<string, SourceLoader>

const rawAssetLoaders = import.meta.glob(
  './nanqiang/**/*.{png,jpg,jpeg,gif,webp,svg,mp3,pdf,html}',
  { query: '?url', import: 'default' }
) as Record<string, () => Promise<string>>

const canonicalizeMap = <T>(map: Record<string, T>) => {
  return Object.fromEntries(Object.entries(map).map(([sourcePath, value]) => {
    return [sourcePath.replace(/^\.\//, '/app/data/'), value]
  }))
}

const markdownSources = canonicalizeMap(rawMarkdownSources)
const csvSources = canonicalizeMap(rawCsvSources)
const assetLoaders = canonicalizeMap<AssetSource>(rawAssetLoaders)

const safeDecode = (value: string) => {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

const stripMarkdown = (value: string) => value
  .replace(/\*\*|__|\*|_|`/g, '')
  .trim()

const titleFromSource = (source: string, sourcePath: string) => {
  const heading = source.match(/^#\s+(.+)$/m)?.[1]
  if (heading) return stripMarkdown(heading)

  const filename = sourcePath.split('/').at(-1)?.replace(/\.(md|csv)$/i, '').replace(/\.all$/i, '')
  return stripMarkdown(filename ?? '无标题')
}

const documentSources = new Map<string, DocumentSource>()

const registerDocumentSource = (sourcePath: string, kind: 'markdown' | 'csv', contentOrLoader: string | SourceLoader) => {
  const load: SourceLoader = typeof contentOrLoader === 'function' ? contentOrLoader : () => contentOrLoader
  const docSource: DocumentSource = { sourcePath, kind, load }
  const relPath = sourcePath.replace(/^\/app\/data\/nanqiang\//, '').replace(/\.(md|csv)$/i, '').replace(/\.all$/i, '')
  const decodedRelPath = safeDecode(relPath)
  const baseName = decodedRelPath.split('/').at(-1) ?? decodedRelPath

  documentSources.set(relPath, docSource)
  documentSources.set(decodedRelPath, docSource)
  documentSources.set(baseName, docSource)
  documentSources.set(encodeURIComponent(baseName), docSource)
  documentSources.set(encodeURIComponent(relPath), docSource)
}

for (const [sourcePath, content] of Object.entries(markdownSources)) {
  registerDocumentSource(sourcePath, 'markdown', content)
}

for (const [sourcePath, content] of Object.entries(csvSources)) {
  if (sourcePath.endsWith('.all.csv')) continue
  registerDocumentSource(sourcePath, 'csv', content)
}

const normalizeSourcePath = (value: string) => {
  const result: string[] = []

  for (const segment of value.split('/')) {
    if (!segment || segment === '.') continue
    if (segment === '..') result.pop()
    else result.push(segment)
  }

  return `/${result.join('/')}`
}

const resolveResource = (sourcePath: string, href: string) => {
  const cleanHref = href.split(/[?#]/)[0] ?? href
  const decodedHref = safeDecode(cleanHref)
  const sourceDirectory = sourcePath.slice(0, sourcePath.lastIndexOf('/') + 1)
  return normalizeSourcePath(`${sourceDirectory}${decodedHref}`)
}

const isExternalLink = (href: string) => /^(?:[a-z]+:|\/\/|#)/i.test(href)

const escapeAttribute = (value: string) => value
  .replaceAll('&', '&amp;')
  .replaceAll('"', '&quot;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')

const escapeHtml = (value: string) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')

const starQuoteExtension = {
  name: 'starQuote',
  level: 'inline' as const,
  start(source: string) {
    const index = source.indexOf('「')
    return index >= 0 ? index : undefined
  },
  tokenizer(source: string) {
    const match = /^「[^」\n]+」/.exec(source)
    if (!match) return

    return {
      type: 'starQuote',
      raw: match[0],
      text: match[0]
    }
  },
  renderer(token: { text: string }) {
    return `<span class="nanqiang-star-quote">${escapeHtml(token.text)}</span>`
  }
}

const createRenderer = () => {
  const renderer = new Renderer()

  renderer.html = ({ text }) => {
    const trimmed = text.trim()
    if (/^<\/?(?:aside|details|summary)\b/i.test(trimmed)) return text
    if (/^<br\s*\/?>$/i.test(trimmed)) return '<br>'
    return escapeHtml(text)
  }

  renderer.paragraph = function (token) {
    const onlyToken = token.tokens.length === 1
      ? token.tokens[0] as ResourceToken
      : undefined
    const content = this.parser.parseInline(token.tokens)

    return onlyToken?.resourceType === 'audio'
      ? `${content}\n`
      : `<p>${content}</p>\n`
  }

  renderer.link = function (token) {
    const resourceToken = token as ResourceToken
    const label = this.parser.parseInline(token.tokens)
    const href = escapeAttribute(token.href)

    if (resourceToken.resourceType === 'audio') {
      const audioLabel = escapeAttribute(token.text || '音频')
      return `<figure class="nanqiang-audio-player" data-audio-player>
        <audio preload="metadata" src="${href}" aria-label="${audioLabel}"></audio>
        <button class="nanqiang-audio-toggle" type="button" data-audio-toggle aria-label="播放" title="播放"></button>
        <figcaption class="nanqiang-audio-details">
          <div class="nanqiang-audio-title">${label}</div>
          <div class="nanqiang-audio-timeline">
            <span data-audio-current>0:00</span>
            <input class="nanqiang-audio-progress" data-audio-progress type="range" min="0" max="1" value="0" step="0.1" aria-label="音频进度">
            <span data-audio-duration>--:--</span>
          </div>
        </figcaption>
      </figure>`
    }

    const title = token.title ? ` title="${escapeAttribute(token.title)}"` : ''
    const external = !resourceToken.internal && isExternalLink(token.href)
      ? ' target="_blank" rel="noreferrer"'
      : ''

    return `<a href="${href}"${title}${external}>${label}</a>`
  }

  return renderer
}

export const getNanqiangDocument = async (id: string) => {
  const decodedId = safeDecode(id)
  const source = documentSources.get(id)
    || documentSources.get(decodedId)
    || documentSources.get(encodeURIComponent(id))
    || documentSources.get(encodeURIComponent(decodedId))

  if (!source) return

  const rawContent = await source.load()
  const content = typeof rawContent === 'string'
    ? rawContent
    : (rawContent as { default?: string })?.default ?? String(rawContent)

  return {
    id,
    title: titleFromSource(content, source.sourcePath),
    sourcePath: source.sourcePath,
    content,
    kind: source.kind
  } satisfies NanqiangDocument
}

export const renderNanqiangMarkdown = async (document: NanqiangDocument) => {
  const renderer = createRenderer()
  const parser = new Marked()
  parser.use({ extensions: [starQuoteExtension] })
  parser.setOptions({
    async: true,
    breaks: true,
    gfm: true,
    renderer,
    async walkTokens(token) {
      if (token.type !== 'link' && token.type !== 'image') return

      const resourceToken = token as ResourceToken
      const cleanHref = safeDecode(token.href.split(/[?#]/)[0] ?? '')
      const targetId = cleanHref.replace(/\.(md|csv)$/i, '').replace(/^\.\//, '')
      const documentId = targetId.split('/').at(-1) ?? targetId

      if (targetId && documentSources.has(targetId)) {
        token.href = `/nanqiang-beidiao/${encodeURIComponent(targetId)}`
        resourceToken.internal = true
        return
      } else if (documentId && documentSources.has(documentId)) {
        token.href = `/nanqiang-beidiao/${encodeURIComponent(documentId)}`
        resourceToken.internal = true
        return
      }

      if (isExternalLink(token.href)) return

      const resourcePath = resolveResource(document.sourcePath, token.href)
      const loadResource = assetLoaders[resourcePath]
      if (!loadResource) return

      const resourceUrl = typeof loadResource === 'function'
        ? await loadResource()
        : loadResource
      token.href = resourceUrl
      if (/\.mp3(?:[?#].*)?$/i.test(resourcePath)) resourceToken.resourceType = 'audio'
    }
  })

  return await parser.parse(document.content)
}

export const parseNanqiangCsv = (document: NanqiangDocument) => {
  return parse(document.content, {
    bom: true,
    skip_empty_lines: true
  }) as string[][]
}

export const getNanqiangPageDocument = async (id: string): Promise<NanqiangPageDocument | null> => {
  const document = await getNanqiangDocument(id)
  if (!document) return null

  if (document.kind === 'markdown') {
    return {
      id: document.id,
      title: document.title,
      kind: 'markdown',
      html: await renderNanqiangMarkdown(document)
    }
  }

  return {
    id: document.id,
    title: document.title,
    kind: 'csv',
    rows: parseNanqiangCsv(document)
  }
}
