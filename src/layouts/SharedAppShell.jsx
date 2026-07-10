import { NavLink, Outlet } from 'react-router-dom'
import { Bell, HelpCircle, Moon, RotateCcw, Sun } from 'lucide-react'
import { appName, roleConfig } from '../app/roleConfig'
import { useMockData } from '../context/MockDataContext'
import { useSession } from '../context/SessionContext'
import { useTheme } from '../context/ThemeContext'

export function SharedAppShell({ role }) {
  const { currentUser, logout } = useSession()
  const { notifications, resetDemoData } = useMockData()
  const { theme, toggleTheme } = useTheme()
  const config = roleConfig[role]
  const unread = notifications.filter(
    (item) => item.audience.includes(role) && !item.read,
  ).length

  return (
    <div className={`portal-shell ${config.tone}`}>
      <aside className="app-sidebar">
        <div className="brand-lockup">
          <div className="brand-mark">ETL</div>
          <div>
            <strong>{appName}</strong>
            <span>{config.label}</span>
          </div>
        </div>

        <div className="account-card">
          <div className="avatar">{currentUser?.name?.slice(0, 2).toUpperCase()}</div>
          <div>
            <strong>{currentUser?.name}</strong>
            <span>{currentUser?.position}</span>
            <small>{currentUser?.base} base</small>
          </div>
        </div>

        <nav className="app-nav" aria-label={`${config.label} navigation`}>
          {config.nav.map(([label, path, Icon]) => (
            <NavLink key={path} to={path}>
              <Icon size={17} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="app-main">
        <header className="app-topbar">
          <div>
            <p className="eyebrow">{config.label}</p>
            <strong>{appName}</strong>
          </div>
          <div className="topbar-tools">
            <button type="button" title="Notifications">
              <Bell size={18} />
              {unread > 0 && <span>{unread}</span>}
            </button>
            <button type="button" title="Help">
              <HelpCircle size={18} />
            </button>
            <button type="button" title="Theme" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button type="button" title="Reset demo data" onClick={resetDemoData}>
              <RotateCcw size={18} />
            </button>
            <button className="switch-user" type="button" onClick={logout}>
              Switch user
            </button>
          </div>
        </header>
        <div className={`role-workspace ${role}`}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
