import { SharedAppShell } from '../../layouts/SharedAppShell'
import { safeUserPayload } from '../../server/api'
import { requireRolePage } from '../../server/auth'

export default async function MaintenanceRouteLayout({ children }) {
  const auth = await requireRolePage('MAINTENANCE_TECHNICIAN')
  return (
    <SharedAppShell
      currentUser={safeUserPayload(auth.user, auth.role, auth.permissions)}
      role="maintenance"
    >
      {children}
    </SharedAppShell>
  )
}
