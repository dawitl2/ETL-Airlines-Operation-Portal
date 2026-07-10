import { SupervisorPage } from '../../../views/supervisor/SupervisorPage'

export default async function SupervisorSection({ params }) {
  const { section } = await params
  return <SupervisorPage section={section} />
}
