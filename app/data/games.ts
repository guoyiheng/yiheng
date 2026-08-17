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
    coverUrl: '/images/games/octopath-traveler.png',
    fallbackCover: '/images/games/octopath-traveler.png',
    sourceUrl: '/game/octopath-traveler'
  },
  {
    id: 'skyward-sword-hd',
    status: 'backlog',
    nameZh: '塞尔达传说 御天之剑 HD',
    nameEn: 'The Legend of Zelda: Skyward Sword HD',
    releaseDate: '2021-07-16',
    genres: ['动作冒险'],
    coverUrl: '/images/games/skyward-sword-hd.png',
    fallbackCover: '/images/games/skyward-sword-hd.png',
    sourceUrl: '/game/skyward-sword-hd'
  },
  {
    id: 'metroid-dread',
    status: 'played',
    nameZh: '密特罗德 生存恐惧',
    nameEn: 'Metroid Dread',
    releaseDate: '2021-10-08',
    genres: ['动作冒险', '银河战士恶魔城'],
    coverUrl: '/images/games/metroid-dread.png',
    fallbackCover: '/images/games/metroid-dread.png',
    sourceUrl: '/game/metroid-dread'
  },
  {
    id: 'disco-elysium',
    status: 'played',
    nameZh: '极乐迪斯科',
    nameEn: 'Disco Elysium',
    releaseDate: '2019-10-15',
    genres: ['角色扮演'],
    coverUrl: '/images/games/disco-elysium.png',
    fallbackCover: '/images/games/disco-elysium.png',
    sourceUrl: '/game/disco-elysium'
  },
  {
    id: 'hades',
    status: 'played',
    nameZh: '哈迪斯',
    nameEn: 'Hades',
    releaseDate: '2020-09-17',
    genres: ['Roguelike', '动作角色扮演'],
    coverUrl: '/images/games/hades.png',
    fallbackCover: '/images/games/hades.png',
    sourceUrl: '/game/hades'
  },
  {
    id: 'hollow-knight',
    status: 'played',
    nameZh: '空洞骑士',
    nameEn: 'Hollow Knight',
    releaseDate: '2017-02-24',
    genres: ['银河战士恶魔城', '动作冒险'],
    coverUrl: '/images/games/hollow-knight.png',
    fallbackCover: '/images/games/hollow-knight.png',
    sourceUrl: '/game/hollow-knight'
  },
  {
    id: 'red-dead-redemption-2',
    status: 'played',
    nameZh: '荒野大镖客：救赎 2',
    nameEn: 'Red Dead Redemption 2',
    releaseDate: '2018-10-26',
    genres: ['动作冒险', '开放世界'],
    coverUrl: '/images/games/red-dead-redemption-2.png',
    fallbackCover: '/images/games/red-dead-redemption-2.png',
    sourceUrl: '/game/red-dead-redemption-2'
  },
  {
    id: 'sekiro',
    status: 'played',
    nameZh: '只狼：影逝二度',
    nameEn: 'Sekiro: Shadows Die Twice',
    releaseDate: '2019-03-22',
    genres: ['动作冒险', '类魂'],
    coverUrl: '/images/games/sekiro.png',
    fallbackCover: '/images/games/sekiro.png',
    sourceUrl: '/game/sekiro'
  },
  {
    id: 'skyrim',
    status: 'played',
    nameZh: '上古卷轴 V：天际',
    nameEn: 'The Elder Scrolls V: Skyrim',
    releaseDate: '2011-11-11',
    genres: ['动作角色扮演', '开放世界'],
    coverUrl: '/images/games/skyrim.png',
    fallbackCover: '/images/games/skyrim.png',
    sourceUrl: '/game/skyrim'
  },
  {
    id: 'katana-zero',
    status: 'played',
    nameZh: '武士 零',
    nameEn: 'Katana ZERO',
    releaseDate: '2019-04-18',
    genres: ['动作平台', '砍杀'],
    coverUrl: '/images/games/katana-zero.png',
    fallbackCover: '/images/games/katana-zero.png',
    sourceUrl: '/game/katana-zero'
  },
  {
    id: 'dark-souls',
    status: 'played',
    nameZh: '黑暗之魂',
    nameEn: 'Dark Souls',
    releaseDate: '2011-09-22',
    genres: ['动作角色扮演', '类魂'],
    coverUrl: '/images/games/dark-souls.png',
    fallbackCover: '/images/games/dark-souls.png',
    sourceUrl: '/game/dark-souls'
  },
  {
    id: 'breath-of-the-wild',
    status: 'played',
    nameZh: '塞尔达传说 旷野之息',
    nameEn: 'The Legend of Zelda: Breath of the Wild',
    releaseDate: '2017-03-03',
    genres: ['动作冒险', '开放世界'],
    coverUrl: '/images/games/breath-of-the-wild.png',
    fallbackCover: '/images/games/breath-of-the-wild.png',
    sourceUrl: '/game/breath-of-the-wild'
  }
]
