export function ActionButton({ children, tone = 'primary', ...props }) {
  return (
    <button className={`action-button ${tone}`} type="button" {...props}>
      {children}
    </button>
  )
}
