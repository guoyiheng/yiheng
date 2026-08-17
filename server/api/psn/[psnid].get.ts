import { parse } from 'node-html-parser'

interface TrophyCounts {
  platinum: number
  gold: number
  silver: number
  bronze: number
}

const PSN_ID_PATTERN = /^[a-z][a-z0-9_-]{2,15}$/i
const PSNINE_ORIGIN = 'https://psnine.com'
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

const safeImageUrl = (value?: string) => {
  if (!value) return ''

  try {
    const url = new URL(value)
    return url.protocol === 'https:' && ALLOWED_IMAGE_HOSTS.has(url.hostname) ? url.href : ''
  } catch {
    return ''
  }
}

export default defineEventHandler(async (event) => {
  const psnId = getRouterParam(event, 'psnid')?.trim() ?? ''

  if (!PSN_ID_PATTERN.test(psnId)) {
    throw createError({ statusCode: 400, message: 'PSN ID 格式不正确' })
  }

  const sourceUrl = `${PSNINE_ORIGIN}/psnid/${encodeURIComponent(psnId)}`
  let response: Response

  try {
    response = await fetch(sourceUrl, {
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

  const root = parse(await response.text())
  const profileName = root.querySelector('.psnava .avabig')?.getAttribute('alt')

  if (!profileName) {
    throw createError({ statusCode: 404, message: '没有找到这个公开账号' })
  }

  const summary = new Map<string, number>()
  const infoBlocks = root.querySelectorAll('.psninfo')
  const summaryCells = infoBlocks.at(-1)?.querySelectorAll('td') ?? []

  for (const cell of summaryCells) {
    const label = text(cell.querySelector('em')?.textContent)
    if (label) summary.set(label, numberFrom(text(cell.textContent)))
  }

  const games = root.querySelectorAll('table.list tr').slice(0, 12).flatMap((row) => {
    const link = row.querySelector('a[href*="/psngame/"]')
    const image = row.querySelector('img.imgbgnb')
    const titleLink = row.querySelector('td:nth-child(2) p a')
    const progress = text(row.querySelector('.progress div')?.textContent)

    if (!link || !titleLink) return []

    const href = link.getAttribute('href') ?? ''
    const imageUrl = image?.getAttribute('src') ?? ''
    const trophyValues = row.querySelectorAll('small span').map(node => text(node.textContent))

    return [{
      id: href.match(/\/psngame\/(\d+)/)?.[1] ?? href,
      title: text(titleLink.textContent),
      platform: text(row.querySelector('td:nth-child(2) > span')?.textContent),
      updatedAt: text(row.querySelector('td:nth-child(2) small')?.textContent),
      progress: numberFrom(progress),
      image: safeImageUrl(imageUrl),
      trophies: parseTrophies(trophyValues),
      url: href.startsWith('http') ? href : `${PSNINE_ORIGIN}${href}`
    }]
  })

  setResponseHeader(event, 'Cache-Control', 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400')

  return {
    id: profileName,
    avatar: safeImageUrl(root.querySelector('.psnava .avabig')?.getAttribute('src')),
    level: numberFrom(text(root.querySelector('.text-level')?.textContent)),
    trophies: parseTrophies(
      root.querySelectorAll('.psntrophy span').map(node => text(node.textContent))
    ),
    gameCount: summary.get('总游戏') ?? games.length,
    completionCount: summary.get('完美数') ?? 0,
    completionRate: summary.get('完成率') ?? 0,
    games,
    profileUrl: sourceUrl
  }
})
