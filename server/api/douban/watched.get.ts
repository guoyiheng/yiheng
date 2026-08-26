import {
  getDoubanWatchedStore,
  proxyRemoteDoubanApi,
  requireDoubanAdmin,
  shouldUseRemoteDoubanApi
} from '../../utils/douban-auth'

const WATCHED_KEY = 'douban:watched'

interface WatchedRecord {
  version: 1
  ids: string[]
  updatedAt: string
}

const isWatchedRecord = (value: unknown): value is WatchedRecord => {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Partial<WatchedRecord>
  return candidate.version === 1
    && Array.isArray(candidate.ids)
    && candidate.ids.every(id => typeof id === 'string')
}

export default defineEventHandler(async (event) => {
  if (shouldUseRemoteDoubanApi()) return proxyRemoteDoubanApi(event)

  await requireDoubanAdmin(event)
  const store = getDoubanWatchedStore(event)
  if (!store) {
    throw createError({ statusCode: 503, message: '观影记录服务尚未配置' })
  }

  const record = await store.get<unknown>(WATCHED_KEY, 'json')
  const watched = isWatchedRecord(record)
    ? record
    : { version: 1 as const, ids: [], updatedAt: '' }

  setResponseHeader(event, 'Cache-Control', 'private, no-store')
  return watched
})
