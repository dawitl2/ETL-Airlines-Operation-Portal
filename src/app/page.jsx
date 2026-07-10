import { redirect } from 'next/navigation'
import { getCurrentSession } from '../server/auth'
import { ROLE_LANDING } from '../server/constants'

export default async function HomePage() {
  const auth = await getCurrentSession()
  if (!auth) redirect('/login')
  redirect(ROLE_LANDING[auth.role.code] || '/login')
}
