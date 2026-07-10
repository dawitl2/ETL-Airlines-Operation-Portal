import { createContext, useContext, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { employees, routeByRole } from '../data/employees'
import { readStorage, removeStorage, writeStorage } from '../utils/storage'

const SessionContext = createContext(null)

export function SessionProvider({ children }) {
  const navigate = useNavigate()
  const [session, setSession] = useState(() => readStorage('session', null))

  function login(employee) {
    const nextSession = {
      employeeId: employee.id,
      role: employee.role,
      startedAt: new Date().toISOString(),
    }
    setSession(nextSession)
    writeStorage('session', nextSession)
    navigate(routeByRole[employee.role], { replace: true })
  }

  function logout() {
    setSession(null)
    removeStorage('session')
    navigate('/login', { replace: true })
  }

  const currentUser = employees.find((employee) => employee.id === session?.employeeId) || null

  const value = useMemo(
    () => ({ currentUser, login, logout, session }),
    [currentUser, session],
  )

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession() {
  return useContext(SessionContext)
}
