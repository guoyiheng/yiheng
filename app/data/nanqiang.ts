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
}

type ResourceToken = (Tokens.Link | Tokens.Image) & {
  internal?: boolean
  resourceType?: 'audio'
}

const rawMarkdownSources = import.meta.glob('../../original-data/**/*.md', {
  eager: true,
  query: '?raw',
  import: 'default'
}) as Record<string, string>

const rawCsvSources = import.meta.glob('../../original-data/**/*.csv', {
  eager: true,
  query: '?raw',
  import: 'default'
}) as Record<string, string>

const rawAssetUrls = import.meta.glob(
  '../../original-data/**/*.{png,jpg,jpeg,gif,webp,svg,mp3,pdf,html}',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>

const canonicalizeSourceMap = (sourceMap: Record<string, string>) => {
  return Object.fromEntries(Object.entries(sourceMap).map(([sourcePath, value]) => {
    return [sourcePath.replace(/^\.\.\/\.\.\//, '/'), value]
  }))
}

const markdownSources = canonicalizeSourceMap(rawMarkdownSources)
const csvSources = canonicalizeSourceMap(rawCsvSources)
const assetUrls = canonicalizeSourceMap(rawAssetUrls)

const documentIdPattern = /([0-9a-f]{32})(?:_all)?\.(md|csv)$/i
const rootPageId = 'cb9ad85347e3454a8887ea13f3a63aa2'

const stripMarkdown = (value: string) => value
  .replace(/\*\*|__|\*|_|`/g, '')
  .trim()

const titleFromSource = (source: string, sourcePath: string) => {
  const heading = source.match(/^#\s+(.+)$/m)?.[1]
  if (heading) return stripMarkdown(heading)

  return stripMarkdown(sourcePath.split('/').at(-1)?.replace(documentIdPattern, '') ?? '无标题')
}

const documents = new Map<string, NanqiangDocument>()

for (const [sourcePath, content] of Object.entries(markdownSources)) {
  const id = sourcePath.match(documentIdPattern)?.[1]
  if (!id || id === rootPageId) continue

  documents.set(id, {
    id,
    title: titleFromSource(content, sourcePath),
    sourcePath,
    content,
    kind: 'markdown'
  })
}

for (const [sourcePath, content] of Object.entries(csvSources)) {
  if (sourcePath.endsWith('_all.csv')) continue

  const id = sourcePath.match(documentIdPattern)?.[1]
  if (!id) continue

  documents.set(id, {
    id,
    title: titleFromSource('', sourcePath),
    sourcePath,
    content,
    kind: 'csv'
  })
}

const rootSource = Object.entries(markdownSources).find(([sourcePath]) => {
  return sourcePath.includes(rootPageId)
})?.[1] ?? ''

export const nanqiangIndex: NanqiangIndexItem[] = [...rootSource.matchAll(/\[([^\]]+)\]\(([^)]+\.md)\)/g)]
  .map((match) => {
    const rawTitle = match[1] ?? ''
    const rawHref = match[2] ?? ''
    const id = rawHref.match(/([0-9a-f]{32})\.md$/i)?.[1] ?? ''
    return {
      id,
      title: stripMarkdown(rawTitle),
      featured: /\*\*/.test(rawTitle)
    }
  })
  .filter((item) => item.id && documents.has(item.id))

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

const createRenderer = () => {
  const renderer = new Renderer()

  renderer.html = ({ text }) => {
    const trimmed = text.trim()
    if (/^<\/?aside>$/i.test(trimmed)) return trimmed
    if (/^<br\s*\/?>$/i.test(trimmed)) return '<br>'
    return escapeHtml(text)
  }

  renderer.link = function (token) {
    const resourceToken = token as ResourceToken
    const label = this.parser.parseInline(token.tokens)
    const href = escapeAttribute(token.href)

    if (resourceToken.resourceType === 'audio') {
      return `<audio controls preload="none" src="${href}">${label}</audio>`
    }

    const title = token.title ? ` title="${escapeAttribute(token.title)}"` : ''
    const external = !resourceToken.internal && isExternalLink(token.href)
      ? ' target="_blank" rel="noreferrer"'
      : ''

    return `<a href="${href}"${title}${external}>${label}</a>`
  }

  return renderer
}

export const getNanqiangDocument = (id: string) => documents.get(id)

export const renderNanqiangMarkdown = (document: NanqiangDocument) => {
  const renderer = createRenderer()
  const parser = new Marked({
    gfm: true,
    renderer,
    walkTokens(token) {
      if (token.type !== 'link' && token.type !== 'image') return

      const resourceToken = token as ResourceToken
      const documentId = token.href.match(/([0-9a-f]{32})\.(?:md|csv)(?:[?#].*)?$/i)?.[1]

      if (documentId && documents.has(documentId)) {
        token.href = `/nanqiang-beidiao/${documentId}`
        resourceToken.internal = true
        return
      }

      if (isExternalLink(token.href)) return

      const resourcePath = resolveResource(document.sourcePath, token.href)
      const resourceUrl = assetUrls[resourcePath]
      if (!resourceUrl) return

      token.href = resourceUrl
      if (/\.mp3(?:[?#].*)?$/i.test(resourcePath)) resourceToken.resourceType = 'audio'
    }
  })

  const output = parser.parse(document.content)
  return typeof output === 'string' ? output : ''
}

export const parseNanqiangCsv = (document: NanqiangDocument) => {
  const result = Papa.parse<string[]>(document.content, {
    skipEmptyLines: true
  })

  return result.data
}
