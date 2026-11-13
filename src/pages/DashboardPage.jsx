import { Link } from 'react-router-dom'
import PosterThumb from '../components/media/PosterThumb'
import ErrorState from '../components/ui/ErrorState'
import useApiHealth from '../hooks/useApiHealth'
import useDashboard from '../hooks/useDashboard'
import { formatFechaHora } from '../utils/format'

const tarjetas = [
  { key: 'generos', label: 'Géneros', icon: 'bi-tags', path: '/generos', conEstado: true },
  {
    key: 'directores',
    label: 'Directores',
    icon: 'bi-person-video2',
    path: '/directores',
    conEstado: true,
  },
  {
    key: 'productoras',
    label: 'Productoras',
    icon: 'bi-building',
    path: '/productoras',
    conEstado: true,
  },
  { key: 'tipos', label: 'Tipos', icon: 'bi-collection-play', path: '/tipos', conEstado: false },
  { key: 'medias', label: 'Producciones', icon: 'bi-film', path: '/medias', conEstado: false },
]

function DashboardPage() {
  const { data, loading, error, recargar } = useDashboard()
  const { status, message, checkedAt, verificar } = useApiHealth()

  const totalMedias = data.medias.length
  const recientes = data.medias.slice(0, 5)
  const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1'
  const etiquetaEstado =
    status === 'ok' ? 'Conectada' : status === 'error' ? 'Sin conexión' : 'Verificando'

  return (
    <>
      <section className="dashboard-hero">
        <div className="dashboard-hero-content">
          <span className="eyebrow">Panel administrativo</span>
          <h1 className="dashboard-title">Tu catálogo, en un solo lugar</h1>
          <p className="dashboard-subtitle">
            Administra géneros, directores, productoras, tipos y producciones de la
            plataforma de entretenimiento de la IU Digital de Antioquia.
          </p>
          <div className="d-flex flex-wrap gap-2 mt-4">
            <Link to="/medias" className="btn btn-accent">
              <i className="bi bi-plus-lg me-2" aria-hidden="true"></i>
              Nueva producción
            </Link>
            <Link to="/generos" className="btn btn-ghost">
              Gestionar catálogos
            </Link>
          </div>
        </div>
        <div
          className="dashboard-hero-stat"
          aria-label={`${totalMedias} ${
            totalMedias === 1 ? 'producción registrada' : 'producciones registradas'
          }`}
        >
          <i className="bi bi-film" aria-hidden="true"></i>
          <strong>{loading ? '—' : totalMedias}</strong>
          <span>
            {totalMedias === 1 ? 'producción registrada' : 'producciones registradas'}
          </span>
        </div>
      </section>

      {error ? (
        <div className="panel mt-4">
          <ErrorState
            message={error}
            onRetry={recargar}
            title="No se pudieron cargar los indicadores"
          />
        </div>
      ) : (
        <section className="kpi-grid mt-4" aria-label="Indicadores por módulo">
          {tarjetas.map((tarjeta) => {
            const registros = data[tarjeta.key] ?? []
            const activos = tarjeta.conEstado
              ? registros.filter((registro) => registro.estado === 'Activo').length
              : null

            return (
              <Link className="kpi-card" to={tarjeta.path} key={tarjeta.key}>
                <span className="kpi-icon" aria-hidden="true">
                  <i className={`bi ${tarjeta.icon}`}></i>
                </span>
                <span className="kpi-label">{tarjeta.label}</span>
                <strong className="kpi-value">
                  {loading ? <span className="skeleton skeleton-number"></span> : registros.length}
                </strong>
                <span className="kpi-meta">
                  {tarjeta.conEstado
                    ? loading
                      ? 'Cargando…'
                      : `${activos} ${activos === 1 ? 'activo' : 'activos'}`
                    : 'Ver catálogo'}
                  <i className="bi bi-arrow-right" aria-hidden="true"></i>
                </span>
              </Link>
            )
          })}
        </section>
      )}

      <div className="row g-4 mt-1">
        <div className="col-12 col-xl-8">
          <section className="panel h-100" aria-labelledby="recientes-title">
            <div className="panel-header">
              <div>
                <h2 className="h5 mb-1" id="recientes-title">
                  Últimas producciones
                </h2>
                <p className="text-secondary small mb-0">
                  Las incorporaciones más recientes al catálogo.
                </p>
              </div>
              <Link to="/medias" className="btn btn-ghost btn-sm">
                Ver todas
                <i className="bi bi-arrow-right ms-2" aria-hidden="true"></i>
              </Link>
            </div>

            {loading ? (
              <div className="recent-list">
                {Array.from({ length: 4 }).map((_, indice) => (
                  <div className="recent-item" key={indice} aria-hidden="true">
                    <span className="skeleton skeleton-poster"></span>
                    <div className="flex-grow-1">
                      <span className="skeleton skeleton-line skeleton-w-2 d-block mb-2"></span>
                      <span className="skeleton skeleton-line skeleton-w-1 d-block"></span>
                    </div>
                  </div>
                ))}
              </div>
            ) : recientes.length === 0 ? (
              <div className="empty-inline">
                <i className="bi bi-film" aria-hidden="true"></i>
                <p className="mb-2">Todavía no hay producciones registradas.</p>
                <Link to="/medias" className="btn btn-accent btn-sm">
                  Registrar la primera
                </Link>
              </div>
            ) : (
              <ul className="recent-list">
                {recientes.map((media) => (
                  <li className="recent-item" key={media._id}>
                    <PosterThumb src={media.imagenPortada} title={media.titulo} />
                    <div className="flex-grow-1 min-w-0">
                      <span className="recent-title">{media.titulo}</span>
                      <span className="recent-meta">
                        {media.serial} · {media.anioEstreno} · {media.tipo?.nombre ?? 'Sin tipo'}
                      </span>
                    </div>
                    <span className="chip d-none d-sm-inline-flex">
                      {media.genero?.nombre ?? 'Sin género'}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <div className="col-12 col-xl-4">
          <section className="panel h-100" aria-labelledby="sistema-title">
            <div className="panel-header">
              <div>
                <h2 className="h5 mb-1" id="sistema-title">
                  Estado del sistema
                </h2>
                <p className="text-secondary small mb-0">Conexión con la API REST.</p>
              </div>
              <button
                type="button"
                className="btn btn-icon"
                onClick={verificar}
                aria-label="Volver a verificar la conexión"
                title="Verificar de nuevo"
              >
                <i className="bi bi-arrow-clockwise" aria-hidden="true"></i>
              </button>
            </div>

            <div className={`api-status api-status-${status}`}>
              <span className="api-dot" aria-hidden="true"></span>
              <div>
                <strong>{etiquetaEstado}</strong>
                <span>{message}</span>
              </div>
            </div>

            <dl className="system-list mb-0">
              <div>
                <dt>URL de la API</dt>
                <dd className="mono">{apiUrl}</dd>
              </div>
              <div>
                <dt>Última verificación</dt>
                <dd>{checkedAt ? formatFechaHora(checkedAt) : 'Pendiente'}</dd>
              </div>
              <div>
                <dt>Base de datos</dt>
                <dd>MongoDB</dd>
              </div>
            </dl>

            <a
              className="btn btn-ghost w-100 mt-3"
              href={apiUrl.replace('/api/v1', '/api/v1/health')}
              target="_blank"
              rel="noreferrer"
            >
              <i className="bi bi-box-arrow-up-right me-2" aria-hidden="true"></i>
              Abrir estado de la API
            </a>
          </section>
        </div>
      </div>
    </>
  )
}

export default DashboardPage
