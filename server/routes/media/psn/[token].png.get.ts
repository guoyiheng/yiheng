const PSN_IMAGE_HOSTS = new Set([
  'image.api.playstation.com',
  'psn-rsc.prod.dl.playstation.net',
  'psnobj.prod.dl.playstation.net',
  'static-resource.np.community.playstation.net'
])

const decodeToken = (token: string) => {
  const normalized = token.replaceAll('-', '+').replaceAll('_', '/')
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
  return atob(padded)
}

export default defineEventHandler(async (event) => {
  const token = getRouterParam(event, 'token') ?? ''
  let sourceUrl: URL

  if (!token || token.length > 4096) {
    throw createError({ statusCode: 400, message: '图片地址不正确' })
  }

  try {
    sourceUrl = new URL(decodeToken(token))
  } catch {
    throw createError({ statusCode: 400, message: '图片地址不正确' })
  }

  if (sourceUrl.protocol !== 'https:' || !PSN_IMAGE_HOSTS.has(sourceUrl.hostname)) {
    throw createError({ statusCode: 403, message: '图片地址不受支持' })
  }

  let response: Response
  try {
    response = await fetch(sourceUrl, {
      headers: { accept: 'image/avif,image/webp,image/png,image/*' },
      signal: AbortSignal.timeout(8000)
    })
  } catch {
    throw createError({ statusCode: 502, message: '图片暂时无法读取' })
  }

  const contentType = response.headers.get('content-type') ?? ''
  if (!response.ok || !response.body || !contentType.startsWith('image/')) {
    throw createError({ statusCode: 502, message: '图片暂时无法读取' })
  }

  return new Response(response.body, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=604800, s-maxage=31536000, stale-while-revalidate=604800, immutable'
    }
  })
})
