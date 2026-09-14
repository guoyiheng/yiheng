import { fetchPsnProfile, savePsnProfile, PSN_ID_PATTERN } from '../../../utils/psn'
import { requireDoubanAdmin } from '../../../utils/douban-auth'

export default defineEventHandler(async (event) => {
  await requireDoubanAdmin(event)

  const psnId = getRouterParam(event, 'psnid')?.trim() ?? ''

  if (!PSN_ID_PATTERN.test(psnId)) {
    throw createError({ statusCode: 400, message: 'PSN ID 格式不正确' })
  }

  const profile = await fetchPsnProfile(psnId)
  await savePsnProfile(event, psnId, profile)

  setResponseHeader(event, 'Cache-Control', 'no-store')
  return profile
})
