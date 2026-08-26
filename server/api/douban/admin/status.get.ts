import {
  isDoubanAdminAuthenticated,
  proxyRemoteDoubanApi,
  shouldUseRemoteDoubanApi
} from '../../../utils/douban-auth'

export default defineEventHandler(async (event) => {
  if (shouldUseRemoteDoubanApi()) return proxyRemoteDoubanApi(event)
  return { authenticated: await isDoubanAdminAuthenticated(event) }
})
