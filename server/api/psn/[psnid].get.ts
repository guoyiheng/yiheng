import { parse, type HTMLElement } from 'node-html-parser'

/**
 * PSN game policy:
 * - Edge responses expire together at 23:59 every Sunday in Asia/Shanghai, with a maximum TTL of 7 days.
 * - Games played within 7 days are always shown; older games require at least 5 days played and 9% progress.
 * - All game pages are merged by PSN game ID before filtering.
 */

interface TrophyCounts {
  platinum: number
  gold: number
  silver: number
  bronze: number
}

const PSN_ID_PATTERN = /^[a-z][a-z0-9_-]{2,15}$/i
const PSNINE_ORIGIN = 'https://psnine.com'
const MINIMUM_DURATION_DAYS = 5
const MINIMUM_PROGRESS = 9
const RECENT_PLAYED_DAYS_WITHOUT_FILTER = 7
const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000
const PROFILE_CACHE_SECONDS = 7 * 24 * 60 * 60
const PROFILE_REVALIDATE_SECONDS = 60 * 60
const CHINA_TIME_OFFSET_HOURS = 8
const WEEKLY_REFRESH_DAY = 0
const WEEKLY_REFRESH_HOUR = 23
const WEEKLY_REFRESH_MINUTE = 59
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

const GAME_TITLE_OVERRIDES: Record<string, string> = {
  '天国 拯救': '天国：拯救',
  '明末 渊虚之羽': '明末：渊虚之羽',
  '卧龙 苍天陨落': '卧龙：苍天陨落',
  '漫威蜘蛛侠 Remastered': '漫威蜘蛛侠：重制版',
  '刺客信条 幻景': '刺客信条：幻景',
  '只狼 影逝二度': '只狼：影逝二度',
  '黑暗之魂3': '黑暗之魂 III',
  '波斯王子 Rogue': '波斯王子：Rogue',
  '黑暗之魂2 原罪学者': '黑暗之魂 II：原罪学者',
  '最终幻想7 重制版': '最终幻想 VII：重制版',
  '侠盗猎车手3 最终版': '侠盗猎车手 III：最终版',
  '渡神纪 芬尼斯崛起': '渡神纪：芬尼斯崛起',
  '索尼克 未知边境': '索尼克：未知边境',
  '星球大战 绝地 幸存者': '星球大战 绝地：幸存者',
  '波斯王子 失落的王冠': '波斯王子：失落的王冠',
  '刺客信条 兄弟会': '刺客信条：兄弟会',
  '上古卷轴5 天际': '上古卷轴 V：天际',
  '战神 诸神黄昏': '战神：诸神黄昏',
  '战神3 Remastered': '战神 III：重制版',
  '漫威蜘蛛侠2': '漫威蜘蛛侠 2',
  '仁王2': '仁王 2',
  '漫威蜘蛛侠 迈尔斯 莫拉莱斯': '漫威蜘蛛侠：迈尔斯·莫拉莱斯',
  '如龙 维新 极': '如龙 维新！极',
  '瑞奇与叮当 时空跳转': '瑞奇与叮当：时空跳转',
  '血污 夜之仪式': '血污：夜之仪式',
  '龙珠Z 卡卡洛特': '龙珠 Z：卡卡洛特',
  '怪物猎人 崛起': '怪物猎人：崛起',
  '死亡搁浅 导演剪辑版': '死亡搁浅：导演剪辑版',
  '侠盗猎车手5': '侠盗猎车手 V',
  '最后生还者 第一幕': '最后生还者：第一部',
  '影子战术 将军之刃': '影子战术：将军之刃',
  '柯娜 精神之桥': '柯娜：精神之桥',
  '黑暗之魂 Remastered': '黑暗之魂：重制版',
  '荒野大镖客 救赎2': '荒野大镖客：救赎 2',
  '小骨 英雄杀手': '小骨：英雄杀手',
  '地平线 西之绝境': '地平线：西之绝境',
  '这是我的战争 最终剪辑版': '这是我的战争：最终剪辑版',
  '巫师3 狂猎': '巫师 3：狂猎',
  '神秘海域 盗贼传奇合辑': '神秘海域：盗贼传奇合辑',
  '底特律 化身为人': '底特律：化身为人',
  '刺客信条2': '刺客信条 II',
  '神秘海域4 盗贼末路': '神秘海域 4：盗贼末路',
  '刺客信条 英灵殿': '刺客信条：英灵殿',
  '最后生还者 Remastered': '最后生还者：重制版'
}

const canonicalGameTitle = (title: string) => GAME_TITLE_OVERRIDES[title] ?? title

const STEAM_GAME_URLS: Record<string, string> = {
  '女神异闻录5 皇家版': 'https://store.steampowered.com/app/1687950/',
  '堕落之主': 'https://store.steampowered.com/app/1501750/',
  '天国：拯救': 'https://store.steampowered.com/app/379430/',
  '往日不再': 'https://store.steampowered.com/app/1259420/',
  '明末：渊虚之羽': 'https://store.steampowered.com/app/2277560/',
  '卧龙：苍天陨落': 'https://store.steampowered.com/app/1448440/',
  '漫威蜘蛛侠：重制版': 'https://store.steampowered.com/app/1817070/',
  '刺客信条：幻景': 'https://store.steampowered.com/app/3035570/',
  '迷失': 'https://store.steampowered.com/app/1279320/',
  '战地5': 'https://store.steampowered.com/app/1238810/',
  '匹诺曹的谎言': 'https://store.steampowered.com/app/1627720/',
  '只狼：影逝二度': 'https://store.steampowered.com/app/814380/',
  '黑暗之魂 III': 'https://store.steampowered.com/app/374320/',
  '无名大鹅': 'https://store.steampowered.com/app/837470/',
  '波斯王子：Rogue': 'https://store.steampowered.com/app/2717880/',
  '黑暗之魂 II：原罪学者': 'https://store.steampowered.com/app/335300/',
  '最终幻想 VII：重制版': 'https://store.steampowered.com/app/1462040/',
  '战地1': 'https://store.steampowered.com/app/1238840/',
  '侠盗猎车手 III：最终版': 'https://store.steampowered.com/app/1546970/',
  '小丑牌': 'https://store.steampowered.com/app/2379780/',
  '上旋高手2K25': 'https://store.steampowered.com/app/1785650/',
  '兽人必须死！3': 'https://store.steampowered.com/app/1523260/',
  '渡神纪：芬尼斯崛起': 'https://store.steampowered.com/app/2221920/',
  '索尼克：未知边境': 'https://store.steampowered.com/app/1237320/',
  '霍格沃茨之遗': 'https://store.steampowered.com/app/990080/',
  '星球大战 绝地：幸存者': 'https://store.steampowered.com/app/1774580/',
  '死亡回归': 'https://store.steampowered.com/app/1649240/',
  '波斯王子：失落的王冠': 'https://store.steampowered.com/app/2751000/',
  '刺客信条：兄弟会': 'https://store.steampowered.com/app/48190/',
  '上古卷轴 V：天际': 'https://store.steampowered.com/app/489830/',
  '战神：诸神黄昏': 'https://store.steampowered.com/app/2322010/',
  '博德之门3': 'https://store.steampowered.com/app/1086940/',
  '逆转裁判123 成步堂精选集': 'https://store.steampowered.com/app/787480/',
  '漫威蜘蛛侠 2': 'https://store.steampowered.com/app/2651280/',
  '仁王 2': 'https://store.steampowered.com/app/1325200/',
  'GRIS': 'https://store.steampowered.com/app/683320/',
  '暗影火炬城': 'https://store.steampowered.com/app/1330470/',
  '侠盗猎车手 V': 'https://store.steampowered.com/app/271590/',
  '绝地求生': 'https://store.steampowered.com/app/578080/',
  '漫威蜘蛛侠：迈尔斯·莫拉莱斯': 'https://store.steampowered.com/app/1817080/',
  '如龙 维新！极': 'https://store.steampowered.com/app/1805480/',
  '瑞奇与叮当：时空跳转': 'https://store.steampowered.com/app/1898920/',
  '血污：夜之仪式': 'https://store.steampowered.com/app/692850/',
  '龙珠 Z：卡卡洛特': 'https://store.steampowered.com/app/851850/',
  '荣耀战魂': 'https://store.steampowered.com/app/304390/',
  '辐射4': 'https://store.steampowered.com/app/377160/',
  'EA SPORTS FC 24': 'https://store.steampowered.com/app/2195250/',
  '怪物猎人：崛起': 'https://store.steampowered.com/app/1446780/',
  '死亡搁浅：导演剪辑版': 'https://store.steampowered.com/app/1850570/',
  '最后生还者：第一部': 'https://store.steampowered.com/app/1888930/',
  '动物井': 'https://store.steampowered.com/app/813230/',
  '影子战术：将军之刃': 'https://store.steampowered.com/app/418240/',
  '柯娜：精神之桥': 'https://store.steampowered.com/app/1954200/',
  '无主之地3': 'https://store.steampowered.com/app/397540/',
  '艾迪芬奇的记忆': 'https://store.steampowered.com/app/501300/',
  '盐与献祭': 'https://store.steampowered.com/app/1940600/',
  '花园之间': 'https://store.steampowered.com/app/859980/',
  '黑暗之魂：重制版': 'https://store.steampowered.com/app/570940/',
  '潜水员戴夫': 'https://store.steampowered.com/app/1868140/',
  '蝙蝠侠 阿卡姆骑士': 'https://store.steampowered.com/app/208650/',
  '荒野大镖客：救赎 2': 'https://store.steampowered.com/app/1174180/',
  '小骨：英雄杀手': 'https://store.steampowered.com/app/1147560/',
  '师父': 'https://store.steampowered.com/app/2138710/',
  '极乐迪斯科': 'https://store.steampowered.com/app/632470/',
  '地平线：西之绝境': 'https://store.steampowered.com/app/2420110/',
  '这是我的战争：最终剪辑版': 'https://store.steampowered.com/app/282070/',
  '巫师 3：狂猎': 'https://store.steampowered.com/app/292030/',
  '神秘海域：盗贼传奇合辑': 'https://store.steampowered.com/app/1659420/',
  '双人成行': 'https://store.steampowered.com/app/1426210/',
  '控制': 'https://store.steampowered.com/app/870780/',
  '黄泉之路': 'https://store.steampowered.com/app/1370050/',
  '艾尔登法环': 'https://store.steampowered.com/app/1245620/',
  '空洞骑士': 'https://store.steampowered.com/app/367520/',
  '底特律：化身为人': 'https://store.steampowered.com/app/1080110/',
  '刺客信条 II': 'https://store.steampowered.com/app/33230/',
  '神秘海域 4：盗贼末路': 'https://store.steampowered.com/app/1659420/',
  '战神': 'https://store.steampowered.com/app/1593500/',
  'INSIDE': 'https://store.steampowered.com/app/304430/',
  '漫威蜘蛛侠': 'https://store.steampowered.com/app/1817070/',
  '刺客信条：英灵殿': 'https://store.steampowered.com/app/2208920/',
  '对马岛之魂': 'https://store.steampowered.com/app/2215430/'
}

const secondsUntilWeeklyRefresh = (now = new Date()) => {
  const chinaNow = new Date(now.getTime() + CHINA_TIME_OFFSET_HOURS * 60 * 60 * 1000)
  const day = chinaNow.getUTCDay()
  const secondsToday = chinaNow.getUTCHours() * 60 * 60
    + chinaNow.getUTCMinutes() * 60
    + chinaNow.getUTCSeconds()
  const refreshAt = WEEKLY_REFRESH_HOUR * 60 * 60 + WEEKLY_REFRESH_MINUTE * 60
  const daysUntilRefresh = (WEEKLY_REFRESH_DAY - day + 7) % 7
  let seconds = daysUntilRefresh * 24 * 60 * 60 + refreshAt - secondsToday

  if (seconds <= 0) seconds += PROFILE_CACHE_SECONDS

  return Math.min(seconds, PROFILE_CACHE_SECONDS)
}

const durationInDays = (value: string) => {
  const amount = numberFrom(value)

  if (value.includes('年')) return amount * 365
  if (value.includes('个月') || value.includes('月')) return amount * 30
  if (value.includes('天')) return amount
  if (value.includes('小时')) return amount / 24
  if (value.includes('分钟')) return amount / 1440
  return 0
}

const playedAtFrom = (value: string, now = new Date()) => {
  const chinaNow = new Date(now.getTime() + 8 * 60 * 60 * 1000)
  const currentYear = chinaNow.getUTCFullYear()
  const currentMonth = chinaNow.getUTCMonth() + 1
  const currentDay = chinaNow.getUTCDate()
  const time = value.match(/(\d{1,2}):(\d{2})/)
  const hour = Number(time?.[1] ?? 0)
  const minute = Number(time?.[2] ?? 0)
  const relativeDay = value.startsWith('今天')
    ? 0
    : value.startsWith('昨天')
      ? 1
      : value.startsWith('前天')
        ? 2
        : undefined

  if (relativeDay !== undefined) {
    return new Date(Date.UTC(
      currentYear,
      currentMonth - 1,
      currentDay - relativeDay,
      hour - 8,
      minute
    ))
  }

  const fullDate = value.match(/(\d{4})-(\d{1,2})-(\d{1,2})/)
  if (fullDate) {
    return new Date(Date.UTC(
      Number(fullDate[1]),
      Number(fullDate[2]) - 1,
      Number(fullDate[3]),
      hour - 8,
      minute
    ))
  }

  const shortDate = value.match(/(\d{1,2})-(\d{1,2})/)
  if (!shortDate) return null

  const month = Number(shortDate[1])
  const day = Number(shortDate[2])
  let year = currentYear
  let playedAt = new Date(Date.UTC(year, month - 1, day, hour - 8, minute))

  if (playedAt.getTime() > now.getTime() + DAY_IN_MILLISECONDS) {
    year -= 1
    playedAt = new Date(Date.UTC(year, month - 1, day, hour - 8, minute))
  }

  return playedAt
}

const wasPlayedRecently = (value: string, now = new Date()) => {
  const playedAt = playedAtFrom(value, now)
  if (!playedAt || Number.isNaN(playedAt.getTime())) return false

  const elapsed = now.getTime() - playedAt.getTime()
  return elapsed >= 0 && elapsed <= RECENT_PLAYED_DAYS_WITHOUT_FILTER * DAY_IN_MILLISECONDS
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
    const progress = numberFrom(text(row.querySelector('.progress div')?.textContent))

    const href = link.getAttribute('href') ?? ''
    const imageUrl = row.querySelector('img.imgbgnb')?.getAttribute('src') ?? ''
    const trophyValues = row.querySelectorAll('small span').map(node => text(node.textContent))

    const rawTitle = text(titleLink.textContent)
    const gameTitle = canonicalGameTitle(rawTitle)
    const steamUrl = STEAM_GAME_URLS[gameTitle] ?? STEAM_GAME_URLS[rawTitle] ?? ''
    const wikipediaFallbackUrl = gameTitle
      ? `https://zh.wikipedia.org/w/index.php?search=${encodeURIComponent(gameTitle)}`
      : 'https://zh.wikipedia.org/'

    return [{
      id: href.match(/\/psngame\/(\d+)/)?.[1] ?? href,
      title: gameTitle,
      platform: text(row.querySelector('td:nth-child(2) > span')?.textContent),
      updatedAt: text(row.querySelector('td:nth-child(2) small')?.textContent),
      duration,
      durationDays,
      progress,
      image: safeImageUrl(imageUrl),
      trophies: parseTrophies(trophyValues),
      url: steamUrl || wikipediaFallbackUrl
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

  const games = [...gamesById.values()].filter((game) => {
    if (wasPlayedRecently(game.updatedAt)) return true
    return game.durationDays >= MINIMUM_DURATION_DAYS && game.progress >= MINIMUM_PROGRESS
  })

  setResponseHeader(
    event,
    'Cache-Control',
    [
      'public',
      'max-age=300',
      `s-maxage=${secondsUntilWeeklyRefresh()}`,
      `stale-while-revalidate=${PROFILE_REVALIDATE_SECONDS}`,
      `stale-if-error=${PROFILE_CACHE_SECONDS}`
    ].join(', ')
  )

  return {
    id: profileName,
    trophies: parseTrophies(
      profileRoot.querySelectorAll('.psntrophy span').map(node => text(node.textContent))
    ),
    games
  }
})
