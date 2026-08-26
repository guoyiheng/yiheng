import { isDoubanAdminAuthenticated } from '../../../utils/douban-auth'

export default defineEventHandler(async (event) => {
  return { authenticated: await isDoubanAdminAuthenticated(event) }
})
