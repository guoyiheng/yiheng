const iconSources: Record<string, string> = {
  nova: 'https://nova.yiheng.run/favicon.svg',
  typura: 'https://typura.yiheng.run/typura-mark.svg',
  'relay-lab': 'https://relay.yiheng.run/favicon.svg',
  voca: 'https://voca.yiheng.run/favicon.svg',
  design: 'https://api.iconify.design/carbon:ibm-engineering-systems-design-rhapsody.svg',
  handle: 'https://handle.yiheng.run/favicon.svg',
  'pronunciation-corrector': 'https://pronunciation.yiheng.run/favicon.svg'
}

export default defineEventHandler(async (event) => {
  const name = getRouterParam(event, 'name') ?? ''
  const sourceUrl = iconSources[name]

  if (sourceUrl) {
    try {
      const response = await fetch(sourceUrl, {
        headers: { accept: 'image/svg+xml,image/*' },
        signal: AbortSignal.timeout(5000)
      })
      if (response.ok && response.headers.get('content-type')?.includes('svg')) {
        const svg = await response.text()
        if (svg.length <= 100_000) {
          setResponseHeader(event, 'Content-Type', 'image/svg+xml; charset=utf-8')
          setResponseHeader(event, 'Cache-Control', 'public, max-age=86400, s-maxage=2592000, stale-while-revalidate=604800')
          return svg
        }
      }
    } catch {
      return sendRedirect(event, '/favicon.svg', 302)
    }
  }

  return sendRedirect(event, '/favicon.svg', 302)
})
