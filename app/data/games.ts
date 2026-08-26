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
  },
  {
    id: 'brotato',
    nameZh: '土豆兄弟',
    nameEn: 'Brotato',
    releaseDate: '2023-06-23',
    genres: ['Roguelike', '竞技场射击'],
    coverUrl: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1942280/library_600x900.jpg',
    sourceUrl: 'https://store.steampowered.com/app/1942280/Brotato/'
  },
  {
    id: 'just-go',
    nameZh: '棋弈无限：围棋',
    nameEn: 'Just Go',
    releaseDate: '2022-04-20',
    genres: ['棋牌', '策略', '模拟'],
    coverUrl: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1862520/library_600x900.jpg',
    sourceUrl: 'https://store.steampowered.com/app/1862520/Just_Go/'
  },
  {
    id: 'ender-lilies',
    nameZh: '终焉之莉莉：骑士寂夜',
    nameEn: 'ENDER LILIES: Quietus of the Knights',
    releaseDate: '2021-06-22',
    genres: ['银河战士恶魔城', '动作角色扮演'],
    coverUrl: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1369630/library_600x900.jpg',
    sourceUrl: 'https://store.steampowered.com/app/1369630/ENDER_LILIES_Quietus_of_the_Knights/'
  },
  {
    id: 'bloodstained-ritual-of-the-night',
    nameZh: '赤痕：夜之仪式',
    nameEn: 'Bloodstained: Ritual of the Night',
    releaseDate: '2019-06-18',
    genres: ['银河战士恶魔城', '动作角色扮演'],
    coverUrl: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/692850/library_600x900.jpg',
    sourceUrl: 'https://store.steampowered.com/app/692850/Bloodstained_Ritual_of_the_Night/'
  },
  {
    id: 'rusty-lake',
    nameZh: '绣湖系列',
    nameEn: 'Rusty Lake Series',
    releaseDate: '2015-05-04',
    genres: ['解谜', '点击', '冒险'],
    coverUrl: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/431700/library_600x900.jpg',
    sourceUrl: 'https://store.steampowered.com/developer/rustylake'
  },
  {
    id: 'euro-truck-simulator-2',
    nameZh: '欧洲卡车模拟 2',
    nameEn: 'Euro Truck Simulator 2',
    releaseDate: '2012-10-19',
    genres: ['驾驶模拟'],
    coverUrl: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/227300/library_600x900.jpg',
    sourceUrl: 'https://store.steampowered.com/app/227300/Euro_Truck_Simulator_2/'
  },
  {
    id: 'super-mario-bros-wonder',
    nameZh: '超级马力欧兄弟 惊奇',
    nameEn: 'Super Mario Bros. Wonder',
    releaseDate: '2023-10-20',
    genres: ['平台', '动作冒险'],
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a3/Mariowonder.png',
    sourceUrl: 'https://en.wikipedia.org/wiki/Super_Mario_Bros._Wonder'
  },
  {
    id: 'super-mario-3d-world',
    nameZh: '超级马力欧 3D世界',
    nameEn: 'Super Mario 3D World',
    releaseDate: '2021-02-12',
    genres: ['平台', '动作冒险'],
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/5/5e/Super_Mario_3D_World_box_art.jpg',
    sourceUrl: 'https://en.wikipedia.org/wiki/Super_Mario_3D_World'
  },
  {
    id: 'fifa-21',
    nameZh: 'FIFA 21',
    nameEn: 'FIFA 21',
    releaseDate: '2020-10-09',
    genres: ['体育', '竞技'],
    coverUrl: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1313860/library_600x900.jpg',
    sourceUrl: 'https://en.wikipedia.org/wiki/FIFA_21'
  },
  {
    id: 'eleven-table-tennis',
    nameZh: 'Eleven Table Tennis',
    nameEn: 'Eleven Table Tennis VR',
    releaseDate: '2020-02-27',
    genres: ['VR', '体育', '模拟'],
    coverUrl: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/488310/library_600x900.jpg',
    sourceUrl: 'https://store.steampowered.com/app/488310/Eleven_Table_Tennis/'
  }
].sort((left, right) => right.releaseDate.localeCompare(left.releaseDate))
