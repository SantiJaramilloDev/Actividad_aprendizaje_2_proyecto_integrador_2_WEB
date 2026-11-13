function PageHeader({ icon, title, description, count, actions }) {
  return (
    <header className="page-header">
      <div className="page-header-main">
        <span className="page-icon" aria-hidden="true">
          <i className={`bi ${icon}`}></i>
        </span>
        <div>
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <h1 className="h3 mb-0">{title}</h1>
            {count !== undefined && (
              <span className="count-badge" aria-label={`${count} registros`}>
                {count}
              </span>
            )}
          </div>
          <p className="text-secondary mb-0 mt-1">{description}</p>
        </div>
      </div>
      {actions && <div className="page-header-actions">{actions}</div>}
    </header>
  )
}

export default PageHeader
