import { MaintenancePage } from '../../../views/technician/MaintenancePage'

export default async function MaintenanceSection({ params }) {
  const { section } = await params
  return <MaintenancePage section={section} />
}
