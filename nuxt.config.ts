export default defineNuxtConfig({
  compatibilityDate: '2026-08-06',
  modules: ['@nuxt/ui'],
  ui: {
    fonts: false
  },
  css: ['~/assets/css/main.css'],
  devtools: { enabled: false },
  app: {
    head: {
      htmlAttrs: { lang: 'zh-CN' },
      title: '一恒的纸上存档',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'description', content: '一恒的个人博客，记录设计、代码与生活。' },
        { name: 'theme-color', content: '#26352f' }
      ],
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Noto+Serif+SC:wght@400;500;600&display=swap'
        }
      ]
    }
  }
})
