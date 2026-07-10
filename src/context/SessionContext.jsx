'use client'

import { createContext, useContext, useMemo, useState } from 'react'

const SessionContext = createContext(null)

export function SessionProvider({ children, initialUser = null }) {
  const [currentUser, setCurrentUser] = useState(initialUser)

  async function login(credentials) {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    })
    const payload = await response.json()
    if (!response.ok) {
      throw payload.error || { code: 'LOGIN_FAILED', message: 'Unable to sign in.' }
    }
    setCurrentUser(payload.user)
    return payload.user
  }

  async function logout(all = false) {
    await fetch(all ? '/api/auth/logout-all' : '/api/auth/logout', { method: 'POST' })
    setCurrentUser(null)
    window.location.assign('/login')
  }

  async function refreshMe() {
    const response = await fetch('/api/auth/me')
    if (!response.ok) return null
    const payload = await response.json()
    setCurrentUser(payload.user)
    return payload.user
  }

  const value = useMemo(
    () => ({ currentUser, login, logout, refreshMe, setCurrentUser }),
    [currentUser],
  )

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession() {
  return useContext(SessionContext)
}
