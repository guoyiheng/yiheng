export interface WanderingTable {
  headers: string[]
  rows: string[][]
}

export interface WanderingBlock {
  type: 'paragraph' | 'code' | 'list' | 'link' | 'image' | 'table'
  text?: string
  code?: string
  items?: string[]
  href?: string
  src?: string
  alt?: string
  table?: WanderingTable
}

export interface WanderingEntry {
  title: string
  date: string
  blocks: WanderingBlock[]
}

export const wanderingEntries: WanderingEntry[] = [
  {
    title: '新年',
    date: '2026-01-01',
    blocks: []
  },
  {
    title: '新年',
    date: '2025-01-01',
    blocks: [
      { type: 'paragraph', text: '以有涯随无涯' }
    ]
  },
  {
    title: '新年',
    date: '2024-01-01',
    blocks: [
      { type: 'paragraph', text: '你衣衫褴褛，不停旋转，浩瀚又悲伤' }
    ]
  },
  {
    title: 'Bundler Build Feature Flags',
    date: '2023-07-27',
    blocks: [
      {
        type: 'paragraph',
        text: 'Starting with 3.0.0-rc.3, esm-bundler builds now exposes global feature flags that can be overwritten at compile time:'
      },
      {
        type: 'list',
        items: [
          '__VUE_OPTIONS_API__ (enable/disable Options API support, default: true)',
          '__VUE_PROD_DEVTOOLS__ (enable/disable devtools support in production, default: false)'
        ]
      }
    ]
  },
  {
    title: 'Dark/light mode on/off button Not working',
    date: '2023-07-19',
    blocks: [
      {
        type: 'link',
        text: 'GitHub issue #234',
        href: 'https://github.com/stephenou/fruitionsite/issues/234'
      }
    ]
  },
  {
    title: '新年',
    date: '2023-01-01',
    blocks: [
      { type: 'paragraph', text: '唵嘛呢叭咪吽' }
    ]
  },
  {
    title: 'Handle with the query string of a URL',
    date: '2022-11-21',
    blocks: [
      { type: 'code', code: "new URLSearchParams(location.search).get('xxx')" },
      {
        type: 'link',
        text: 'Goto MDN',
        href: 'https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams'
      }
    ]
  },
  {
    title: 'Effect data structure design',
    date: '2022-11-20',
    blocks: [
      {
        type: 'image',
        src: '/images/effect-data-structure.png',
        alt: 'Effect data structure design'
      }
    ]
  },
  {
    title: 'HTML Elements: <figure>',
    date: '2022-05-28',
    blocks: [
      {
        type: 'code',
        code: '<figure>\n  <img src="xxx.png" />\n  <figcaption>This is Optional Caption element</figcaption>\n</figure>'
      }
    ]
  },
  {
    title: 'Native deep clone objects',
    date: '2022-05-08',
    blocks: [
      { type: 'paragraph', text: "❌ Won't copy functions, Dates, undefined, and many more" },
      { type: 'code', code: 'JSON.parse(JSON.stringify(object))' },
      { type: 'paragraph', text: '❌ OK, but requires lodash' },
      { type: 'code', code: '_.cloneDeep(obj)' },
      { type: 'paragraph', text: '✅ Native API !!!' },
      { type: 'code', code: 'structuredClone(obj)' },
      {
        type: 'link',
        text: 'Goto MDN',
        href: 'https://developer.mozilla.org/en-US/docs/Web/API/structuredClone#syntax'
      }
    ]
  },
  {
    title: 'grayscale',
    date: '2022-04-18',
    blocks: [
      {
        type: 'code',
        code: '.gray {\n    -webkit-filter: grayscale(100%);\n    -moz-filter: grayscale(100%);\n    -ms-filter: grayscale(100%);\n    -o-filter: grayscale(100%);\n    filter: grayscale(100%);\n    filter: gray;\n}'
      }
    ]
  },
  {
    title: 'Frosted Glass Effect',
    date: '2022-04-17',
    blocks: [
      {
        type: 'code',
        code: '.card {\n  border-radius: 8px;\n  backdrop-filter: blur(20px);\n  background-color: rgba(255, 255, 255, 0.5);\n  box-shadow: 0 1px 12px rgba(0, 0, 0, 0.25);\n  border: 1px solid rgba(255, 255, 255, 0.3);\n}'
      }
    ]
  },
  {
    title: '新年',
    date: '2022-01-01',
    blocks: [
      { type: 'paragraph', text: '我们在天上的父 愿人都尊你的名为圣' },
      { type: 'paragraph', text: '愿你的国降临 愿你的旨意行在地上 如同行在天上' },
      { type: 'paragraph', text: '我们日用的饮食 今日赐给我们 免我们的债 如同我们免了人的债' },
      { type: 'paragraph', text: '不叫我们遇见试探 救我们脱离凶恶 因为国度 权柄 荣耀 全是你的直到永远 阿门' }
    ]
  },
  {
    title: 'git-stash',
    date: '2021-12-20',
    blocks: [
      { type: 'paragraph', text: 'I just found out that I can use git stash to save the dirty working! Amazing thing!' },
      { type: 'paragraph', text: 'git stash : Stash the changes in a dirty working directory away' },
      { type: 'paragraph', text: 'When you need to switch branches without committing the current content, just use it!' },
      { type: 'code', code: 'git stash\ngit stash pop\ngit stash list\ngit stash drop / git stash clean\ngit stash save "message"' }
    ]
  },
  {
    title: '__dirname in ESM',
    date: '2021-9-18',
    blocks: [
      {
        type: 'code',
        code: "import { dirname } from 'path'\nimport { fileURLToPath } from 'url'\n\nconst _dirname = typeof __dirname !== 'undefined' ? __dirname : dirname(fileURLToPath(import.meta.url))"
      }
    ]
  },
  {
    title: 'Social Sharing',
    date: '2021-09-14',
    blocks: [
      {
        type: 'code',
        code: '<meta property="og:title" content="TITLE OF PAGE" />\n<meta property="og:image" content="URL OF IMAGE ONLY" />\n<meta property="og:url" content="URL OF WEBPAGE" />\n<meta property="og:description" content="DESCRIPTION OF PAGE" />'
      }
    ]
  },
  {
    title: 'Custom cursor color',
    date: '2021-09-11',
    blocks: [
      { type: 'paragraph', text: 'Cursor color is inherited from the input. If you only want to change the cursor color：' },
      { type: 'code', code: 'input {\n  caret-color: red;\n}' }
    ]
  },
  {
    title: 'Move all files from one folder to another',
    date: '2021-07-10',
    blocks: [
      { type: 'paragraph', text: 'How do I move all files from one folder to another using the command line?' },
      {
        type: 'code',
        code: 'find ~/Folder/ -type f -print0 | xargs -0 mv -t ~/dl\n\n# e.g\nfind ./ -type f -iname "*.mp4" -exec mv {} ./dl \\;\nfind ./ -type f -iname "*.mkv" -exec mv {} ./dl \\;\n\n# -type with the argument -type you can specify type file.on this statement that is the mean file.if using of -d that means directory.\n# -iname: the most common and obvious method to look for a file is using its -name argument.if you are not sure about its case-sensitivity you can use of -iname argument\n# - mv {} and finally to specify target directory and then moving the files on there using mv {} argument\n\n# media type\n# video\n# mp4,wmv,rmvb,avi,rm,mov,flv,mkv\n# zip\n# *.rar *.zip *.7z *.iso *.wav *.flac *.mp3 *.aac\n# image\n# *.png *.jpg *.gif *.jpeg *.bmp'
      }
    ]
  },
  {
    title: '新年',
    date: '2021-01-01',
    blocks: [
      {
        type: 'paragraph',
        text: '寻梦！撑一支长篙，\n向青草更青处漫溯；\n满载一船星辉，\n在星辉斑斓里放歌。'
      },
      { type: 'paragraph', text: '愿我们平日都快乐。' }
    ]
  },
  {
    title: 'Nice font for zh-cn',
    date: '2020-06-18',
    blocks: [{ type: 'code', code: "font-family: 'Liu Jian Mao Cao';" }]
  },
  {
    title: 'git squash',
    date: '2020-06-16',
    blocks: [
      { type: 'paragraph', text: 'To "squash" in Git means to combine multiple commits into one.' },
      {
        type: 'code',
        code: "git checkout master  //switch main branch\n\ngit merge --squash dev  //Merge multiple commits of a branch at once\n\ngit commit -m 'xxx版'  //commit the just 'merged commit' to the master branch"
      },
      { type: 'code', code: 'git rebase -i origin/master' }
    ]
  },
  {
    title: 'Multiple-line overflow ellipsis',
    date: '2020-06-14',
    blocks: [
      {
        type: 'code',
        code: 'width: 418rpx;\noverflow: hidden;\ntext-overflow: ellipsis;\ndisplay: -webkit-box;\n-webkit-line-clamp: 2;\n-webkit-box-orient: vertical;'
      }
    ]
  },
  {
    title: 'Full expanded contract of a Typescript type',
    date: '2020-06-12',
    blocks: [
      {
        type: 'link',
        text: 'stackoverflow: how-can-i-see-the-full-expanded-contract-of-a-typescript-type',
        href: 'https://stackoverflow.com/questions/57683303/how-can-i-see-the-full-expanded-contract-of-a-typescript-type'
      },
      {
        type: 'code',
        code: '// expands object types one level deep\ntype Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never\n\n// expands object types recursively\ntype ExpandRecursively<T> = T extends object ? (T extends infer O ? { [K in keyof O]: ExpandRecursively<O[K]> } : never) : T'
      }
    ]
  },
  {
    title: 'gitHooks',
    date: '2020-04-06',
    blocks: [
      {
        type: 'table',
        table: {
          headers: ['name', 'desc'],
          rows: [
            ['feat', '增加新功能'],
            ['fix', '修复问题/BUG'],
            ['style', '代码风格相关无影响运行结果的'],
            ['perf', '优化/性能提升'],
            ['refactor', '重构'],
            ['revert', '撤销修改'],
            ['test', '测试相关'],
            ['docs', '文档/注释'],
            ['chore', '依赖更新/脚手架配置修改等'],
            ['workflow', '工作流改进'],
            ['ci', '持续集成'],
            ['types', '类型定义文件更改'],
            ['wip', '开发中']
          ]
        }
      },
      {
        type: 'link',
        text: 'Conventional Commits',
        href: 'https://www.conventionalcommits.org/en/v1.0.0/#summary'
      }
    ]
  },
  {
    title: 'Click on the tDom(target) to close the cDom(specific)',
    date: '2020-04-03',
    blocks: [
      {
        type: 'code',
        code: "document.addEventListener('click', event => {\n  const cDom = document.querySelector('#filter-header')\n  const tDom = event.target\n  if (cDom === tDom || cDom.contains(tDom)) {\n    // ...\n  } else {\n    cDom.style.display = 'none'\n  }\n})"
      }
    ]
  },
  {
    title: 'Breakpoints',
    date: '2020-01-09',
    blocks: [
      {
        type: 'table',
        table: {
          headers: ['Variant', 'Rule', 'Description'],
          rows: [
            ['sm', '@media (min-width: 640px)', 'Enable utility when the screen width is greater than 640px'],
            ['md', '@media (min-width: 768px)', 'Enable utility when the screen width is greater than 768px'],
            ['lg', '@media (min-width: 1024px)', 'Enable utility when the screen width is greater than 1024px'],
            ['xl', '@media (min-width: 1280px)', 'Enable utility when the screen width is greater than 1280px'],
            ['2xl', '@media (min-width: 1536px)', 'Enable utility when the screen width is greater than 1536px']
          ]
        }
      }
    ]
  },
  {
    title: 'Solve the problem of mac USB connection interruption',
    date: '2019-09-09',
    blocks: [{ type: 'code', code: 'sudo killall -STOP -c usbd' }]
  }
]
