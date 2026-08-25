const ALLOWED_HOSTS = new Set([
  'img1.doubanio.com',
  'img2.doubanio.com',
  'img3.doubanio.com',
  'img9.doubanio.com'
])

export default defineEventHandler(async (event) => {
  const source = getQuery(event).url

  if (typeof source !== 'string' || !source) {
    throw createError({ statusCode: 400, message: '图片地址无效' })
  }

  let url: URL
  try {
    url = new URL(source)
  } catch {
    throw createError({ statusCode: 400, message: '图片地址无效' })
  }

  if (url.protocol !== 'https:' || !ALLOWED_HOSTS.has(url.hostname)) {
    throw createError({ statusCode: 403, message: '图片地址不受支持' })
  }

  let response: Response
  try {
    response = await fetch(url, {
      headers: {
        accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
        referer: 'https://movie.douban.com/',
        'user-agent': 'Mozilla/5.0 (compatible; yiheng.run/1.0)'
      },
      signal: AbortSignal.timeout(8000)
    })
  } catch {
    throw createError({ statusCode: 502, message: '图片暂时无法读取' })
  }

  if (!response.ok) {
    throw createError({ statusCode: 502, message: '图片暂时无法读取' })
  }

  setHeader(event, 'content-type', response.headers.get('content-type') ?? 'image/jpeg')
  setHeader(event, 'cache-control', 'public, max-age=86400, s-maxage=604800')
  return new Uint8Array(await response.arrayBuffer())
})
