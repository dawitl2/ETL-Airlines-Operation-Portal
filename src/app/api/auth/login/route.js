import { z } from 'zod'
import { apiError, apiOk, safeUserPayload } from '../../../../server/api'
import { comparePassword, createSessionForUser, getUserWithRole } from '../../../../server/auth'
import { connectToDatabase } from '../../../../server/db'
import { recordAuditEvent } from '../../../../server/audit'
import { Session, User } from '../../../../server/models'
import { getRequestMeta } from '../../../../server/requestMeta'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  remember: z.boolean().optional().default(true),
})

const GENERIC_MESSAGE = 'Unable to sign in with the provided credentials.'

export async function POST(request) {
  try {
    await connectToDatabase()
  } catch {
    return apiError(
      'SERVICE_UNAVAILABLE',
      'Authentication is not configured. Set MONGODB_URI and restart the server.',
      503,
    )
  }
  const parsed = loginSchema.safeParse(await request.json().catch(() => ({})))
  if (!parsed.success) {
    return apiError('INVALID_REQUEST', 'Please enter a valid email and password.', 400)
  }

  const { email, password, remember } = parsed.data
  const requestMeta = getRequestMeta(request)
  const user = await User.findOne({ email: email.toLowerCase() })

  if (!user) {
    await recordAuditEvent({
      action: 'LOGIN_FAILED',
      category: 'AUTH',
      result: 'FAILED',
      ipAddress: requestMeta.ipAddress,
      userAgent: requestMeta.userAgent,
      metadata: { reason: 'invalid_credentials' },
    })
    return apiError('INVALID_CREDENTIALS', GENERIC_MESSAGE, 401)
  }

  if (user.accountStatus === 'SUSPENDED') {
    await recordAuditEvent({
      action: 'LOGIN_BLOCKED',
      actorUserId: user._id,
      category: 'AUTH',
      result: 'DENIED',
      ipAddress: requestMeta.ipAddress,
      userAgent: requestMeta.userAgent,
      metadata: { reason: 'suspended' },
    })
    return apiError('ACCOUNT_SUSPENDED', 'This account is suspended. Contact your administrator.', 403)
  }

  if (user.accountStatus === 'DISABLED') {
    return apiError('ACCOUNT_DISABLED', 'This account is disabled. Contact your administrator.', 403)
  }

  if (user.lockedUntil && user.lockedUntil > new Date()) {
    return apiError('ACCOUNT_LOCKED', 'This account is temporarily locked. Try again later.', 423)
  }

  const passwordValid = await comparePassword(password, user.passwordHash)
  if (!passwordValid) {
    user.failedLoginCount += 1
    if (user.failedLoginCount >= 5) {
      user.accountStatus = 'LOCKED'
      user.lockedUntil = new Date(Date.now() + 15 * 60 * 1000)
      await recordAuditEvent({
        action: 'ACCOUNT_LOCKED',
        actorUserId: user._id,
        category: 'AUTH',
        result: 'LOCKED',
        ipAddress: requestMeta.ipAddress,
        userAgent: requestMeta.userAgent,
      })
    }
    await user.save()
    await recordAuditEvent({
      action: 'LOGIN_FAILED',
      actorUserId: user._id,
      category: 'AUTH',
      result: 'FAILED',
      ipAddress: requestMeta.ipAddress,
      userAgent: requestMeta.userAgent,
      metadata: { failedLoginCount: user.failedLoginCount },
    })
    return apiError('INVALID_CREDENTIALS', GENERIC_MESSAGE, 401)
  }

  user.failedLoginCount = 0
  user.lockedUntil = undefined
  user.accountStatus = user.accountStatus === 'LOCKED' ? 'ACTIVE' : user.accountStatus
  user.lastLoginAt = new Date()
  await user.save()

  const auth = await getUserWithRole(user._id)
  await createSessionForUser({ remember, requestMeta, roleCode: auth.role.code, user })
  const sessions = await Session.find({ userId: user._id, revokedAt: { $exists: false } })
    .sort({ lastUsedAt: -1 })
    .lean()

  await recordAuditEvent({
    action: 'LOGIN_SUCCESS',
    actorUserId: user._id,
    category: 'AUTH',
    result: 'SUCCESS',
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent,
  })

  return apiOk({
    user: safeUserPayload(user, auth.role, auth.permissions, sessions.map((session) => ({
      id: String(session._id),
      browser: session.browser,
      operatingSystem: session.operatingSystem,
      ipAddress: session.ipAddress,
      lastUsedAt: session.lastUsedAt,
      createdAt: session.createdAt,
    }))),
  })
}
