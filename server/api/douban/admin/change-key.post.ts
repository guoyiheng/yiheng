import {
  getDoubanWatchedStore,
  requireDoubanAdmin,
  proxyRemoteDoubanApi,
  shouldUseRemoteDoubanApi
} from '../../../utils/douban-auth'

const ADMIN_KEY_STORAGE_KEY = 'douban:admin-key'
const MIN_KEY_LENGTH = 8
const MAX_KEY_LENGTH = 256

export default defineEventHandler(async (event) => {
  if (shouldUseRemoteDoubanApi()) return proxyRemoteDoubanApi(event)

  await requireDoubanAdmin(event)
  const store = getDoubanWatchedStore(event)
  if (!store) {
    throw createError({ statusCode: 503, message: '管理员配置服务尚未配置' })
  }

  const body = await readBody<{ key?: unknown }>(event)
  const key = typeof body?.key === 'string' ? body.key.trim() : ''
  if (key.length < MIN_KEY_LENGTH || key.length > MAX_KEY_LENGTH) {
    throw createError({ statusCode: 400, message: `密钥长度需为 ${MIN_KEY_LENGTH} 至 ${MAX_KEY_LENGTH} 个字符` })
  }

  await store.put(ADMIN_KEY_STORAGE_KEY, key)
  return { ok: true }
})
