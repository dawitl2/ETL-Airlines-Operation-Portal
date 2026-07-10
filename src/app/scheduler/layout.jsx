import { SharedAppShell } from '../../layouts/SharedAppShell'
import { safeUserPayload } from '../../server/api'
import { requireRolePage } from '../../server/auth'

export default async function SchedulerRouteLayout({ children }) {
  const auth = await requireRolePage('CREW_SCHEDULER')
  return (
    <SharedAppShell
      currentUser={safeUserPayload(auth.user, auth.role, auth.permissions)}
      role="scheduler"
    >
      {children}
    </SharedAppShell>
  )
}
