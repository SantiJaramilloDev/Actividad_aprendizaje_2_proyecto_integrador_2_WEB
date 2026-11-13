function StatusBadge({ estado = 'Inactivo' }) {
  const activo = estado === 'Activo'

  return (
    <span className={`status-badge ${activo ? 'status-active' : 'status-inactive'}`}>
      <span className="status-dot" aria-hidden="true"></span>
      {estado}
    </span>
  )
}

export default StatusBadge
