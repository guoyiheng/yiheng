import { parse, type HTMLElement } from 'node-html-parser'

interface TrophyCounts {
  platinum: number
  gold: number
  silver: number
  bronze: number
}

const PSN_ID_PATTERN = /^[a-z][a-z0-9_-]{2,15}$/i
const PSNINE_ORIGIN = 'https://psnine.com'
const MINIMUM_DURATION_DAYS = 5
const PROFILE_CACHE_SECONDS = 30 * 24 * 60 * 60
const PROFILE_REVALIDATE_SECONDS = 7 * 24 * 60 * 60
const ALLOWED_IMAGE_HOSTS = new Set([
  'image.api.playstation.com',
  'psn-rsc.prod.dl.playstation.net',
  'psnobj.prod.dl.playstation.net',
  'static-resource.np.community.playstation.net'
])

const text = (value?: string) => value?.replace(/\s+/g, ' ').trim() ?? ''

const numberFrom = (value?: string) => {
  const matched = value?.match(/[\d.]+/)
  return matched ? Number(matched[0]) : 0
}

const parseTrophies = (values: string[]): TrophyCounts => ({
  platinum: numberFrom(values.find(value => value.startsWith('白'))),
  gold: numberFrom(values.find(value => value.startsWith('金'))),
  silver: numberFrom(values.find(value => value.startsWith('银'))),
  bronze: numberFrom(values.find(value => value.startsWith('铜')))
})

const durationInDays = (value: string) => {
  const amount = numberFrom(value)

  if (value.includes('年')) return amount * 365
  if (value.includes('个月') || value.includes('月')) return amount * 30
  if (value.includes('天')) return amount
  if (value.includes('小时')) return amount / 24
  if (value.includes('分钟')) return amount / 1440
  return 0
}

const pageFrom = (value?: string) => {
  if (!value) return 0

  try {
    return numberFrom(new URL(value, PSNINE_ORIGIN).searchParams.get('page') ?? '')
  } catch {
    return 0
  }
}

const safeImageUrl = (value?: string) => {
  if (!value) return ''

  try {
    const url = new URL(value)
    return url.protocol === 'https:' && ALLOWED_IMAGE_HOSTS.has(url.hostname) ? url.href : ''
  } catch {
    return ''
  }
}

const imageProxyUrl = (value: string) => {
  const token = btoa(value).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '')
  return `/media/psn/${token}.png`
}

const fetchPage = async (url: string) => {
  let response: Response

  try {
    response = await fetch(url, {
      headers: {
        accept: 'text/html,application/xhtml+xml',
        'user-agent': 'yiheng.run/1.0'
      },
      signal: AbortSignal.timeout(8000)
    })
  } catch {
    throw createError({ statusCode: 502, message: '账号资料暂时无法读取' })
  }

  if (response.status === 404) {
    throw createError({ statusCode: 404, message: '没有找到这个公开账号' })
  }

  if (!response.ok) {
    throw createError({ statusCode: 502, message: '账号资料暂时无法读取' })
  }

  return response.text()
}

const parseGameRows = (root: HTMLElement) => {
  return root.querySelectorAll('table.list tr').flatMap((row) => {
    const link = row.querySelector('a[href*="/psngame/"]')
    const titleLink = row.querySelector('td:nth-child(2) p a')
    if (!link || !titleLink) return []

    const durationCell = row.querySelectorAll('td').find((cell) => {
      return text(cell.querySelector('em')?.textContent) === '总耗时'
    })
    const duration = text(durationCell?.childNodes
      .filter(node => node.nodeType === 3)
      .map(node => node.textContent)
      .join(''))
    const durationDays = durationInDays(duration)

    if (durationDays < MINIMUM_DURATION_DAYS) return []

    const href = link.getAttribute('href') ?? ''
    const imageUrl = safeImageUrl(row.querySelector('img.imgbgnb')?.getAttribute('src'))
    const trophyValues = row.querySelectorAll('small span').map(node => text(node.textContent))

    return [{
      id: href.match(/\/psngame\/(\d+)/)?.[1] ?? href,
      title: text(titleLink.textContent),
      platform: text(row.querySelector('td:nth-child(2) > span')?.textContent),
      updatedAt: text(row.querySelector('td:nth-child(2) small')?.textContent),
      duration,
      durationDays,
      progress: numberFrom(text(row.querySelector('.progress div')?.textContent)),
      image: imageUrl ? imageProxyUrl(imageUrl) : '',
      trophies: parseTrophies(trophyValues),
      url: href.startsWith('http') ? href : `${PSNINE_ORIGIN}${href}`
    }]
  })
}

export default defineEventHandler(async (event) => {
  const psnId = getRouterParam(event, 'psnid')?.trim() ?? ''

  if (!PSN_ID_PATTERN.test(psnId)) {
    throw createError({ statusCode: 400, message: 'PSN ID 格式不正确' })
  }

  const profileUrl = `${PSNINE_ORIGIN}/psnid/${encodeURIComponent(psnId)}`
  const gamesUrl = `${profileUrl}/psngame`
  const [profileHtml, firstGamesHtml] = await Promise.all([
    fetchPage(profileUrl),
    fetchPage(gamesUrl)
  ])

  const profileRoot = parse(profileHtml)
  const profileName = profileRoot.querySelector('.psnava .avabig')?.getAttribute('alt')

  if (!profileName) {
    throw createError({ statusCode: 404, message: '没有找到这个公开账号' })
  }

  const firstGamesRoot = parse(firstGamesHtml)
  const pageCount = Math.max(1, ...firstGamesRoot.querySelectorAll('.page a[href*="page="]')
    .map(link => pageFrom(link.getAttribute('href'))))
  const remainingPages = await Promise.all(
    Array.from({ length: pageCount - 1 }, (_, index) => {
      return fetchPage(`${gamesUrl}?page=${index + 2}`)
    })
  )

  const gamesById = new Map<string, ReturnType<typeof parseGameRows>[number]>()
  for (const root of [firstGamesRoot, ...remainingPages.map(html => parse(html))]) {
    for (const game of parseGameRows(root)) gamesById.set(game.id, game)
  }

  setResponseHeader(
    event,
    'Cache-Control',
    [
      'public',
      'max-age=300',
      `s-maxage=${PROFILE_CACHE_SECONDS}`,
      `stale-while-revalidate=${PROFILE_REVALIDATE_SECONDS}`,
      `stale-if-error=${PROFILE_CACHE_SECONDS}`
    ].join(', ')
  )

  return {
    id: profileName,
    trophies: parseTrophies(
      profileRoot.querySelectorAll('.psntrophy span').map(node => text(node.textContent))
    ),
    games: [...gamesById.values()],
    profileUrl
  }
})
