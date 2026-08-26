import {
  getDoubanAdminKey,
  setDoubanAdminSession,
  setDoubanAdminSessionFromKey,
  shouldUseRemoteDoubanApi,
  verifyRemoteDoubanAdminKey
} from '../../../utils/douban-auth'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ key?: unknown }>(event)

  if (shouldUseRemoteDoubanApi()) {
    if (typeof body?.key !== 'string' || body.key.length === 0) {
      throw createError({ statusCode: 401, message: '密钥不正确' })
    }

    await verifyRemoteDoubanAdminKey(event, body.key)
    await setDoubanAdminSessionFromKey(event, body.key)
    return { ok: true }
  }

  const adminKey = await getDoubanAdminKey(event)
  if (!adminKey) {
    throw createError({ statusCode: 503, message: '管理员入口尚未配置' })
  }

  if (typeof body?.key !== 'string' || body.key.length === 0 || body.key !== adminKey) {
    throw createError({ statusCode: 401, message: '密钥不正确' })
  }

  await setDoubanAdminSession(event)
  return { ok: true }
})
