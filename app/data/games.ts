export interface GameEntry {
  id: string
  nameZh: string
  nameEn: string
  releaseDate: string
  genres: string[]
  coverUrl: string
  sourceUrl: string
}

export const games: GameEntry[] = [
  {
    id: 'octopath-traveler',
    nameZh: '歧路旅人',
    nameEn: 'Octopath Traveler',
    releaseDate: '2018-07-13',
    genres: ['日式角色扮演'],
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/3/34/Octopath_Traveler.jpg',
    sourceUrl: 'https://zh.wikipedia.org/wiki/歧路旅人'
  },
  {
    id: 'skyward-sword-hd',
    nameZh: '塞尔达传说：御天之剑 HD',
    nameEn: 'The Legend of Zelda: Skyward Sword HD',
    releaseDate: '2021-07-16',
    genres: ['动作冒险'],
    coverUrl: 'https://upload.wikimedia.org/wikipedia/zh/d/d7/Legend_of_Zelda_Skyward_Sword_boxart.jpg',
    sourceUrl: 'https://zh.wikipedia.org/wiki/薩爾達傳說_禦天之劍'
  },
  {
    id: 'metroid-dread',
    nameZh: '密特罗德：生存恐惧',
    nameEn: 'Metroid Dread',
    releaseDate: '2021-10-08',
    genres: ['动作冒险', '银河战士恶魔城'],
    coverUrl: 'https://upload.wikimedia.org/wikipedia/zh/a/a3/Metroid_Dread_cover.png',
    sourceUrl: 'https://zh.wikipedia.org/wiki/密特罗德_生存恐惧'
  },
  {
    id: 'hades',
    nameZh: '哈迪斯',
    nameEn: 'Hades',
    releaseDate: '2020-09-17',
    genres: ['Roguelike', '动作角色扮演'],
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/c/cc/Hades_cover_art.jpg',
    sourceUrl: 'https://zh.wikipedia.org/wiki/黑帝斯_(遊戲)'
  },
  {
    id: 'katana-zero',
    nameZh: '武士：零',
    nameEn: 'Katana ZERO',
    releaseDate: '2019-04-18',
    genres: ['动作平台', '砍杀'],
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/d/da/Katana_Zero_cover.png',
    sourceUrl: 'https://en.wikipedia.org/wiki/Katana_Zero'
  },
  {
    id: 'breath-of-the-wild',
    nameZh: '塞尔达传说：旷野之息',
    nameEn: 'The Legend of Zelda: Breath of the Wild',
    releaseDate: '2017-03-03',
    genres: ['动作冒险', '开放世界'],
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/c/c6/The_Legend_of_Zelda_Breath_of_the_Wild.jpg',
    sourceUrl: 'https://zh.wikipedia.org/wiki/塞尔达传说_旷野之息'
  },
  {
    id: 'half-life-alyx',
    nameZh: '半衰期：爱莉克斯',
    nameEn: 'Half-Life: Alyx',
    releaseDate: '2020-03-23',
    genres: ['VR', '第一人称射击'],
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/4/49/Half-Life_Alyx_Cover_Art.jpg',
    sourceUrl: 'https://en.wikipedia.org/wiki/Half-Life:_Alyx'
  },
  {
    id: 'elven-assassin',
    nameZh: '精灵刺客',
    nameEn: 'Elven Assassin',
    releaseDate: '2016-09-10',
    genres: ['VR', '动作'],
    coverUrl: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/503770/library_600x900.jpg',
    sourceUrl: 'https://en.wikipedia.org/w/index.php?search=Elven+Assassin'
  },
  {
    id: 'the-stanley-parable',
    nameZh: '史丹利的寓言',
    nameEn: 'The Stanley Parable',
    releaseDate: '2013-10-17',
    genres: ['冒险', '互动叙事'],
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/c/ce/Stanley_parable_cover.jpg',
    sourceUrl: 'https://en.wikipedia.org/wiki/The_Stanley_Parable'
  },
  {
    id: 'tale-of-immortal',
    nameZh: '鬼谷八荒',
    nameEn: 'Tale of Immortal',
    releaseDate: '2023-05-26',
    genres: ['动作角色扮演', '沙盒'],
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/d/d9/Tale_of_Immortal_Steam_header_2026.jpg',
    sourceUrl: 'https://en.wikipedia.org/wiki/Tale_of_Immortal'
  },
  {
    id: 'animal-crossing-new-horizons',
    nameZh: '集合啦！动物森友会',
    nameEn: 'Animal Crossing: New Horizons',
    releaseDate: '2020-03-20',
    genres: ['生活模拟'],
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/1/1f/Animal_Crossing_New_Horizons.jpg',
    sourceUrl: 'https://en.wikipedia.org/wiki/Animal_Crossing:_New_Horizons'
  },
  {
    id: 'cyberpunk-2077',
    nameZh: '赛博朋克 2077',
    nameEn: 'Cyberpunk 2077',
    releaseDate: '2020-12-10',
    genres: ['动作角色扮演', '开放世界'],
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/9/9f/Cyberpunk_2077_box_art.jpg',
    sourceUrl: 'https://en.wikipedia.org/wiki/Cyberpunk_2077'
  },
  {
    id: 'super-mario-odyssey',
    nameZh: '超级马力欧 奥德赛',
    nameEn: 'Super Mario Odyssey',
    releaseDate: '2017-10-27',
    genres: ['平台', '动作冒险'],
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/8/8d/Super_Mario_Odyssey.jpg',
    sourceUrl: 'https://en.wikipedia.org/wiki/Super_Mario_Odyssey'
  },
  {
    id: 'celeste',
    nameZh: '蔚蓝',
    nameEn: 'Celeste',
    releaseDate: '2018-01-25',
    genres: ['平台'],
    coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Celeste_box_art_full.png',
    sourceUrl: 'https://en.wikipedia.org/wiki/Celeste_(video_game)'
  },
  {
    id: 'tears-of-the-kingdom',
    nameZh: '塞尔达传说：王国之泪',
    nameEn: 'The Legend of Zelda: Tears of the Kingdom',
    releaseDate: '2023-05-12',
    genres: ['动作冒险', '开放世界'],
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/f/fb/The_Legend_of_Zelda_Tears_of_the_Kingdom_cover.jpg',
    sourceUrl: 'https://en.wikipedia.org/wiki/The_Legend_of_Zelda:_Tears_of_the_Kingdom'
  },
  {
    id: 'the-legend-of-tianding',
    nameZh: '廖添丁：绝代凶贼之末日',
    nameEn: 'The Legend of Tianding',
    releaseDate: '2021-11-01',
    genres: ['横向卷轴', '动作'],
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/3/37/The_Legend_of_Tianding_cover_art.jpg',
    sourceUrl: 'https://en.wikipedia.org/wiki/The_Legend_of_Tianding'
  },
  {
    id: 'black-myth-wukong',
    nameZh: '黑神话：悟空',
    nameEn: 'Black Myth: Wukong',
    releaseDate: '2024-08-20',
    genres: ['动作角色扮演'],
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a6/Black_Myth_Wukong_cover_art.jpg',
    sourceUrl: 'https://en.wikipedia.org/wiki/Black_Myth:_Wukong'
  },
  {
    id: 'the-minish-cap',
    nameZh: '塞尔达传说：缩小帽',
    nameEn: 'The Legend of Zelda: The Minish Cap',
    releaseDate: '2004-11-04',
    genres: ['动作冒险'],
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/0/0a/TLOZ-_Minish_Cap_NA_Box_art.png',
    sourceUrl: 'https://en.wikipedia.org/wiki/The_Legend_of_Zelda:_The_Minish_Cap'
  },
  {
    id: 'hollow-knight-silksong',
    nameZh: '空洞骑士：丝之歌',
    nameEn: 'Hollow Knight: Silksong',
    releaseDate: '2025-09-04',
    genres: ['银河战士恶魔城', '动作冒险'],
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/0/05/Silksong.jpg',
    sourceUrl: 'https://en.wikipedia.org/wiki/Hollow_Knight:_Silksong'
  }
].sort((left, right) => right.releaseDate.localeCompare(left.releaseDate))
