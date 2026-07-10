import { SchedulerPage } from '../../../views/scheduler/SchedulerPage'

export default async function SchedulerSection({ params }) {
  const { section } = await params
  return <SchedulerPage section={section} />
}
