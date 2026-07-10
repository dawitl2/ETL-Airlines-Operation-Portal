import { apiError, apiOk, safeUserPayload } from '../../../../server/api'
import { rotateRefreshToken } from '../../../../server/auth'
import { getRequestMeta } from '../../../../server/requestMeta'

export async function POST(request) {
  const auth = await rotateRefreshToken(getRequestMeta(request))
  if (!auth) return apiError('UNAUTHENTICATED', 'Please sign in again.', 401)

  return apiOk({
    user: safeUserPayload(auth.user, auth.role, auth.permissions),
  })
}
