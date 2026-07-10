import { cookies } from 'next/headers'
import {
  ACCESS_COOKIE,
  ACCESS_TOKEN_SECONDS,
  REFRESH_COOKIE,
  REFRESH_TOKEN_SECONDS,
} from './constants'

function cookieOptions(maxAge) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge,
  }
}

export async function setAuthCookies(accessToken, refreshToken, remember = true) {
  const jar = await cookies()
  jar.set(ACCESS_COOKIE, accessToken, cookieOptions(ACCESS_TOKEN_SECONDS))
  jar.set(
    REFRESH_COOKIE,
    refreshToken,
    cookieOptions(remember ? REFRESH_TOKEN_SECONDS : 24 * 60 * 60),
  )
}

export async function clearAuthCookies() {
  const jar = await cookies()
  jar.set(ACCESS_COOKIE, '', { ...cookieOptions(0), maxAge: 0 })
  jar.set(REFRESH_COOKIE, '', { ...cookieOptions(0), maxAge: 0 })
}

export async function readAuthCookies() {
  const jar = await cookies()
  return {
    accessToken: jar.get(ACCESS_COOKIE)?.value,
    refreshToken: jar.get(REFRESH_COOKIE)?.value,
  }
}
