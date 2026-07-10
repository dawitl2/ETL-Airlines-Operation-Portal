import { AdminPage } from '../../../views/admin/AdminPage'

export default async function AdminSection({ params }) {
  const { section } = await params
  return <AdminPage section={section} />
}
