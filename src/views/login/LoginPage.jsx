'use client'

import { useState } from 'react'
import { Eye, EyeOff, Moon, Sun } from 'lucide-react'
import { appName } from '../../app/roleConfig'
import { SessionProvider, useSession } from '../../context/SessionContext'
import { useTheme } from '../../context/ThemeContext'

const landingByRole = {
  SYSTEM_ADMIN: '/admin/dashboard',
  OPERATIONS_MANAGER: '/operations/command-center',
  CREW_SCHEDULER: '/scheduler/roster',
  SUPERVISOR: '/supervisor/approvals',
  FLIGHT_CREW: '/crew/dashboard',
  MAINTENANCE_TECHNICIAN: '/maintenance/dashboard',
}

export function LoginPage() {
  return (
    <SessionProvider>
      <LoginForm />
    </SessionProvider>
  )
}

function LoginForm() {
  const { login } = useSession()
  const { theme, toggleTheme } = useTheme()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login({ email, password, remember })
      window.location.assign(landingByRole[user.role.code] || '/')
    } catch (caught) {
      setError(caught.message || 'Unable to sign in with the provided credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="access-page">
      <section className="access-intro">
        <div className="brand-lockup">
          <div className="brand-mark">ETL</div>
          <div>
            <strong>{appName}</strong>
            <span>Secure employee access</span>
          </div>
        </div>
        <div>
          <p className="eyebrow">Authenticated portal</p>
          <h1>{appName}</h1>
          <p>
            Sign in with your ETL Airlines employee account. Access is determined by
            server-side roles, permissions, JWT cookies, and active session state.
          </p>
        </div>
        <div className="access-notes">
          <div><strong>JWT</strong><span>HttpOnly cookies</span></div>
          <div><strong>RBAC</strong><span>Permission checked</span></div>
          <div><strong>MongoDB</strong><span>Server session store</span></div>
        </div>
      </section>

      <section className="access-panel login-card">
        <div className="access-header">
          <div>
            <p className="eyebrow">Sign in</p>
            <h2>Employee login</h2>
          </div>
          <button className="icon-tool" type="button" onClick={toggleTheme} title="Toggle theme">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              autoComplete="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="employee@etl.example"
              required
            />
          </label>

          <label>
            Password
            <div className="password-field">
              <input
                autoComplete="current-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                required
              />
              <button type="button" onClick={() => setShowPassword((value) => !value)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>

          <div className="login-options">
            <label>
              <input
                checked={remember}
                type="checkbox"
                onChange={(event) => setRemember(event.target.checked)}
              />
              Remember this device
            </label>
            <a href="#forgot-password">Forgot password?</a>
          </div>

          {error && <div className="error-banner">{error}</div>}

          <button className="action-button primary" disabled={loading} type="submit">
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="seed-hint">
          Development seed password: <strong>ChangeMe123!</strong>
        </div>
      </section>
    </main>
  )
}
