import { SharedAppShell } from '../../layouts/SharedAppShell'
import { safeUserPayload } from '../../server/api'
import { requireRolePage } from '../../server/auth'

export default async function SupervisorRouteLayout({ children }) {
  const auth = await requireRolePage('SUPERVISOR')
  return (
    <SharedAppShell
      currentUser={safeUserPayload(auth.user, auth.role, auth.permissions)}
      role="supervisor"
    >
      {children}
    </SharedAppShell>
  )
}
