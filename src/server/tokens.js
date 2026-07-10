import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import {
  ACCESS_TOKEN_SECONDS,
  REFRESH_TOKEN_SECONDS,
} from './constants'

function requireSecret(name) {
  const value = process.env[name]
  if (!value) throw new Error(`${name} is required`)
  return value
}

export function createAccessToken({ role, sessionId, userId }) {
  return jwt.sign(
    {
      sub: String(userId),
      sessionId: String(sessionId),
      role,
    },
    requireSecret('JWT_ACCESS_SECRET'),
    { expiresIn: ACCESS_TOKEN_SECONDS },
  )
}

export function verifyAccessToken(token) {
  return jwt.verify(token, requireSecret('JWT_ACCESS_SECRET'))
}

export function createRefreshToken() {
  return crypto.randomBytes(48).toString('base64url')
}

export function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex')
}

export function refreshExpiryDate(remember = true) {
  const seconds = remember ? REFRESH_TOKEN_SECONDS : 24 * 60 * 60
  return new Date(Date.now() + seconds * 1000)
}
