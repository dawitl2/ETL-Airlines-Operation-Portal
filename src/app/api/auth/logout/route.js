import { apiOk } from '../../../../server/api'
import { getCurrentSession, revokeSession } from '../../../../server/auth'
import { clearAuthCookies } from '../../../../server/cookies'
import { recordAuditEvent } from '../../../../server/audit'
import { getRequestMeta } from '../../../../server/requestMeta'

export async function POST(request) {
  const auth = await getCurrentSession()
  const requestMeta = getRequestMeta(request)
  if (auth) {
    await revokeSession(auth.session._id, 'logout')
    await recordAuditEvent({
      action: 'LOGOUT',
      actorUserId: auth.user._id,
      category: 'AUTH',
      ipAddress: requestMeta.ipAddress,
      userAgent: requestMeta.userAgent,
    })
  }
  await clearAuthCookies()
  return apiOk({ ok: true })
}
