export default defineNuxtConfig({
  compatibilityDate: '2026-08-06',
  css: ['~/assets/css/main.css'],
  devtools: { enabled: false },
  app: {
    head: {
      htmlAttrs: { lang: 'zh-CN' },
      title: 'yiheng',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'description', content: '一恒的个人网站。' },
        { name: 'theme-color', content: '#e7e5df' }
      ],
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Noto+Serif+SC:wght@400;500&display=swap'
        }
      ]
    }
  }
})
