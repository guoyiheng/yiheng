import { getRequestURL, proxyRequest, type H3Event } from 'h3'

const ADMIN_KEY_STORAGE_KEY = 'douban:admin-key'
const ADMIN_KEY_HEADER = 'x-admin-key'

interface DoubanCloudflareEnv {
  DOUBAN_ADMIN_KEY?: string
  YIHENG_DOUBAN_WATCHED?: DoubanWatchedStore
}

export interface DoubanWatchedStore {
  get<T = unknown>(key: string, type: 'json'): Promise<T | null>
  get<T = unknown>(key: string, type: 'text'): Promise<T | null>
  put(key: string, value: string): Promise<void>
}

const cloudflareEnvFrom = (event: H3Event): DoubanCloudflareEnv => {
  const context = event.context as { cloudflare?: { env?: DoubanCloudflareEnv } }
  return context.cloudflare?.env ?? {}
}

export const shouldUseRemoteDoubanApi = () => import.meta.dev

const remoteDoubanUrl = (event: H3Event) => {
  const origin = useRuntimeConfig(event).doubanRemoteOrigin
  const requestUrl = getRequestURL(event)
  return new URL(`${requestUrl.pathname}${requestUrl.search}`, origin).toString()
}

export const proxyRemoteDoubanApi = (event: H3Event) => {
  return proxyRequest(event, remoteDoubanUrl(event))
}

export const verifyRemoteDoubanAdminKey = async (event: H3Event, key: string) => {
  const response = await fetch(remoteDoubanUrl(event), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key })
  })

  if (response.ok) return

  const body = await response.json().catch(() => null) as { message?: string } | null
  throw createError({
    statusCode: response.status,
    message: body?.message || (response.status === 401 ? '密钥不正确' : '管理员入口暂时不可用')
  })
}

export const getDoubanAdminKey = async (event: H3Event) => {
  const env = cloudflareEnvFrom(event)
  const configuredKey = env.DOUBAN_ADMIN_KEY ?? process.env.DOUBAN_ADMIN_KEY
  const fallback = configuredKey || (import.meta.dev ? 'yiheng-local-admin' : '')
  const store = env.YIHENG_DOUBAN_WATCHED

  if (!store) return fallback

  try {
    const configured = await store.get<string>(ADMIN_KEY_STORAGE_KEY, 'text')
    return typeof configured === 'string' && configured ? configured : fallback
  } catch {
    return fallback
  }
}

export const getDoubanWatchedStore = (event: H3Event) => {
  return cloudflareEnvFrom(event).YIHENG_DOUBAN_WATCHED
}

const timingSafeEqual = (left: string, right: string) => {
  if (left.length !== right.length) return false

  let mismatch = 0
  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index)
  }
  return mismatch === 0
}

// 前端把管理员密钥保存在 sessionStorage，并通过请求头携带。
export const getRequestAdminKey = (event: H3Event) => {
  const header = getHeader(event, ADMIN_KEY_HEADER)
  return typeof header === 'string' ? header.trim() : ''
}

export const isDoubanAdminAuthenticated = async (event: H3Event) => {
  const adminKey = await getDoubanAdminKey(event)
  if (!adminKey) return false

  const requestKey = getRequestAdminKey(event)
  return Boolean(requestKey) && timingSafeEqual(requestKey, adminKey)
}

export const requireDoubanAdmin = async (event: H3Event) => {
  if (await isDoubanAdminAuthenticated(event)) return

  throw createError({ statusCode: 401, message: '需要管理员登录' })
}
