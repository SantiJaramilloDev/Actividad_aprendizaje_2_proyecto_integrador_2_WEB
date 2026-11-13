import { Link, useLocation } from 'react-router-dom'
import useApiHealth from '../../hooks/useApiHealth'

const titulos = {
  '/': 'Dashboard',
  '/generos': 'Géneros',
  '/directores': 'Directores',
  '/productoras': 'Productoras',
  '/tipos': 'Tipos',
  '/medias': 'Películas y series',
}

function Topbar({ onToggleMenu }) {
  const { pathname } = useLocation()
  const { status, message } = useApiHealth()
  const titulo = titulos[pathname] ?? 'Panel administrativo'

  const etiquetaEstado =
    status === 'ok' ? 'API conectada' : status === 'error' ? 'API sin conexión' : 'Verificando API'

  return (
    <header className="app-topbar">
      <div className="topbar-left">
        <button
          type="button"
          className="btn btn-icon topbar-menu"
          onClick={onToggleMenu}
          aria-label="Abrir menú de navegación"
        >
          <i className="bi bi-list" aria-hidden="true"></i>
        </button>
        <div>
          <p className="topbar-kicker mb-0">Administración</p>
          <h2 className="topbar-title mb-0">{titulo}</h2>
        </div>
      </div>

      <div className="topbar-right">
        <span
          className={`api-pill api-pill-${status}`}
          title={message}
          aria-label={`Estado de la API: ${etiquetaEstado}`}
        >
          <span className="api-dot" aria-hidden="true"></span>
          <span className="api-pill-text">{etiquetaEstado}</span>
        </span>

        <Link to="/medias" className="btn btn-accent topbar-cta">
          <i className="bi bi-plus-lg me-2" aria-hidden="true"></i>
          <span className="topbar-cta-text">Nueva producción</span>
        </Link>
      </div>
    </header>
  )
}

export default Topbar
