import { apiError, apiOk } from '../../../../server/api'
import { getCurrentSession, revokeAllSessions } from '../../../../server/auth'
import { clearAuthCookies } from '../../../../server/cookies'
import { recordAuditEvent } from '../../../../server/audit'
import { getRequestMeta } from '../../../../server/requestMeta'

export async function POST(request) {
  const auth = await getCurrentSession()
  if (!auth) return apiError('UNAUTHENTICATED', 'Authentication is required.', 401)
  const requestMeta = getRequestMeta(request)
  await revokeAllSessions(auth.user._id, 'logout_all')
  await recordAuditEvent({
    action: 'LOGOUT_ALL',
    actorUserId: auth.user._id,
    category: 'AUTH',
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent,
  })
  await clearAuthCookies()
  return apiOk({ ok: true })
}
