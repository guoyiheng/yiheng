export interface NanqiangIndexItem {
  id: string
  title: string
  featured: boolean
  date?: string
}

const rootSource = import.meta.glob('./nanqiang/index.md', {
  eager: true,
  query: '?raw',
  import: 'default'
}) as Record<string, string>

const availableDocuments = new Set(
  Object.keys(import.meta.glob('./nanqiang/*.{md,csv}', {
    query: '?raw',
    import: 'default'
  }))
    .map(sourcePath => sourcePath.split('/').at(-1)?.replace(/\.(md|csv)$/i, ''))
    .filter((id): id is string => Boolean(id))
)

const documentDates: Record<string, string> = {
  '金刚经': '1970-01-01',
  '心经': '1970-01-02',
  '四书五经': '1970-02-03',
  '诗词类': '1970-02-04',
  '文章类': '1970-02-05',
  '庄子': '1970-02-06',
  '素颜韵脚诗': '2014-09-01',
  '你在遗憾什么？': '2017-09-09',
  '鲁迅全集': '2018-07-10',
  '有个爱你的人不容易': '2018-07-21',
  '双峰': '2019-01-01',
  '金庸全集': '2019-01-01',
  'DOM0&DOM2级事件绑定的区别': '2019-08-20',
  '人间失格': '2020-01-01',
  '白鹿原': '2020-01-01',
  'Prettier 整合 ESLint 所引发的问题': '2020-06-23',
  '笑林广记': '2021-01-01',
  '金瓶梅（崇祯本）': '2021-02-18',
  '动态生成代码模板——编写基于 nodejs 的 cli 工具': '2021-08-13',
  '西游记': '2021-10-17',
  '写给大家看的设计书': '2021-10-31',
  '水浒传': '2022-01-01',
  '有关阅读': '2022-01-14',
  'vue源码之Reflect': '2022-02-13',
  '如何优雅地使用MacBook': '2022-06-01',
  '“啃老”与“躺平”': '2022-08-19',
  '安贫乐道法': '2022-08-19',
  '关于Yak Shaving ── 从理解 TS 中 any 与 unknow 的区别中学英语': '2022-08-23',
  '我们现在怎样做父亲': '2022-08-29',
  '论睁了眼看': '2022-09-15',
  '写在《坟》后面': '2022-09-25',
  '我们为什么需要阅读': '2022-09-28',
  '鲁迅名人名言之断章取义之热风': '2022-11-17',
  '鲁迅名人名言之断章取义之呐喊': '2022-12-08'
}

const safeDecode = (value: string) => {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

const stripMarkdown = (value: string) => value
  .replace(/\*\*|__|\*|_|`/g, '')
  .trim()

const source = Object.values(rootSource)[0] ?? ''
// The archive index is intentionally kept as a flat, one-link-per-line Markdown list.
const markdownLinkPattern = /^\[(.+)\]\((.+\.md)\)\s*$/gm

export const nanqiangIndex: NanqiangIndexItem[] = [...source.matchAll(markdownLinkPattern)]
  .map((match) => {
    const rawTitle = match[1] ?? ''
    const rawHref = match[2] ?? ''
    const decodedHref = safeDecode(rawHref.replace(/\.md$/i, ''))
    const id = decodedHref.split('/').at(-1) ?? decodedHref

    return {
      id,
      title: stripMarkdown(rawTitle),
      featured: /\*\*/.test(rawTitle),
      date: documentDates[id]
    }
  })
  .filter(item => item.id && availableDocuments.has(item.id))
  .reverse()
