import TableSkeleton from '../ui/TableSkeleton'
import PosterThumb from './PosterThumb'

function MediaTable({ items, loading, onPreview, onEdit, onDelete, editingDisabled = false }) {
  return (
    <div className="table-responsive panel-table">
      <table className="table align-middle mb-0">
        <caption className="visually-hidden">Listado de películas y series</caption>
        <thead>
          <tr>
            <th scope="col">Producción</th>
            <th scope="col">Tipo</th>
            <th scope="col">Género</th>
            <th scope="col">Año</th>
            <th scope="col">Director</th>
            <th scope="col" className="text-end">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <TableSkeleton rows={6} columns={6} />
          ) : (
            items.map((media) => (
              <tr key={media._id}>
                <td>
                  <div className="media-cell">
                    <PosterThumb src={media.imagenPortada} title={media.titulo} />
                    <div className="media-cell-text">
                      <span className="fw-semibold">{media.titulo}</span>
                      <span className="media-serial">{media.serial}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="chip">{media.tipo?.nombre ?? '—'}</span>
                </td>
                <td>
                  <span className="text-secondary">{media.genero?.nombre ?? '—'}</span>
                  {media.genero?.estado === 'Inactivo' && (
                    <span className="ref-inactive ms-2">Inactivo</span>
                  )}
                </td>
                <td className="text-nowrap">{media.anioEstreno}</td>
                <td>
                  <span className="text-secondary">{media.director?.nombres ?? '—'}</span>
                  {media.director?.estado === 'Inactivo' && (
                    <span className="ref-inactive ms-2">Inactivo</span>
                  )}
                </td>
                <td className="text-end">
                  <div className="row-actions">
                    <button
                      type="button"
                      className="btn btn-icon"
                      title="Ver detalle"
                      aria-label={`Ver detalle de ${media.titulo}`}
                      onClick={() => onPreview(media)}
                    >
                      <i className="bi bi-eye" aria-hidden="true"></i>
                    </button>
                    <button
                      type="button"
                      className="btn btn-icon"
                      title="Editar"
                      aria-label={`Editar ${media.titulo}`}
                      onClick={() => onEdit(media)}
                      disabled={editingDisabled}
                    >
                      <i className="bi bi-pencil-square" aria-hidden="true"></i>
                    </button>
                    <button
                      type="button"
                      className="btn btn-icon btn-icon-danger"
                      title="Eliminar"
                      aria-label={`Eliminar ${media.titulo}`}
                      onClick={() => onDelete(media)}
                    >
                      <i className="bi bi-trash3" aria-hidden="true"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default MediaTable
