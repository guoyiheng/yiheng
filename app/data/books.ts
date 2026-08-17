export interface ReadingBook {
  title: string
  author?: string
  wikipediaUrl: string
  coverUrl?: string
}

const wikipediaSearch = (title: string) => (
  `https://zh.wikipedia.org/w/index.php?search=${encodeURIComponent(title)}`
)

const amazonCover = (imageId: string) => (
  `https://m.media-amazon.com/images/I/${imageId}._SL500_.jpg`
)

export const readingBooks: ReadingBook[] = [
  { title: '活着', author: '余华', wikipediaUrl: 'https://zh.wikipedia.org/wiki/活着', coverUrl: amazonCover('61jPnBcxy+L') },
  { title: '白鹿原', author: '陈忠实', wikipediaUrl: 'https://zh.wikipedia.org/wiki/白鹿原', coverUrl: amazonCover('81PceJmfcBL') },
  { title: '人间失格', author: '太宰治', wikipediaUrl: wikipediaSearch('人间失格'), coverUrl: amazonCover('81pRBTYRz7L') },
  {
    title: '骆驼祥子',
    author: '老舍',
    wikipediaUrl: 'https://zh.wikipedia.org/wiki/骆驼祥子',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/NLC511-023031404010994-31601_%E9%A7%B1%E9%A7%9D%E7%A5%A5%E5%AD%90_%E9%95%B7%E7%AF%87%E5%B0%8F%E8%AA%AA.pdf/page1-250px-NLC511-023031404010994-31601_%E9%A7%B1%E9%A7%9D%E7%A5%A5%E5%AD%90_%E9%95%B7%E7%AF%87%E5%B0%8F%E8%AA%AA.pdf.jpg'
  },
  { title: '看见', author: '柴静', wikipediaUrl: 'https://zh.wikipedia.org/wiki/看见', coverUrl: amazonCover('81KIT65e83L') },
  { title: '史蒂夫·乔布斯传', author: '沃尔特·艾萨克森', wikipediaUrl: 'https://zh.wikipedia.org/wiki/史蒂夫·乔布斯传', coverUrl: amazonCover('41CEndP62OL') },
  { title: '写给大家看的设计书', author: 'Robin Williams', wikipediaUrl: wikipediaSearch('写给大家看的设计书'), coverUrl: amazonCover('61xNTqcMEbL') },
  {
    title: '红楼梦（脂评汇校版）',
    author: '曹雪芹',
    wikipediaUrl: 'https://zh.wikipedia.org/wiki/红楼梦',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/JiaXu01.jpg/250px-JiaXu01.jpg'
  },
  { title: 'JavaScript高级程序设计（第4版）', author: 'Matt Frisbie', wikipediaUrl: wikipediaSearch('JavaScript高级程序设计 第4版'), coverUrl: amazonCover('5113M7QBiZL') },
  { title: '梦的解析', author: '西格蒙德·弗洛伊德', wikipediaUrl: 'https://zh.wikipedia.org/wiki/夢的解析', coverUrl: amazonCover('71Bm4tVEqYL') },
  { title: '手把手教你玩脱口秀', author: 'Greg Dean', wikipediaUrl: wikipediaSearch('手把手教你玩脱口秀'), coverUrl: amazonCover('71eMtD-oRSL') },
  { title: '彷徨', author: '鲁迅', wikipediaUrl: 'https://zh.wikipedia.org/wiki/彷徨', coverUrl: amazonCover('7165uKxGi+L') },
  { title: '野草', author: '鲁迅', wikipediaUrl: 'https://zh.wikipedia.org/wiki/野草_(文學)', coverUrl: amazonCover('71247EwJ+EL') },
  { title: '朝花夕拾', author: '鲁迅', wikipediaUrl: 'https://zh.wikipedia.org/wiki/朝花夕拾', coverUrl: amazonCover('71dooiEkJ5L') },
  { title: '故事新编', author: '鲁迅', wikipediaUrl: 'https://zh.wikipedia.org/wiki/故事新编', coverUrl: amazonCover('71IJvpC9iEL') },
  { title: '坟', author: '鲁迅', wikipediaUrl: 'https://zh.wikipedia.org/wiki/坟_(鲁迅)', coverUrl: amazonCover('51EOlws-RAL') },
  { title: '热风', author: '鲁迅', wikipediaUrl: 'https://zh.wikipedia.org/wiki/热风', coverUrl: amazonCover('51RGnkl12uL') },
  { title: '1919', author: '鲁迅', wikipediaUrl: 'https://zh.wikipedia.org/wiki/鲁迅全集', coverUrl: amazonCover('51vH9Va28RL') },
  { title: '1921', author: '鲁迅', wikipediaUrl: 'https://zh.wikipedia.org/wiki/鲁迅全集', coverUrl: amazonCover('51vH9Va28RL') },
  { title: '1922', author: '鲁迅', wikipediaUrl: 'https://zh.wikipedia.org/wiki/鲁迅全集', coverUrl: amazonCover('51vH9Va28RL') },
  { title: '1924', author: '鲁迅', wikipediaUrl: 'https://zh.wikipedia.org/wiki/鲁迅全集', coverUrl: amazonCover('51vH9Va28RL') },
  { title: '呐喊', author: '鲁迅', wikipediaUrl: 'https://zh.wikipedia.org/wiki/吶喊', coverUrl: amazonCover('5194i0JP7HL') },
  { title: '性史（1926）', author: '张竞生', wikipediaUrl: wikipediaSearch('性史 张竞生'), coverUrl: amazonCover('61GFpr-d50L') },
  { title: '基督山伯爵', author: '亚历山大·仲马', wikipediaUrl: 'https://zh.wikipedia.org/wiki/基督山伯爵', coverUrl: amazonCover('81PT9MQapbL') },
  { title: '许三观卖血记', author: '余华', wikipediaUrl: 'https://zh.wikipedia.org/wiki/许三观卖血记', coverUrl: amazonCover('711lAthF4hL') },
  { title: '小王子', author: '安托万·德·圣埃克苏佩里', wikipediaUrl: 'https://zh.wikipedia.org/wiki/小王子', coverUrl: amazonCover('91UijShZHyL') },
  { title: '书剑恩仇录', author: '金庸', wikipediaUrl: 'https://zh.wikipedia.org/wiki/書劍恩仇錄', coverUrl: amazonCover('71gWvPG5gyL') },
  { title: '青铜时代', author: '王小波', wikipediaUrl: wikipediaSearch('青铜时代 王小波'), coverUrl: amazonCover('712+w0laQjL') },
  { title: '白银时代', author: '王小波', wikipediaUrl: wikipediaSearch('白银时代 王小波'), coverUrl: amazonCover('61RMhS7GrGL') },
  { title: '黄金时代', author: '王小波', wikipediaUrl: 'https://zh.wikipedia.org/wiki/黄金时代_(小说)', coverUrl: amazonCover('71S6aoEpN7L') },
  { title: '三国演义', author: '罗贯中', wikipediaUrl: 'https://zh.wikipedia.org/wiki/三国演义', coverUrl: amazonCover('81aICC4S2xL') },
  { title: '围城', author: '钱钟书', wikipediaUrl: 'https://zh.wikipedia.org/wiki/围城', coverUrl: amazonCover('71axSZHS-ML') },
  { title: '癸酉本石头记', author: '佚名', wikipediaUrl: wikipediaSearch('癸酉本石头记'), coverUrl: amazonCover('61esmsW8DIL') },
  { title: '红楼梦（程高本）', author: '曹雪芹、高鹗', wikipediaUrl: wikipediaSearch('程高本 红楼梦'), coverUrl: amazonCover('51HxNKvI29L') },
  {
    title: '西游记',
    author: '吴承恩',
    wikipediaUrl: 'https://zh.wikipedia.org/wiki/西游记',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Evl53201b_pic.jpg/250px-Evl53201b_pic.jpg'
  },
  {
    title: '水浒传',
    author: '施耐庵',
    wikipediaUrl: 'https://zh.wikipedia.org/wiki/水浒传',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Shuihu7.PNG/250px-Shuihu7.PNG'
  },
  {
    title: '金瓶梅',
    author: '兰陵笑笑生',
    wikipediaUrl: 'https://zh.wikipedia.org/wiki/金瓶梅',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Jinpingmei_books.jpg/250px-Jinpingmei_books.jpg'
  },
  { title: '天龙八部', author: '金庸', wikipediaUrl: 'https://zh.wikipedia.org/wiki/天龙八部', coverUrl: amazonCover('61I1FTBpTYL') },
  { title: '金庸作品集', author: '金庸', wikipediaUrl: wikipediaSearch('金庸作品集'), coverUrl: amazonCover('518DrE53ukL') },
  {
    title: '鲁迅全集',
    author: '鲁迅',
    wikipediaUrl: 'https://zh.wikipedia.org/wiki/鲁迅全集',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Luxunquanji.jpg/250px-Luxunquanji.jpg'
  },
  { title: '笑林广记', author: '古典笑话集', wikipediaUrl: 'https://zh.wikipedia.org/wiki/笑林廣記', coverUrl: amazonCover('91GaJTSAw7L') },
  { title: '传习录', author: '王阳明', wikipediaUrl: 'https://zh.wikipedia.org/wiki/传习录', coverUrl: amazonCover('719L5ceJm1L') },
  { title: '庄子', author: '庄周', wikipediaUrl: 'https://zh.wikipedia.org/wiki/庄子', coverUrl: amazonCover('71z4JsXoGxL') },
  {
    title: '论语',
    author: '孔子及其弟子',
    wikipediaUrl: 'https://zh.wikipedia.org/wiki/论语',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Commentaries_of_the_Analects_of_Confucius.jpg/250px-Commentaries_of_the_Analects_of_Confucius.jpg'
  },
  { title: '四书五经', author: '儒家经典', wikipediaUrl: 'https://zh.wikipedia.org/wiki/四书五经', coverUrl: amazonCover('71ZvWhRzOzL') },
  { title: '心经', author: '佛教经典', wikipediaUrl: wikipediaSearch('般若波罗蜜多心经'), coverUrl: amazonCover('41qfaG4QkIL') },
  { title: '金刚经', author: '佛教经典', wikipediaUrl: 'https://zh.wikipedia.org/wiki/金剛經', coverUrl: amazonCover('51OzaW0D0kL') },
  { title: '地藏经', author: '佛教经典', wikipediaUrl: 'https://zh.wikipedia.org/wiki/地藏菩萨本愿经', coverUrl: amazonCover('61SrQdXvvRL') }
]
