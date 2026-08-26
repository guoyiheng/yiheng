import { clearDoubanAdminSession } from '../../../utils/douban-auth'

export default defineEventHandler((event) => {
  clearDoubanAdminSession(event)
  return { ok: true }
})
