import { redirect } from 'next/navigation'
import { LoginPage } from '../../views/login/LoginPage'
import { getCurrentSession } from '../../server/auth'
import { ROLE_LANDING } from '../../server/constants'

export default async function LoginRoute() {
  const auth = await getCurrentSession()
  if (auth) redirect(ROLE_LANDING[auth.role.code] || '/')
  return <LoginPage />
}
