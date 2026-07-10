import Link from 'next/link'

export default function ForbiddenPage() {
  return (
    <main className="access-page single">
      <section className="access-panel">
        <p className="eyebrow">403</p>
        <h1>Access denied</h1>
        <p>You do not have permission to open this workspace.</p>
        <Link className="action-button primary" href="/">
          Return to workspace
        </Link>
      </section>
    </main>
  )
}
