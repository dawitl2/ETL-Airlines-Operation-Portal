import { SharedAppShell } from '../../layouts/SharedAppShell'
import { safeUserPayload } from '../../server/api'
import { requireRolePage } from '../../server/auth'

export default async function AdminRouteLayout({ children }) {
  const auth = await requireRolePage('SYSTEM_ADMIN')
  return (
    <SharedAppShell
      currentUser={safeUserPayload(auth.user, auth.role, auth.permissions)}
      role="admin"
    >
      {children}
    </SharedAppShell>
  )
}
