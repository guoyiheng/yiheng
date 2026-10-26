import {
  getDoubanAdminKey,
  shouldUseRemoteDoubanApi,
  verifyRemoteDoubanAdminKey
} from '../../../utils/douban-auth'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ key?: unknown }>(event)
  const key = typeof body?.key === 'string' ? body.key.trim() : ''

  if (!key) {
    throw createError({ statusCode: 401, message: '密钥不正确' })
  }

  if (shouldUseRemoteDoubanApi()) {
    await verifyRemoteDoubanAdminKey(event, key)
    return { ok: true }
  }

  const adminKey = await getDoubanAdminKey(event)
  if (!adminKey) {
    throw createError({ statusCode: 503, message: '管理员入口尚未配置' })
  }

  if (key !== adminKey) {
    throw createError({ statusCode: 401, message: '密钥不正确' })
  }

  return { ok: true }
})
