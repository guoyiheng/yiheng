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

type SourceLoader = () => Promise<string>

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

const rawMarkdownLoaders = import.meta.glob('./nanqiang/**/*.md', {
  query: '?raw',
  import: 'default'
}) as Record<string, SourceLoader>

const rawCsvLoaders = import.meta.glob('./nanqiang/**/*.csv', {
  query: '?raw',
  import: 'default'
}) as Record<string, SourceLoader>

const rawAssetLoaders = import.meta.glob(
  './nanqiang/**/*.{png,jpg,jpeg,gif,webp,svg,mp3,pdf,html}',
  { query: '?url', import: 'default' }
) as Record<string, SourceLoader>

const canonicalizeLoaderMap = (loaders: Record<string, SourceLoader>) => {
  return Object.fromEntries(Object.entries(loaders).map(([sourcePath, load]) => {
    return [sourcePath.replace(/^\.\//, '/app/data/'), load]
  }))
}

const markdownLoaders = canonicalizeLoaderMap(rawMarkdownLoaders)
const csvLoaders = canonicalizeLoaderMap(rawCsvLoaders)
const assetLoaders = canonicalizeLoaderMap(rawAssetLoaders)

const documentIdPattern = /\.([0-9a-f]{32})(?:\.all)?\.(md|csv)$/i

const stripMarkdown = (value: string) => value
  .replace(/\*\*|__|\*|_|`/g, '')
  .trim()

const titleFromSource = (source: string, sourcePath: string) => {
  const heading = source.match(/^#\s+(.+)$/m)?.[1]
  if (heading) return stripMarkdown(heading)

  return stripMarkdown(sourcePath.split('/').at(-1)?.replace(documentIdPattern, '') ?? '无标题')
}

const documentSources = new Map<string, DocumentSource>()

for (const [sourcePath, load] of Object.entries(markdownLoaders)) {
  const id = sourcePath.match(documentIdPattern)?.[1]
  if (!id) continue

  documentSources.set(id, {
    sourcePath,
    kind: 'markdown',
    load
  })
}

for (const [sourcePath, load] of Object.entries(csvLoaders)) {
  if (sourcePath.endsWith('.all.csv')) continue

  const id = sourcePath.match(documentIdPattern)?.[1]
  if (!id) continue

  documentSources.set(id, {
    sourcePath,
    kind: 'csv',
    load
  })
}

const documentDates: Record<string, string> = {
  '5506ef9d21f145c7b7f53dc6c07c90f5': '2018-07-21',
  'f629273353a949f4b6a7e3e29493018a': '2019-08-20',
  '3fad5fd6640b4143a51202f31538b333': '2020-06-23',
  'e639b7374631489d83b63983f8d07745': '2022-02-13',
  'a637ff9dad1748ff82d4af79bbed8b58': '2022-06-01',
  '566f8190fd244aa3bb3a8387a70afc56': '2022-08-23'
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
    const id = rawHref.match(/([0-9a-f]{32})\.md$/i)?.[1] ?? ''
    return {
      id,
      title: stripMarkdown(rawTitle),
      featured: /\*\*/.test(rawTitle),
      date: documentDates[id]
    }
  })
  .filter((item) => item.id && documentSources.has(item.id))
  .reverse()

const safeDecode = (value: string) => {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
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
    if (/^<\/?aside>$/i.test(trimmed)) return trimmed
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
  const source = documentSources.get(id)
  if (!source) return

  const content = await source.load()
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
      const documentId = token.href.match(/([0-9a-f]{32})\.(?:md|csv)(?:[?#].*)?$/i)?.[1]

      if (documentId && documentSources.has(documentId)) {
        token.href = `/nanqiang-beidiao/${documentId}`
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
