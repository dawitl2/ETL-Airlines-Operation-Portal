import { CrewPage } from '../../../views/flightCrew/CrewPage'

export default async function CrewSection({ params }) {
  const { section } = await params
  return <CrewPage section={section} />
}
