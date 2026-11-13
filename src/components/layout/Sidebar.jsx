import { NavLink } from 'react-router-dom'

const principal = [{ to: '/', label: 'Dashboard', icon: 'bi-grid-1x2-fill', end: true }]

const catalogos = [
  { to: '/generos', label: 'Géneros', icon: 'bi-tags' },
  { to: '/directores', label: 'Directores', icon: 'bi-person-video2' },
  { to: '/productoras', label: 'Productoras', icon: 'bi-building' },
  { to: '/tipos', label: 'Tipos', icon: 'bi-collection-play' },
]

const contenido = [{ to: '/medias', label: 'Películas y series', icon: 'bi-film' }]

function Enlace({ enlace, onNavigate }) {
  return (
    <li className="nav-item">
      <NavLink
        to={enlace.to}
        end={enlace.end}
        onClick={onNavigate}
        className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
      >
        <i className={`bi ${enlace.icon}`} aria-hidden="true"></i>
        <span>{enlace.label}</span>
      </NavLink>
    </li>
  )
}

function Sidebar({ onNavigate }) {
  return (
    <aside className="app-sidebar" aria-label="Navegación lateral">
      <NavLink to="/" className="brand" onClick={onNavigate}>
        <span className="brand-mark" aria-hidden="true">
          <i className="bi bi-film"></i>
        </span>
        <span className="brand-text">
          <strong>IUDA</strong>
          <small>Películas y series</small>
        </span>
      </NavLink>

      <nav className="sidebar-nav" aria-label="Secciones de la aplicación">
        <p className="sidebar-label">Panel</p>
        <ul className="nav flex-column">
          {principal.map((enlace) => (
            <Enlace key={enlace.to} enlace={enlace} onNavigate={onNavigate} />
          ))}
        </ul>

        <p className="sidebar-label">Catálogos</p>
        <ul className="nav flex-column">
          {catalogos.map((enlace) => (
            <Enlace key={enlace.to} enlace={enlace} onNavigate={onNavigate} />
          ))}
        </ul>

        <p className="sidebar-label">Contenido</p>
        <ul className="nav flex-column">
          {contenido.map((enlace) => (
            <Enlace key={enlace.to} enlace={enlace} onNavigate={onNavigate} />
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <span className="sidebar-footer-icon" aria-hidden="true">
          <i className="bi bi-mortarboard"></i>
        </span>
        <div>
          <strong>IU Digital de Antioquia</strong>
          <span>Ingeniería Web II</span>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
