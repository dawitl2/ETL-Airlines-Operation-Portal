import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'
import { connectToDatabase } from './db'
import { ROLE_LANDING, ROLE_REQUIRED_PERMISSION } from './constants'
import { clearAuthCookies, readAuthCookies, setAuthCookies } from './cookies'
import { recordAuditEvent } from './audit'
import { Permission, Role, Session, User } from './models'
import { createAccessToken, createRefreshToken, hashToken, refreshExpiryDate, verifyAccessToken } from './tokens'

export async function getUserWithRole(userId) {
  const user = await User.findById(userId)
    .populate('roleId')
    .populate('employeeProfileId')

  if (!user) return null
  const role = user.roleId
  const permissions = await Permission.find({ _id: { $in: role.permissionIds } }).lean()
  return {
    user,
    role,
    permissions: permissions.map((permission) => permission.code),
  }
}

export async function getCurrentSession() {
  try {
    await connectToDatabase()
  } catch {
    return null
  }
  const { accessToken } = await readAuthCookies()
  if (!accessToken) return null

  try {
    const claims = verifyAccessToken(accessToken)
    const session = await Session.findById(claims.sessionId)
    if (!session || session.revokedAt || session.expiresAt <= new Date()) return null

    const auth = await getUserWithRole(claims.sub)
    if (!auth || auth.user.accountStatus !== 'ACTIVE') return null
    return { ...auth, claims, session }
  } catch {
    return null
  }
}

export async function requireAuthentication() {
  const auth = await getCurrentSession()
  if (!auth) redirect('/login')
  return auth
}

export async function requirePermission(permissionCode) {
  const auth = await requireAuthentication()
  if (!auth.permissions.includes(permissionCode)) {
    await recordAuditEvent({
      action: 'PERMISSION_DENIED',
      actorUserId: auth.user._id,
      category: 'AUTHORIZATION',
      result: 'DENIED',
      metadata: { permissionCode },
    })
    redirect('/forbidden')
  }
  return auth
}

export async function requireRolePage(roleCode) {
  const auth = await requirePermission(ROLE_REQUIRED_PERMISSION[roleCode])
  if (auth.role.code !== roleCode) redirect(ROLE_LANDING[auth.role.code] || '/login')
  return auth
}

export async function createSessionForUser({ remember, requestMeta, roleCode, user }) {
  const refreshToken = createRefreshToken()
  const expiresAt = refreshExpiryDate(remember)
  const session = await Session.create({
    userId: user._id,
    refreshTokenHash: hashToken(refreshToken),
    expiresAt,
    lastUsedAt: new Date(),
    ...requestMeta,
  })

  const accessToken = createAccessToken({
    role: roleCode,
    sessionId: session._id,
    userId: user._id,
  })

  await setAuthCookies(accessToken, refreshToken, remember)
  return session
}

export async function rotateRefreshToken(requestMeta = {}) {
  await connectToDatabase()
  const { refreshToken } = await readAuthCookies()
  if (!refreshToken) return null

  const tokenHash = hashToken(refreshToken)
  const session = await Session.findOne({ refreshTokenHash: tokenHash }).populate('userId')
  if (!session || session.revokedAt || session.expiresAt <= new Date()) {
    await clearAuthCookies()
    return null
  }

  const auth = await getUserWithRole(session.userId._id)
  if (!auth || auth.user.accountStatus !== 'ACTIVE') {
    await revokeSession(session._id, 'user_not_active')
    await clearAuthCookies()
    return null
  }

  const newRefreshToken = createRefreshToken()
  session.refreshTokenHash = hashToken(newRefreshToken)
  session.lastUsedAt = new Date()
  Object.assign(session, requestMeta)
  await session.save()

  const accessToken = createAccessToken({
    role: auth.role.code,
    sessionId: session._id,
    userId: auth.user._id,
  })
  await setAuthCookies(accessToken, newRefreshToken, true)

  await recordAuditEvent({
    action: 'SESSION_REFRESH',
    actorUserId: auth.user._id,
    category: 'AUTH',
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent,
  })

  return { ...auth, session }
}

export async function revokeSession(sessionId, reason = 'logout') {
  await Session.findByIdAndUpdate(sessionId, {
    revokedAt: new Date(),
    revokeReason: reason,
  })
}

export async function revokeAllSessions(userId, reason = 'logout_all') {
  await Session.updateMany(
    { userId, revokedAt: { $exists: false } },
    { revokedAt: new Date(), revokeReason: reason },
  )
}

export async function comparePassword(password, passwordHash) {
  return bcrypt.compare(password, passwordHash)
}

export async function hashPassword(password) {
  return bcrypt.hash(password, 12)
}
