import { getDoubanAdminKey, setDoubanAdminSession } from '../../../utils/douban-auth'

export default defineEventHandler(async (event) => {
  const adminKey = getDoubanAdminKey(event)
  if (!adminKey) {
    throw createError({ statusCode: 503, message: '管理员入口尚未配置' })
  }

  const body = await readBody<{ key?: unknown }>(event)
  if (typeof body?.key !== 'string' || body.key.length === 0 || body.key !== adminKey) {
    throw createError({ statusCode: 401, message: '密钥不正确' })
  }

  await setDoubanAdminSession(event)
  return { ok: true }
})
