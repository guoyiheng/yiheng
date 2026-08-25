import { parse, type HTMLElement } from 'node-html-parser'

interface DoubanMovie {
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

const DOUBAN_ORIGIN = 'https://movie.douban.com'
const PAGE_SIZE = 25
const PAGE_COUNT = 10
const CACHE_TTL = 6 * 60 * 60 * 1000
const REQUEST_TIMEOUT = 10_000

let cache: { expiresAt: number; items: DoubanMovie[] } | null = null
let pendingRequest: Promise<DoubanMovie[]> | null = null

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

const numberFrom = (value: string) => {
  const matched = value.match(/[\d.]+/)
  return matched ? Number(matched[0]) : 0
}

const parseMovie = (item: HTMLElement): DoubanMovie | null => {
  const rank = Number(cleanText(item.querySelector('.pic em')?.textContent))
  const titles = item.querySelectorAll('.hd .title').map(node => cleanText(node.textContent))
  const detailUrl = safeUrl(item.querySelector('.hd a')?.getAttribute('href') ?? '', [
    'movie.douban.com',
    'www.douban.com'
  ])
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

  if (!rank || !titles[0] || !detailUrl) return null

  return {
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

const loadTop250 = async () => {
  const movies: DoubanMovie[] = []

  for (let batch = 0; batch < PAGE_COUNT; batch += 3) {
    const starts = Array.from(
      { length: Math.min(3, PAGE_COUNT - batch) },
      (_, index) => (batch + index) * PAGE_SIZE
    )
    const pages = await Promise.all(starts.map(start => fetchPage(start)))
    movies.push(...pages.flat())
  }

  const uniqueMovies = new Map(movies.map(movie => [movie.rank, movie]))
  const result = [...uniqueMovies.values()].sort((a, b) => a.rank - b.rank)

  if (result.length < 200) {
    throw createError({ statusCode: 502, message: '豆瓣榜单暂时无法读取' })
  }

  return result
}

export default defineEventHandler(async () => {
  const now = Date.now()
  if (cache && cache.expiresAt > now) return cache.items
  if (pendingRequest) return pendingRequest

  pendingRequest = loadTop250()
    .then((items) => {
      cache = { expiresAt: Date.now() + CACHE_TTL, items }
      return items
    })
    .finally(() => {
      pendingRequest = null
    })

  return pendingRequest
})
