export function StatusBadge({ status }) {
  const key = String(status || 'Unknown').toLowerCase().replaceAll(' ', '-')
  return <span className={`status-badge ${key}`}>{status}</span>
}
