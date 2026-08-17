const iconSources: Record<string, string> = {
  nova: 'https://nova.yiheng.run/favicon.svg',
  typura: 'https://typura.yiheng.run/typura-mark.svg',
  'relay-lab': 'https://relay.yiheng.run/favicon.svg',
  voca: 'https://voca.yiheng.run/favicon.svg',
  design: 'https://api.iconify.design/carbon:ibm-engineering-systems-design-rhapsody.svg',
  handle: 'https://handle.yiheng.run/favicon.svg',
  'pronunciation-corrector': 'https://pronunciation.yiheng.run/favicon.svg'
}

const fallbackIcon = (name: string) => {
  const letter = iconSources[name] ? name.charAt(0).toUpperCase() : 'Y'
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="${letter}"><rect width="64" height="64" rx="8" fill="#e7e1d5"/><text x="32" y="39" fill="#4d4840" font-family="sans-serif" font-size="27" font-weight="700" text-anchor="middle">${letter}</text></svg>`
}

export default defineEventHandler(async (event) => {
  const name = getRouterParam(event, 'name') ?? ''
  const sourceUrl = iconSources[name]
  let body = fallbackIcon(name)

  if (sourceUrl) {
    try {
      const response = await fetch(sourceUrl, {
        headers: { accept: 'image/svg+xml,image/*' },
        signal: AbortSignal.timeout(5000)
      })
      if (response.ok && response.headers.get('content-type')?.includes('svg')) {
        const svg = await response.text()
        if (svg.length <= 100_000) body = svg
      }
    } catch {
      // The local fallback keeps the row useful when an upstream favicon is unavailable.
    }
  }

  setResponseHeader(event, 'Content-Type', 'image/svg+xml; charset=utf-8')
  setResponseHeader(event, 'Cache-Control', 'public, max-age=86400, s-maxage=2592000, stale-while-revalidate=604800')
  return body
})
