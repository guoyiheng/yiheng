import { execFileSync } from 'node:child_process'

const getCopyrightYear = () => {
  try {
    const years = execFileSync(
      'git',
      ['log', '--reverse', '--format=%ad', '--date=format:%Y'],
      { encoding: 'utf8' }
    ).trim()

    return years.split('\n')[0] || '2026'
  } catch {
    return '2026'
  }
}

export default defineNuxtConfig({
  compatibilityDate: '2026-08-06',
  css: ['~/assets/css/main.css'],
  devtools: { enabled: false },
  appConfig: {
    copyrightYear: getCopyrightYear()
  },
  app: {
    head: {
      htmlAttrs: { lang: 'zh-CN' },
      title: 'yiheng',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'description', content: '一恒的个人网站。' }
      ],
      link: [
        { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'preconnect', href: 'https://cdn.jsdelivr.net', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/lxgw-wenkai-webfont@1.7.0/lxgwwenkai-regular.css'
        },
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/lxgw-wenkai-webfont@1.7.0/lxgwwenkai-bold.css'
        }
      ]
    }
  }
})
