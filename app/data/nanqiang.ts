import { Marked, Renderer, type Tokens } from 'marked'
import Papa from 'papaparse'

export interface NanqiangDocument {
  id: string
  title: string
  sourcePath: string
  content: string
  kind: 'markdown' | 'csv'
}

export interface NanqiangIndexItem {
  id: string
  title: string
  featured: boolean
  date?: string
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

interface DocumentSource {
  sourcePath: string
  kind: 'markdown' | 'csv'
  load: SourceLoader
}

const rootSources = import.meta.glob('./nanqiang/index.md', {
  eager: true,
  query: '?raw',
  import: 'default'
}) as Record<string, string>

const rawMarkdownSources = import.meta.glob('./nanqiang/**/*.md', {
  eager: true,
  query: '?raw',
  import: 'default'
}) as Record<string, string>

const rawCsvSources = import.meta.glob('./nanqiang/**/*.csv', {
  eager: true,
  query: '?raw',
  import: 'default'
}) as Record<string, string>

const rawAssetLoaders = import.meta.glob(
  './nanqiang/**/*.{png,jpg,jpeg,gif,webp,svg,mp3,pdf,html}',
  { query: '?url', import: 'default' }
) as Record<string, () => Promise<any>>

const canonicalizeMap = <T>(map: Record<string, T>) => {
  return Object.fromEntries(Object.entries(map).map(([sourcePath, value]) => {
    return [sourcePath.replace(/^\.\//, '/app/data/'), value]
  }))
}

const markdownSources = canonicalizeMap(rawMarkdownSources)
const csvSources = canonicalizeMap(rawCsvSources)
const assetLoaders = canonicalizeMap(rawAssetLoaders)

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

const documentDates: Record<string, string> = {
  '有个爱你的人不容易': '2018-07-21',
  'DOM0&DOM2级事件绑定的区别': '2019-08-20',
  'Prettier 整合 ESLint 所引发的问题': '2020-06-23',
  'vue源码之Reflect': '2022-02-13',
  '如何优雅地使用MacBook': '2022-06-01',
  '关于Yak Shaving ── 从理解 TS 中 any 与 unknow 的区别中学英语': '2022-08-23'
}

const rootSource = Object.values(rootSources)[0] ?? ''
const indexLinks: Tokens.Link[] = []
const indexParser = new Marked()

indexParser.walkTokens(indexParser.lexer(rootSource), (token) => {
  if (token.type === 'link' && /\.md$/i.test(token.href)) {
    indexLinks.push(token as Tokens.Link)
  }
})

export const nanqiangIndex: NanqiangIndexItem[] = indexLinks
  .map((link) => {
    const rawTitle = link.text
    const rawHref = link.href
    const decodedHref = safeDecode(rawHref.replace(/\.md$/i, ''))
    const id = decodedHref.split('/').at(-1) ?? decodedHref
    return {
      id,
      title: stripMarkdown(rawTitle),
      featured: /\*\*/.test(rawTitle),
      date: documentDates[id]
    }
  })
  .filter((item) => item.id && documentSources.has(item.id))
  .reverse()

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

      token.href = await loadResource()
      if (/\.mp3(?:[?#].*)?$/i.test(resourcePath)) resourceToken.resourceType = 'audio'
    }
  })

  return await parser.parse(document.content)
}

export const parseNanqiangCsv = (document: NanqiangDocument) => {
  const result = Papa.parse<string[]>(document.content, {
    skipEmptyLines: true
  })

  return result.data
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
