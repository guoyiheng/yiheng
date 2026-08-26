import {
  getDoubanWatchedStore,
  requireDoubanAdmin,
  clearDoubanAdminSession,
  proxyRemoteDoubanApi,
  shouldUseRemoteDoubanApi
} from '../../../utils/douban-auth'

const ADMIN_KEY_STORAGE_KEY = 'douban:admin-key'
const MIN_KEY_LENGTH = 8
const MAX_KEY_LENGTH = 256

export default defineEventHandler(async (event) => {
  if (shouldUseRemoteDoubanApi()) {
    const response = await proxyRemoteDoubanApi(event)
    clearDoubanAdminSession(event)
    return response
  }

  await requireDoubanAdmin(event)
  const store = getDoubanWatchedStore(event)
  if (!store) {
    throw createError({ statusCode: 503, message: '管理员配置服务尚未配置' })
  }

  const body = await readBody<{ key?: unknown }>(event)
  if (typeof body?.key !== 'string' || body.key.length < MIN_KEY_LENGTH || body.key.length > MAX_KEY_LENGTH) {
    throw createError({ statusCode: 400, message: `密钥长度需为 ${MIN_KEY_LENGTH} 至 ${MAX_KEY_LENGTH} 个字符` })
  }

  await store.put(ADMIN_KEY_STORAGE_KEY, body.key)
  clearDoubanAdminSession(event)
  return { ok: true }
})
