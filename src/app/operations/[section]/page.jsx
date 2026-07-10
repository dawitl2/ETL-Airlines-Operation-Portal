import { OperationsPage } from '../../../views/operations/OperationsPage'

export default async function OperationsSection({ params }) {
  const { section } = await params
  return <OperationsPage section={section} />
}
