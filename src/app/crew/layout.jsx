import { SharedAppShell } from '../../layouts/SharedAppShell'
import { safeUserPayload } from '../../server/api'
import { requireRolePage } from '../../server/auth'

export default async function CrewRouteLayout({ children }) {
  const auth = await requireRolePage('FLIGHT_CREW')
  return (
    <SharedAppShell
      currentUser={safeUserPayload(auth.user, auth.role, auth.permissions)}
      role="crew"
    >
      {children}
    </SharedAppShell>
  )
}
