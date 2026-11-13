import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import MediaFilters from '../components/media/MediaFilters'
import MediaForm from '../components/media/MediaForm'
import MediaPreview from '../components/media/MediaPreview'
import MediaTable from '../components/media/MediaTable'
import EmptyState from '../components/ui/EmptyState'
import ErrorState from '../components/ui/ErrorState'
import PageHeader from '../components/ui/PageHeader'
import useDebouncedValue from '../hooks/useDebouncedValue'
import useMedias from '../hooks/useMedias'
import useReferencias from '../hooks/useReferencias'
import mediaService from '../services/mediaService'
import {
  confirmarEliminacion,
  mostrarErrorApi,
  toastSuccess,
} from '../utils/alerts'

function MediasPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filtros, setFiltros] = useState(() => ({
    titulo: searchParams.get('titulo') ?? '',
    genero: searchParams.get('genero') ?? '',
    tipo: searchParams.get('tipo') ?? '',
  }))
  const [formAbierto, setFormAbierto] = useState(false)
  const [mediaEditando, setMediaEditando] = useState(null)
  const [mediaPreview, setMediaPreview] = useState(null)

  const tituloDiferido = useDebouncedValue(filtros.titulo, 350)
  const consulta = useMemo(
    () => ({
      titulo: tituloDiferido,
      genero: filtros.genero,
      tipo: filtros.tipo,
    }),
    [tituloDiferido, filtros.genero, filtros.tipo]
  )

  const { items, loading, error, recargar } = useMedias(consulta)
  const {
    referencias,
    loading: cargandoReferencias,
    error: errorReferencias,
    recargar: recargarReferencias,
  } = useReferencias()

  useEffect(() => {
    const params = new URLSearchParams()
    if (filtros.titulo) params.set('titulo', filtros.titulo)
    if (filtros.genero) params.set('genero', filtros.genero)
    if (filtros.tipo) params.set('tipo', filtros.tipo)
    setSearchParams(params, { replace: true })
  }, [filtros, setSearchParams])

  const hayFiltros = Boolean(filtros.titulo || filtros.genero || filtros.tipo)
  const referenciasListas = !cargandoReferencias && !errorReferencias

  const cambiarFiltro = (nombre, valor) => {
    setFiltros((actual) => ({ ...actual, [nombre]: valor }))
  }

  const limpiarFiltros = () => {
    setFiltros({ titulo: '', genero: '', tipo: '' })
  }

  const abrirCrear = () => {
    setMediaEditando(null)
    setFormAbierto(true)
  }

  const abrirEditar = (media) => {
    setMediaEditando(media)
    setFormAbierto(true)
  }

  const cerrarFormulario = () => {
    setFormAbierto(false)
    setMediaEditando(null)
  }

  const guardado = () => {
    cerrarFormulario()
    recargar()
  }

  const eliminar = async (media) => {
    const confirmado = await confirmarEliminacion({
      titulo: '¿Eliminar producción?',
      texto: `Se eliminará "${media.titulo}". Esta acción no se puede deshacer.`,
    })

    if (!confirmado) return

    try {
      await mediaService.eliminar(media._id)
      toastSuccess('La producción se eliminó correctamente')
      recargar()
    } catch (err) {
      mostrarErrorApi(err, 'No se pudo eliminar la producción')
    }
  }

  return (
    <>
      <PageHeader
        icon="bi-film"
        title="Películas y series"
        description="Gestiona el catálogo completo de producciones."
        count={loading ? undefined : items.length}
        actions={
          <button
            type="button"
            className="btn btn-accent"
            onClick={abrirCrear}
            disabled={!referenciasListas}
            title={
              referenciasListas
                ? undefined
                : 'Espera a que se carguen los catálogos de referencia'
            }
          >
            <i className="bi bi-plus-lg me-2" aria-hidden="true"></i>
            Nueva producción
          </button>
        }
      />

      {errorReferencias && (
        <div className="app-alert app-alert-warning" role="alert">
          <i className="bi bi-exclamation-triangle-fill" aria-hidden="true"></i>
          <div className="flex-grow-1">
            <strong>No se pudieron cargar los catálogos de referencia.</strong>
            <span className="d-block small">{errorReferencias}</span>
          </div>
          <button type="button" className="btn btn-ghost btn-sm" onClick={recargarReferencias}>
            Reintentar
          </button>
        </div>
      )}

      <section className="panel" aria-label="Gestión de películas y series">
        <MediaFilters
          filtros={filtros}
          onChange={cambiarFiltro}
          onClear={limpiarFiltros}
          referencias={referencias}
          resultados={items.length}
          cargandoReferencias={cargandoReferencias}
        />

        {error ? (
          <ErrorState message={error} onRetry={recargar} />
        ) : !loading && items.length === 0 ? (
          <EmptyState
            icon={hayFiltros ? 'bi-search' : 'bi-film'}
            title={
              hayFiltros
                ? 'No se encontraron producciones'
                : 'Aún no hay producciones'
            }
            message={
              hayFiltros
                ? 'Prueba con otro título, género o tipo, o limpia los filtros.'
                : 'Registra la primera película o serie del catálogo.'
            }
            action={
              hayFiltros ? (
                <button type="button" className="btn btn-ghost" onClick={limpiarFiltros}>
                  Limpiar filtros
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-accent"
                  onClick={abrirCrear}
                  disabled={!referenciasListas}
                >
                  <i className="bi bi-plus-lg me-2" aria-hidden="true"></i>
                  Nueva producción
                </button>
              )
            }
          />
        ) : (
          <MediaTable
            items={items}
            loading={loading}
            onPreview={setMediaPreview}
            onEdit={abrirEditar}
            onDelete={eliminar}
            editingDisabled={!referenciasListas}
          />
        )}
      </section>

      {formAbierto && referenciasListas && (
        <MediaForm
          key={mediaEditando?._id ?? 'nueva'}
          media={mediaEditando}
          referencias={referencias}
          onClose={cerrarFormulario}
          onSaved={guardado}
        />
      )}

      {mediaPreview && (
        <MediaPreview media={mediaPreview} onClose={() => setMediaPreview(null)} />
      )}
    </>
  )
}

export default MediasPage
