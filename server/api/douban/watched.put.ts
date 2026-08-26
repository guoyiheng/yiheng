import {
  getDoubanWatchedStore,
  proxyRemoteDoubanApi,
  requireDoubanAdmin,
  shouldUseRemoteDoubanApi
} from '../../utils/douban-auth'

const WATCHED_KEY = 'douban:watched'
const MOVIE_ID_PATTERN = /^\d+$/
const MAX_WATCHED_IDS = 500

export default defineEventHandler(async (event) => {
  if (shouldUseRemoteDoubanApi()) return proxyRemoteDoubanApi(event)

  await requireDoubanAdmin(event)
  const store = getDoubanWatchedStore(event)
  if (!store) {
    throw createError({ statusCode: 503, message: '观影记录服务尚未配置' })
  }

  const body = await readBody<{ ids?: unknown }>(event)
  if (!Array.isArray(body?.ids)) {
    throw createError({ statusCode: 400, message: '观影记录格式无效' })
  }

  const ids = [...new Set(body.ids)]
  if (ids.length > MAX_WATCHED_IDS || ids.some(id => typeof id !== 'string' || !MOVIE_ID_PATTERN.test(id))) {
    throw createError({ statusCode: 400, message: '观影记录格式无效' })
  }

  const record = {
    version: 1 as const,
    ids,
    updatedAt: new Date().toISOString()
  }
  await store.put(WATCHED_KEY, JSON.stringify(record))

  setResponseHeader(event, 'Cache-Control', 'private, no-store')
  return record
})
