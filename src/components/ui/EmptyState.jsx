function EmptyState({ icon = 'bi-inbox', title, message, action }) {
  return (
    <div className="empty-state">
      <span className="empty-icon" aria-hidden="true">
        <i className={`bi ${icon}`}></i>
      </span>
      <h3 className="h5 mt-3 mb-1">{title}</h3>
      <p className="text-secondary mb-3">{message}</p>
      {action}
    </div>
  )
}

export default EmptyState
