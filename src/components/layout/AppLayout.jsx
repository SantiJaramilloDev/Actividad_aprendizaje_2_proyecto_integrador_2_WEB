import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

function AppLayout() {
  const [menuAbierto, setMenuAbierto] = useState(false)

  useEffect(() => {
    if (!menuAbierto) return undefined

    const cerrarConEscape = (event) => {
      if (event.key === 'Escape') setMenuAbierto(false)
    }

    document.addEventListener('keydown', cerrarConEscape)
    return () => document.removeEventListener('keydown', cerrarConEscape)
  }, [menuAbierto])

  return (
    <>
      <a href="#contenido" className="skip-link">
        Saltar al contenido principal
      </a>

      <div className={`app-shell${menuAbierto ? ' menu-open' : ''}`}>
        <Sidebar onNavigate={() => setMenuAbierto(false)} />

        {menuAbierto && (
          <button
            type="button"
            className="sidebar-backdrop"
            aria-label="Cerrar menú de navegación"
            onClick={() => setMenuAbierto(false)}
          ></button>
        )}

        <div className="app-main">
          <Topbar onToggleMenu={() => setMenuAbierto((valor) => !valor)} />

          <main id="contenido" className="app-content" tabIndex={-1}>
            <Outlet />
          </main>

          <footer className="app-footer">
            <span>IU Digital de Antioquia · Gestión de películas y series</span>
            <span>Evidencia de Aprendizaje 2 · ReactJS</span>
          </footer>
        </div>
      </div>
    </>
  )
}

export default AppLayout
