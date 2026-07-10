import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AdminLayout } from '../layouts/AdminLayout'
import { FlightCrewLayout } from '../layouts/FlightCrewLayout'
import { OperationsLayout } from '../layouts/OperationsLayout'
import { SchedulerLayout } from '../layouts/SchedulerLayout'
import { SupervisorLayout } from '../layouts/SupervisorLayout'
import { TechnicianLayout } from '../layouts/TechnicianLayout'
import { AdminPage } from '../pages/admin/AdminPage'
import { CrewPage } from '../pages/flightCrew/CrewPage'
import { LoginPage } from '../pages/login/LoginPage'
import { MaintenancePage } from '../pages/technician/MaintenancePage'
import { OperationsPage } from '../pages/operations/OperationsPage'
import { SchedulerPage } from '../pages/scheduler/SchedulerPage'
import { SupervisorPage } from '../pages/supervisor/SupervisorPage'
import { MockDataProvider } from '../context/MockDataContext'
import { SessionProvider, useSession } from '../context/SessionContext'
import { ThemeProvider } from '../context/ThemeContext'
import './routes'

function RequireRole({ children, role }) {
  const { currentUser } = useSession()
  if (!currentUser) return <Navigate to="/login" replace />
  if (currentUser.role !== role) return <Navigate to="/login" replace />
  return children
}

function RootRedirect() {
  const { currentUser } = useSession()
  if (!currentUser) return <Navigate to="/login" replace />
  const landing = {
    admin: '/admin/dashboard',
    operations: '/operations/command-center',
    scheduler: '/scheduler/roster',
    supervisor: '/supervisor/approvals',
    crew: '/crew/dashboard',
    maintenance: '/maintenance/dashboard',
  }[currentUser.role]
  return <Navigate to={landing} replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/admin"
        element={
          <RequireRole role="admin">
            <AdminLayout />
          </RequireRole>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path=":section" element={<AdminPage />} />
      </Route>

      <Route
        path="/operations"
        element={
          <RequireRole role="operations">
            <OperationsLayout />
          </RequireRole>
        }
      >
        <Route index element={<Navigate to="/operations/command-center" replace />} />
        <Route path=":section" element={<OperationsPage />} />
      </Route>

      <Route
        path="/scheduler"
        element={
          <RequireRole role="scheduler">
            <SchedulerLayout />
          </RequireRole>
        }
      >
        <Route index element={<Navigate to="/scheduler/roster" replace />} />
        <Route path=":section" element={<SchedulerPage />} />
      </Route>

      <Route
        path="/supervisor"
        element={
          <RequireRole role="supervisor">
            <SupervisorLayout />
          </RequireRole>
        }
      >
        <Route index element={<Navigate to="/supervisor/approvals" replace />} />
        <Route path=":section" element={<SupervisorPage />} />
      </Route>

      <Route
        path="/crew"
        element={
          <RequireRole role="crew">
            <FlightCrewLayout />
          </RequireRole>
        }
      >
        <Route index element={<Navigate to="/crew/dashboard" replace />} />
        <Route path=":section" element={<CrewPage />} />
      </Route>

      <Route
        path="/maintenance"
        element={
          <RequireRole role="maintenance">
            <TechnicianLayout />
          </RequireRole>
        }
      >
        <Route index element={<Navigate to="/maintenance/dashboard" replace />} />
        <Route path=":section" element={<MaintenancePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <SessionProvider>
          <MockDataProvider>
            <AppRoutes />
          </MockDataProvider>
        </SessionProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
