import { useMemo, useState } from 'react'
import { Moon, Search, Sun } from 'lucide-react'
import { appName } from '../../app/roleConfig'
import { employees, roleLabels } from '../../data/employees'
import { useSession } from '../../context/SessionContext'
import { useTheme } from '../../context/ThemeContext'
import { StatusBadge } from '../../components/common/StatusBadge'

const roleOrder = ['admin', 'operations', 'scheduler', 'supervisor', 'crew', 'maintenance']

export function LoginPage() {
  const [selectedRole, setSelectedRole] = useState('operations')
  const [query, setQuery] = useState('')
  const { login } = useSession()
  const { theme, toggleTheme } = useTheme()

  const roleEmployees = useMemo(() => {
    const value = query.toLowerCase()
    return employees
      .filter((employee) => employee.role === selectedRole)
      .filter((employee) =>
        `${employee.name} ${employee.position} ${employee.department} ${employee.base} ${employee.status}`
          .toLowerCase()
          .includes(value),
      )
  }, [query, selectedRole])

  return (
    <main className="access-page">
      <section className="access-intro">
        <div className="brand-lockup">
          <div className="brand-mark">ETL</div>
          <div>
            <strong>{appName}</strong>
            <span>Employee access portal</span>
          </div>
        </div>
        <div>
          <p className="eyebrow">Phase 1 frontend</p>
          <h1>{appName}</h1>
          <p>
            Select a professional role and employee profile to enter the matching
            operations workspace. This phase uses realistic local mock data only.
          </p>
        </div>
        <div className="access-notes">
          <div>
            <strong>6</strong>
            <span>Role applications</span>
          </div>
          <div>
            <strong>{employees.length}</strong>
            <span>Mock employees</span>
          </div>
          <div>
            <strong>0</strong>
            <span>Passwords required</span>
          </div>
        </div>
      </section>

      <section className="access-panel">
        <div className="access-header">
          <div>
            <p className="eyebrow">Employee access</p>
            <h2>Select role and employee</h2>
          </div>
          <button className="icon-tool" type="button" onClick={toggleTheme} title="Toggle theme">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        <div className="access-steps" aria-label="Login steps">
          <span className="active">Select role</span>
          <span>Select employee</span>
          <span>Enter workspace</span>
        </div>

        <div className="role-access-grid">
          {roleOrder.map((role) => (
            <button
              className={selectedRole === role ? 'active' : ''}
              key={role}
              type="button"
              onClick={() => {
                setSelectedRole(role)
                setQuery('')
              }}
            >
              <strong>{roleLabels[role]}</strong>
              <span>{employees.filter((employee) => employee.role === role).length} employees</span>
            </button>
          ))}
        </div>

        <label className="search-field">
          <Search size={18} />
          <input
            value={query}
            placeholder="Search by name, position, department, base, or status"
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>

        <div className="employee-access-list">
          {roleEmployees.map((employee) => (
            <article className="employee-access-card" key={employee.id}>
              <div className="avatar">{employee.name.slice(0, 2).toUpperCase()}</div>
              <div>
                <strong>{employee.name}</strong>
                <span>{employee.position}</span>
                <small>
                  {employee.department} - {employee.base} base
                </small>
              </div>
              <StatusBadge status={employee.status} />
              <button type="button" onClick={() => login(employee)}>
                Enter workspace
              </button>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
