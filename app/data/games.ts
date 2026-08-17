export type GameStatus = 'playing' | 'backlog' | 'played'

export interface GameEntry {
  id: string
  status: GameStatus
  nameZh: string
  nameEn: string
  releaseDate: string
  genres: string[]
  coverUrl: string
  fallbackCover: string
  sourceUrl: string
}

export interface GameGroup {
  status: GameStatus
  title: string
  label: string
}

export const gameGroups: GameGroup[] = [
  { status: 'playing', title: '正在玩', label: 'Playing' },
  { status: 'backlog', title: '想玩', label: 'Backlog' },
  { status: 'played', title: '玩过', label: 'Played' }
]

export const games: GameEntry[] = [
  {
    id: 'octopath-traveler',
    status: 'playing',
    nameZh: '歧路旅人',
    nameEn: 'Octopath Traveler',
    releaseDate: '2018-07-13',
    genres: ['日式角色扮演'],
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/3/34/Octopath_Traveler.jpg',
    fallbackCover: '/images/games/octopath-traveler.png',
    sourceUrl: 'https://zh.wikipedia.org/wiki/歧路旅人'
  },
  {
    id: 'skyward-sword-hd',
    status: 'backlog',
    nameZh: '塞尔达传说 御天之剑 HD',
    nameEn: 'The Legend of Zelda: Skyward Sword HD',
    releaseDate: '2021-07-16',
    genres: ['动作冒险'],
    coverUrl: 'https://upload.wikimedia.org/wikipedia/zh/d/d7/Legend_of_Zelda_Skyward_Sword_boxart.jpg',
    fallbackCover: '/images/games/skyward-sword-hd.png',
    sourceUrl: 'https://zh.wikipedia.org/wiki/薩爾達傳說_禦天之劍'
  },
  {
    id: 'metroid-dread',
    status: 'played',
    nameZh: '密特罗德 生存恐惧',
    nameEn: 'Metroid Dread',
    releaseDate: '2021-10-08',
    genres: ['动作冒险', '银河战士恶魔城'],
    coverUrl: 'https://upload.wikimedia.org/wikipedia/zh/a/a3/Metroid_Dread_cover.png',
    fallbackCover: '/images/games/metroid-dread.png',
    sourceUrl: 'https://zh.wikipedia.org/wiki/密特罗德_生存恐惧'
  },
  {
    id: 'disco-elysium',
    status: 'played',
    nameZh: '极乐迪斯科',
    nameEn: 'Disco Elysium',
    releaseDate: '2019-10-15',
    genres: ['角色扮演'],
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/0/0d/Disco_Elysium_Poster.jpeg',
    fallbackCover: '/images/games/disco-elysium.png',
    sourceUrl: 'https://zh.wikipedia.org/wiki/極樂迪斯科'
  },
  {
    id: 'hades',
    status: 'played',
    nameZh: '哈迪斯',
    nameEn: 'Hades',
    releaseDate: '2020-09-17',
    genres: ['Roguelike', '动作角色扮演'],
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/c/cc/Hades_cover_art.jpg',
    fallbackCover: '/images/games/hades.png',
    sourceUrl: 'https://zh.wikipedia.org/wiki/黑帝斯_(遊戲)'
  },
  {
    id: 'hollow-knight',
    status: 'played',
    nameZh: '空洞骑士',
    nameEn: 'Hollow Knight',
    releaseDate: '2017-02-24',
    genres: ['银河战士恶魔城', '动作冒险'],
    coverUrl: 'https://upload.wikimedia.org/wikipedia/zh/8/86/Hollow_Knight_promo_image.jpg',
    fallbackCover: '/images/games/hollow-knight.png',
    sourceUrl: 'https://zh.wikipedia.org/wiki/空洞騎士'
  },
  {
    id: 'red-dead-redemption-2',
    status: 'played',
    nameZh: '荒野大镖客：救赎 2',
    nameEn: 'Red Dead Redemption 2',
    releaseDate: '2018-10-26',
    genres: ['动作冒险', '开放世界'],
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/4/44/Red_Dead_Redemption_II.jpg',
    fallbackCover: '/images/games/red-dead-redemption-2.png',
    sourceUrl: 'https://zh.wikipedia.org/wiki/碧血狂殺2'
  },
  {
    id: 'sekiro',
    status: 'played',
    nameZh: '只狼：影逝二度',
    nameEn: 'Sekiro: Shadows Die Twice',
    releaseDate: '2019-03-22',
    genres: ['动作冒险', '类魂'],
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/6/6e/Sekiro_art.jpg',
    fallbackCover: '/images/games/sekiro.png',
    sourceUrl: 'https://zh.wikipedia.org/wiki/隻狼：暗影雙死'
  },
  {
    id: 'skyrim',
    status: 'played',
    nameZh: '上古卷轴 V：天际',
    nameEn: 'The Elder Scrolls V: Skyrim',
    releaseDate: '2011-11-11',
    genres: ['动作角色扮演', '开放世界'],
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/1/15/The_Elder_Scrolls_V_Skyrim_cover.png',
    fallbackCover: '/images/games/skyrim.png',
    sourceUrl: 'https://zh.wikipedia.org/wiki/上古卷轴V：天际'
  },
  {
    id: 'katana-zero',
    status: 'played',
    nameZh: '武士 零',
    nameEn: 'Katana ZERO',
    releaseDate: '2019-04-18',
    genres: ['动作平台', '砍杀'],
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/d/da/Katana_Zero_cover.png',
    fallbackCover: '/images/games/katana-zero.png',
    sourceUrl: 'https://en.wikipedia.org/wiki/Katana_Zero'
  },
  {
    id: 'dark-souls',
    status: 'played',
    nameZh: '黑暗之魂',
    nameEn: 'Dark Souls',
    releaseDate: '2011-09-22',
    genres: ['动作角色扮演', '类魂'],
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/8/8d/Dark_Souls_Cover_Art.jpg',
    fallbackCover: '/images/games/dark-souls.png',
    sourceUrl: 'https://zh.wikipedia.org/wiki/黑暗靈魂'
  },
  {
    id: 'breath-of-the-wild',
    status: 'played',
    nameZh: '塞尔达传说 旷野之息',
    nameEn: 'The Legend of Zelda: Breath of the Wild',
    releaseDate: '2017-03-03',
    genres: ['动作冒险', '开放世界'],
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/c/c6/The_Legend_of_Zelda_Breath_of_the_Wild.jpg',
    fallbackCover: '/images/games/breath-of-the-wild.png',
    sourceUrl: 'https://zh.wikipedia.org/wiki/塞尔达传说_旷野之息'
  }
]
