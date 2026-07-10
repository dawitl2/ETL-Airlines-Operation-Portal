'use client'

export function Modal({ children, onClose, title }) {
  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal" role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal-title">
          <h2>{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close dialog">
            Close
          </button>
        </div>
        {children}
      </section>
    </div>
  )
}
