import { useMemo, useState } from 'react'
import useCatalogo from '../../hooks/useCatalogo'
import {
  confirmarEliminacion,
  mostrarErrorApi,
  toastSuccess,
} from '../../utils/alerts'
import CatalogoForm from './CatalogoForm'
import CatalogoTable from './CatalogoTable'
import EmptyState from '../ui/EmptyState'
import ErrorState from '../ui/ErrorState'
import PageHeader from '../ui/PageHeader'

function nombreRegistro(item) {
  return item?.nombre ?? item?.nombres ?? 'este registro'
}

function CatalogoPage({ config }) {
  const { items, loading, error, recargar } = useCatalogo(config.service)
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [formularioAbierto, setFormularioAbierto] = useState(false)
  const [registroEditando, setRegistroEditando] = useState(null)

  const filtrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase()

    return items.filter((item) => {
      const coincideEstado =
        !config.hasEstado || !filtroEstado || item.estado === filtroEstado
      const coincideTexto =
        !termino ||
        config.searchKeys.some((clave) =>
          String(item[clave] ?? '').toLowerCase().includes(termino)
        )

      return coincideEstado && coincideTexto
    })
  }, [items, busqueda, filtroEstado, config])

  const hayFiltros = Boolean(busqueda.trim() || (config.hasEstado && filtroEstado))

  const abrirCrear = () => {
    setRegistroEditando(null)
    setFormularioAbierto(true)
  }

  const abrirEditar = (item) => {
    setRegistroEditando(item)
    setFormularioAbierto(true)
  }

  const cerrarFormulario = () => {
    if (!registroEditando && !formularioAbierto) return
    setFormularioAbierto(false)
    setRegistroEditando(null)
  }

  const guardado = () => {
    setFormularioAbierto(false)
    setRegistroEditando(null)
    recargar()
  }

  const eliminar = async (item) => {
    const confirmado = await confirmarEliminacion({
      titulo: `¿Eliminar ${config.resource}?`,
      texto: `Se eliminará "${nombreRegistro(item)}". Esta acción no se puede deshacer.`,
    })

    if (!confirmado) return

    try {
      await config.service.eliminar(item._id)
      toastSuccess(`El ${config.resource} se eliminó correctamente`)
      recargar()
    } catch (error) {
      mostrarErrorApi(error, `No se pudo eliminar el ${config.resource}`)
    }
  }

  const limpiarFiltros = () => {
    setBusqueda('')
    setFiltroEstado('')
  }

  return (
    <>
      <PageHeader
        icon={config.icon}
        title={config.title}
        description={config.description}
        count={loading ? undefined : items.length}
        actions={
          <button type="button" className="btn btn-accent" onClick={abrirCrear}>
            <i className="bi bi-plus-lg me-2" aria-hidden="true"></i>
            Nuevo {config.resource}
          </button>
        }
      />

      <section className="panel" aria-label={`Gestión de ${config.resourcePlural}`}>
        <div className="toolbar">
          <div className="search-box">
            <i className="bi bi-search" aria-hidden="true"></i>
            <input
              type="search"
              className="form-control"
              placeholder={config.searchPlaceholder}
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
              aria-label={`Buscar ${config.resourcePlural}`}
            />
            {busqueda && (
              <button
                type="button"
                className="search-clear"
                aria-label="Limpiar búsqueda"
                onClick={() => setBusqueda('')}
              >
                <i className="bi bi-x-lg" aria-hidden="true"></i>
              </button>
            )}
          </div>

          {config.hasEstado && (
            <select
              className="form-select toolbar-select"
              value={filtroEstado}
              onChange={(event) => setFiltroEstado(event.target.value)}
              aria-label="Filtrar por estado"
            >
              <option value="">Todos los estados</option>
              <option value="Activo">Activos</option>
              <option value="Inactivo">Inactivos</option>
            </select>
          )}

          <button
            type="button"
            className="btn btn-ghost"
            onClick={limpiarFiltros}
            disabled={!hayFiltros}
          >
            <i className="bi bi-arrow-counterclockwise me-2" aria-hidden="true"></i>
            Limpiar
          </button>

          {!loading && !error && (
            <span className="toolbar-count ms-auto" aria-live="polite">
              {filtrados.length} de {items.length} registros
            </span>
          )}
        </div>

        {error ? (
          <ErrorState message={error} onRetry={recargar} />
        ) : !loading && filtrados.length === 0 ? (
          <EmptyState
            icon={hayFiltros ? 'bi-search' : config.icon}
            title={hayFiltros ? 'No se encontraron resultados' : config.emptyTitle}
            message={
              hayFiltros
                ? 'Prueba con otro término de búsqueda o limpia los filtros.'
                : config.emptyMessage
            }
            action={
              hayFiltros ? (
                <button type="button" className="btn btn-ghost" onClick={limpiarFiltros}>
                  Limpiar filtros
                </button>
              ) : (
                <button type="button" className="btn btn-accent" onClick={abrirCrear}>
                  <i className="bi bi-plus-lg me-2" aria-hidden="true"></i>
                  Crear {config.resource}
                </button>
              )
            }
          />
        ) : (
          <CatalogoTable
            config={config}
            items={filtrados}
            loading={loading}
            onEdit={abrirEditar}
            onDelete={eliminar}
          />
        )}
      </section>

      {formularioAbierto && (
        <CatalogoForm
          key={registroEditando?._id ?? 'nuevo'}
          config={config}
          item={registroEditando}
          onClose={cerrarFormulario}
          onSaved={guardado}
        />
      )}
    </>
  )
}

export default CatalogoPage
