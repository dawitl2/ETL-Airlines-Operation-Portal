import { SharedAppShell } from '../../layouts/SharedAppShell'
import { safeUserPayload } from '../../server/api'
import { requireRolePage } from '../../server/auth'

export default async function OperationsRouteLayout({ children }) {
  const auth = await requireRolePage('OPERATIONS_MANAGER')
  return (
    <SharedAppShell
      currentUser={safeUserPayload(auth.user, auth.role, auth.permissions)}
      role="operations"
    >
      {children}
    </SharedAppShell>
  )
}
