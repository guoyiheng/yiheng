import { getPsnProfile, PSN_ID_PATTERN } from '../../utils/psn'

export default defineEventHandler(async (event) => {
  const psnId = getRouterParam(event, 'psnid')?.trim() ?? ''

  if (!PSN_ID_PATTERN.test(psnId)) {
    throw createError({ statusCode: 400, message: 'PSN ID 格式不正确' })
  }

  const profile = await getPsnProfile(event, psnId)

  setResponseHeader(
    event,
    'Cache-Control',
    'public, max-age=300, s-maxage=86400, stale-while-revalidate=86400, stale-if-error=604800'
  )

  return profile
})
