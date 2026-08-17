export interface ReadingBook {
  title: string
  author?: string
  wikipediaUrl: string
  coverUrl?: string
}

const wikipediaSearch = (title: string) => (
  `https://zh.wikipedia.org/w/index.php?search=${encodeURIComponent(title)}`
)

export const readingBooks: ReadingBook[] = [
  { title: '活着', author: '余华', wikipediaUrl: 'https://zh.wikipedia.org/wiki/活着' },
  { title: '白鹿原', author: '陈忠实', wikipediaUrl: 'https://zh.wikipedia.org/wiki/白鹿原' },
  { title: '人间失格', author: '太宰治', wikipediaUrl: wikipediaSearch('人间失格') },
  {
    title: '骆驼祥子',
    author: '老舍',
    wikipediaUrl: 'https://zh.wikipedia.org/wiki/骆驼祥子',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/NLC511-023031404010994-31601_%E9%A7%B1%E9%A7%9D%E7%A5%A5%E5%AD%90_%E9%95%B7%E7%AF%87%E5%B0%8F%E8%AA%AA.pdf/page1-250px-NLC511-023031404010994-31601_%E9%A7%B1%E9%A7%9D%E7%A5%A5%E5%AD%90_%E9%95%B7%E7%AF%87%E5%B0%8F%E8%AA%AA.pdf.jpg'
  },
  { title: '看见', author: '柴静', wikipediaUrl: 'https://zh.wikipedia.org/wiki/看见' },
  { title: '史蒂夫·乔布斯传', author: '沃尔特·艾萨克森', wikipediaUrl: 'https://zh.wikipedia.org/wiki/史蒂夫·乔布斯传' },
  { title: '写给大家看的设计书', author: 'Robin Williams', wikipediaUrl: wikipediaSearch('写给大家看的设计书') },
  {
    title: '红楼梦（脂评汇校版）',
    author: '曹雪芹',
    wikipediaUrl: 'https://zh.wikipedia.org/wiki/红楼梦',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/JiaXu01.jpg/250px-JiaXu01.jpg'
  },
  { title: 'JavaScript高级程序设计（第4版）', author: 'Matt Frisbie', wikipediaUrl: wikipediaSearch('JavaScript高级程序设计 第4版') },
  { title: '梦的解析', author: '西格蒙德·弗洛伊德', wikipediaUrl: 'https://zh.wikipedia.org/wiki/夢的解析' },
  { title: '手把手教你玩脱口秀', author: 'Greg Dean', wikipediaUrl: wikipediaSearch('手把手教你玩脱口秀') },
  { title: '彷徨', author: '鲁迅', wikipediaUrl: 'https://zh.wikipedia.org/wiki/彷徨' },
  { title: '野草', author: '鲁迅', wikipediaUrl: 'https://zh.wikipedia.org/wiki/野草_(文學)' },
  { title: '朝花夕拾', author: '鲁迅', wikipediaUrl: 'https://zh.wikipedia.org/wiki/朝花夕拾' },
  { title: '故事新编', author: '鲁迅', wikipediaUrl: 'https://zh.wikipedia.org/wiki/故事新编' },
  { title: '坟', author: '鲁迅', wikipediaUrl: 'https://zh.wikipedia.org/wiki/坟_(鲁迅)' },
  { title: '热风', author: '鲁迅', wikipediaUrl: 'https://zh.wikipedia.org/wiki/热风' },
  { title: '1919', wikipediaUrl: wikipediaSearch('1919 书籍') },
  { title: '1921', wikipediaUrl: wikipediaSearch('1921 书籍') },
  { title: '1922', wikipediaUrl: wikipediaSearch('1922 书籍') },
  { title: '1924', wikipediaUrl: wikipediaSearch('1924 书籍') },
  { title: '呐喊', author: '鲁迅', wikipediaUrl: 'https://zh.wikipedia.org/wiki/吶喊' },
  { title: '性史（1926）', author: '张竞生', wikipediaUrl: wikipediaSearch('性史 张竞生') },
  { title: '基督山伯爵', author: '亚历山大·仲马', wikipediaUrl: 'https://zh.wikipedia.org/wiki/基督山伯爵' },
  { title: '许三观卖血记', author: '余华', wikipediaUrl: 'https://zh.wikipedia.org/wiki/许三观卖血记' },
  { title: '小王子', author: '安托万·德·圣埃克苏佩里', wikipediaUrl: 'https://zh.wikipedia.org/wiki/小王子' },
  { title: '书剑恩仇录', author: '金庸', wikipediaUrl: 'https://zh.wikipedia.org/wiki/書劍恩仇錄' },
  { title: '青铜时代', author: '王小波', wikipediaUrl: wikipediaSearch('青铜时代 王小波') },
  { title: '白银时代', author: '王小波', wikipediaUrl: wikipediaSearch('白银时代 王小波') },
  { title: '黄金时代', author: '王小波', wikipediaUrl: 'https://zh.wikipedia.org/wiki/黄金时代_(小说)' },
  { title: '三国演义', author: '罗贯中', wikipediaUrl: 'https://zh.wikipedia.org/wiki/三国演义' },
  { title: '围城', author: '钱钟书', wikipediaUrl: 'https://zh.wikipedia.org/wiki/围城' },
  { title: '癸酉本石头记', wikipediaUrl: wikipediaSearch('癸酉本石头记') },
  { title: '红楼梦（程高本）', author: '曹雪芹、高鹗', wikipediaUrl: wikipediaSearch('程高本 红楼梦') },
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
  { title: '天龙八部', author: '金庸', wikipediaUrl: 'https://zh.wikipedia.org/wiki/天龙八部' },
  { title: '金庸作品集', author: '金庸', wikipediaUrl: wikipediaSearch('金庸作品集') },
  {
    title: '鲁迅全集',
    author: '鲁迅',
    wikipediaUrl: 'https://zh.wikipedia.org/wiki/鲁迅全集',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Luxunquanji.jpg/250px-Luxunquanji.jpg'
  },
  { title: '笑林广记', author: '古典笑话集', wikipediaUrl: 'https://zh.wikipedia.org/wiki/笑林廣記' },
  { title: '传习录', author: '王阳明', wikipediaUrl: 'https://zh.wikipedia.org/wiki/传习录' },
  { title: '庄子', author: '庄周', wikipediaUrl: 'https://zh.wikipedia.org/wiki/庄子' },
  {
    title: '论语',
    author: '孔子及其弟子',
    wikipediaUrl: 'https://zh.wikipedia.org/wiki/论语',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Commentaries_of_the_Analects_of_Confucius.jpg/250px-Commentaries_of_the_Analects_of_Confucius.jpg'
  },
  { title: '四书五经', author: '儒家经典', wikipediaUrl: 'https://zh.wikipedia.org/wiki/四书五经' },
  { title: '心经', author: '佛教经典', wikipediaUrl: wikipediaSearch('般若波罗蜜多心经') },
  { title: '金刚经', author: '佛教经典', wikipediaUrl: 'https://zh.wikipedia.org/wiki/金剛經' },
  { title: '地藏经', author: '佛教经典', wikipediaUrl: 'https://zh.wikipedia.org/wiki/地藏菩萨本愿经' }
]
