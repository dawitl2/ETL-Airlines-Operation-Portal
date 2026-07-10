export function MetricCard({ detail, icon: Icon, label, value, tone = 'neutral' }) {
  return (
    <article className={`metric-card ${tone}`}>
      <div className="metric-icon">{Icon && <Icon size={20} />}</div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{detail}</small>
      </div>
    </article>
  )
}
