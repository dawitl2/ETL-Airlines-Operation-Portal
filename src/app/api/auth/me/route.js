import { apiError, apiOk, safeUserPayload } from '../../../../server/api'
import { getCurrentSession } from '../../../../server/auth'
import { Session } from '../../../../server/models'

export async function GET() {
  const auth = await getCurrentSession()
  if (!auth) return apiError('UNAUTHENTICATED', 'Authentication is required.', 401)

  const sessions = await Session.find({ userId: auth.user._id, revokedAt: { $exists: false } })
    .sort({ lastUsedAt: -1 })
    .lean()

  return apiOk({
    user: safeUserPayload(auth.user, auth.role, auth.permissions, sessions.map((session) => ({
      id: String(session._id),
      current: String(session._id) === String(auth.session._id),
      deviceName: session.deviceName,
      browser: session.browser,
      operatingSystem: session.operatingSystem,
      ipAddress: session.ipAddress,
      lastUsedAt: session.lastUsedAt,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
    }))),
  })
}
