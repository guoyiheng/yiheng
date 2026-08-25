import { parse, type HTMLElement } from 'node-html-parser'

interface DoubanMovie {
  id: string
  rank: number
  title: string
  originalTitle: string
  year: string
  countries: string
  genres: string
  director: string
  cast: string
  rating: number
  votes: number
  quote: string
  posterUrl: string
  detailUrl: string
}

interface DepartedDoubanMovie extends DoubanMovie {
  previousRank: number
  departedAt: string
}

interface DoubanSnapshot {
  version: 1
  updatedAt: string
  nextRefreshAt: string
  items: DoubanMovie[]
  departedItems: DepartedDoubanMovie[]
  newEntryIds: string[]
}

interface DoubanTop250Response {
  updatedAt: string
  items: DoubanMovie[]
  departedItems: DepartedDoubanMovie[]
  newEntryIds: string[]
}

const DOUBAN_ORIGIN = 'https://movie.douban.com'
const PAGE_SIZE = 25
const PAGE_COUNT = 10
const TOP_250_SIZE = PAGE_SIZE * PAGE_COUNT
const REQUEST_TIMEOUT = 10_000
const REFRESH_HOUR_IN_CHINA = 4
const CHINA_TIME_OFFSET = 8 * 60 * 60 * 1000
const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000
const SNAPSHOT_KEY = 'top250'

let snapshot: DoubanSnapshot | null = null
let snapshotLoadRequest: Promise<DoubanSnapshot | null> | null = null
let pendingRefresh: Promise<DoubanSnapshot> | null = null

const cleanText = (value?: string) => value?.replace(/\s+/g, ' ').trim() ?? ''

const safeUrl = (value: string, allowedHosts: string[]) => {
  try {
    const url = new URL(value, DOUBAN_ORIGIN)
    if (url.protocol !== 'https:' || !allowedHosts.includes(url.hostname)) return ''
    return url.href
  } catch {
    return ''
  }
}

const subjectIdFrom = (detailUrl: string) => {
  try {
    return new URL(detailUrl).pathname.match(/^\/subject\/(\d+)\/?$/)?.[1] ?? ''
  } catch {
    return ''
  }
}

const numberFrom = (value: string) => {
  const matched = value.match(/[\d.]+/)
  return matched ? Number(matched[0]) : 0
}

const nextDailyRefreshAt = (now = new Date()) => {
  const chinaNow = new Date(now.getTime() + CHINA_TIME_OFFSET)
  let refreshInChina = Date.UTC(
    chinaNow.getUTCFullYear(),
    chinaNow.getUTCMonth(),
    chinaNow.getUTCDate(),
    REFRESH_HOUR_IN_CHINA
  )

  if (chinaNow.getTime() >= refreshInChina) refreshInChina += DAY_IN_MILLISECONDS
  return new Date(refreshInChina - CHINA_TIME_OFFSET).toISOString()
}

const parseMovie = (item: HTMLElement): DoubanMovie | null => {
  const rank = Number(cleanText(item.querySelector('.pic em')?.textContent))
  const titles = item.querySelectorAll('.hd .title').map(node => cleanText(node.textContent))
  const detailUrl = safeUrl(item.querySelector('.hd a')?.getAttribute('href') ?? '', [
    'movie.douban.com',
    'www.douban.com'
  ])
  const id = subjectIdFrom(detailUrl)
  const poster = item.querySelector('.pic img')
  const posterUrl = safeUrl(
    poster?.getAttribute('src') ?? poster?.getAttribute('data-original') ?? '',
    ['img1.doubanio.com', 'img2.doubanio.com', 'img3.doubanio.com', 'img9.doubanio.com']
  )
  const details = cleanText(item.querySelector('.bd p')?.textContent)
  const yearMatch = details.match(/\b(\d{4})\b/)
  const metadata = yearMatch ? details.slice(yearMatch.index) : ''
  const metadataParts = metadata.split(/\s*\/\s*/).filter(Boolean)
  const rating = numberFrom(cleanText(item.querySelector('.rating_num')?.textContent))
  const voteText = cleanText(item.querySelector('.bd div span:last-child')?.textContent)
  const quote = cleanText(item.querySelector('.quote span')?.textContent)

  if (!id || !rank || !titles[0] || !detailUrl) return null

  return {
    id,
    rank,
    title: titles[0],
    originalTitle: titles[1]?.replace(/^\/\s*/, '') ?? '',
    year: metadataParts[0] ?? '',
    countries: metadataParts[1] ?? '',
    genres: metadataParts.slice(2).join(' / '),
    director: details.match(/^导演:\s*(.*?)(?:\s+主演:|$)/)?.[1]?.trim() ?? '',
    cast: details.match(/主演:\s*(.*?)(?:\s+\d{4}\s*\/|$)/)?.[1]?.replace(/\s*\/\.\.\.$|\.{3}$/, '').trim() ?? '',
    rating,
    votes: numberFrom(voteText),
    quote,
    posterUrl,
    detailUrl
  }
}

const fetchPage = async (start: number) => {
  let response: Response

  try {
    response = await fetch(`${DOUBAN_ORIGIN}/top250?start=${start}&filter=`, {
      cache: 'no-store',
      headers: {
        accept: 'text/html,application/xhtml+xml',
        'user-agent': 'yiheng.run/1.0'
      },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT)
    })
  } catch {
    throw createError({ statusCode: 502, message: '豆瓣榜单暂时无法读取' })
  }

  if (!response.ok) {
    throw createError({ statusCode: 502, message: '豆瓣榜单暂时无法读取' })
  }

  const root = parse(await response.text())
  return root.querySelectorAll('ol.grid_view > li .item').flatMap(item => {
    const movie = parseMovie(item)
    return movie ? [movie] : []
  })
}

const loadTop250Attempt = async () => {
  const movies: DoubanMovie[] = []

  for (let batch = 0; batch < PAGE_COUNT; batch += 3) {
    const starts = Array.from(
      { length: Math.min(3, PAGE_COUNT - batch) },
      (_, index) => (batch + index) * PAGE_SIZE
    )
    const pages = await Promise.all(starts.map(start => fetchPage(start)))
    movies.push(...pages.flat())
  }

  const uniqueMovies = new Map(movies.map(movie => [movie.id, movie]))
  const result = [...uniqueMovies.values()].sort((a, b) => a.rank - b.rank)
  const ranks = new Set(result.map(movie => movie.rank))
  const hasEveryRank = Array.from({ length: TOP_250_SIZE }, (_, index) => index + 1)
    .every(rank => ranks.has(rank))

  if (result.length !== TOP_250_SIZE || !hasEveryRank) {
    throw createError({ statusCode: 502, message: '豆瓣榜单暂时无法读取' })
  }

  return result
}

const loadTop250 = async () => {
  let lastError: unknown

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      return await loadTop250Attempt()
    } catch (error) {
      lastError = error
    }
  }

  throw lastError
}

const isSnapshot = (value: unknown): value is DoubanSnapshot => {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Partial<DoubanSnapshot>

  return candidate.version === 1
    && typeof candidate.updatedAt === 'string'
    && typeof candidate.nextRefreshAt === 'string'
    && Array.isArray(candidate.items)
    && candidate.items.length === TOP_250_SIZE
    && Array.isArray(candidate.departedItems)
    && Array.isArray(candidate.newEntryIds)
}

const toResponse = (value: DoubanSnapshot): DoubanTop250Response => ({
  updatedAt: value.updatedAt,
  items: value.items,
  departedItems: value.departedItems,
  newEntryIds: value.newEntryIds
})

const readSnapshot = async () => {
  if (snapshot) return snapshot
  if (snapshotLoadRequest) return snapshotLoadRequest

  snapshotLoadRequest = useStorage('douban')
    .getItem<unknown>(SNAPSHOT_KEY)
    .then((stored) => {
      snapshot = isSnapshot(stored) ? stored : null
      return snapshot
    })
    .catch(() => null)
    .finally(() => {
      snapshotLoadRequest = null
    })

  return snapshotLoadRequest
}

const createSnapshot = (
  items: DoubanMovie[],
  previous: DoubanSnapshot | null,
  now = new Date()
): DoubanSnapshot => {
  const currentIds = new Set(items.map(movie => movie.id))
  const previousIds = new Set(previous?.items.map(movie => movie.id) ?? [])
  const newEntryIds = items.filter(movie => !previousIds.has(movie.id)).map(movie => movie.id)
  const departed = previous?.items.filter(movie => !currentIds.has(movie.id)) ?? []
  const membershipChanged = newEntryIds.length > 0 || departed.length > 0
  const departedById = new Map(
    (previous?.departedItems ?? [])
      .filter(movie => !currentIds.has(movie.id))
      .map(movie => [movie.id, movie])
  )

  for (const movie of departed) {
    departedById.set(movie.id, {
      ...movie,
      previousRank: movie.rank,
      departedAt: now.toISOString()
    })
  }

  return {
    version: 1,
    updatedAt: now.toISOString(),
    nextRefreshAt: nextDailyRefreshAt(now),
    items,
    departedItems: [...departedById.values()].sort((a, b) => {
      return b.departedAt.localeCompare(a.departedAt) || a.previousRank - b.previousRank
    }),
    newEntryIds: previous
      ? membershipChanged
        ? newEntryIds
        : previous.newEntryIds.filter(id => currentIds.has(id))
      : []
  }
}

const refreshSnapshot = (previous: DoubanSnapshot | null) => {
  if (pendingRefresh) return pendingRefresh

  pendingRefresh = loadTop250()
    .then(async (items) => {
      const nextSnapshot = createSnapshot(items, previous)
      snapshot = nextSnapshot
      await useStorage('douban').setItem(SNAPSHOT_KEY, nextSnapshot).catch((error) => {
        console.error('Failed to persist Douban Top 250 snapshot', error)
      })
      return nextSnapshot
    })
    .finally(() => {
      pendingRefresh = null
    })

  return pendingRefresh
}

export default defineEventHandler(async (event) => {
  const storedSnapshot = await readSnapshot()
  const isFresh = storedSnapshot
    && Date.parse(storedSnapshot.nextRefreshAt) > Date.now()

  setResponseHeader(
    event,
    'Cache-Control',
    'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400, stale-if-error=604800'
  )

  if (isFresh) return toResponse(storedSnapshot)

  if (storedSnapshot) {
    void refreshSnapshot(storedSnapshot).catch(() => undefined)
    return toResponse(storedSnapshot)
  }

  return refreshSnapshot(null).then(toResponse)
})
