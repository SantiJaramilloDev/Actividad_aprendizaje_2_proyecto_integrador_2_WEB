function ErrorState({ message, onRetry, title = 'No se pudo cargar la información' }) {
  return (
    <div className="error-state" role="alert">
      <span className="empty-icon text-danger" aria-hidden="true">
        <i className="bi bi-wifi-off"></i>
      </span>
      <h3 className="h5 mt-3 mb-1">{title}</h3>
      <p className="text-secondary mb-3">{message}</p>
      {onRetry && (
        <button type="button" className="btn btn-accent" onClick={onRetry}>
          <i className="bi bi-arrow-clockwise me-2" aria-hidden="true"></i>
          Reintentar
        </button>
      )}
    </div>
  )
}

export default ErrorState
