import StatusBadge from '../ui/StatusBadge'
import TableSkeleton from '../ui/TableSkeleton'
import { formatFecha, truncar } from '../../utils/format'

function valorNombre(item) {
  return item.nombre ?? item.nombres ?? 'registro'
}

function Celda({ columna, item }) {
  const valor = item[columna.key]

  if (columna.kind === 'status') return <StatusBadge estado={valor} />
  if (columna.kind === 'date') return <span className="text-nowrap">{formatFecha(valor)}</span>
  if (columna.kind === 'strong') return <span className="fw-semibold">{valor || '—'}</span>

  return (
    <span className="text-secondary" title={valor || undefined}>
      {truncar(valor, 80)}
    </span>
  )
}

function CatalogoTable({ config, items, loading, onEdit, onDelete }) {
  return (
    <div className="table-responsive panel-table">
      <table className="table align-middle mb-0">
        <caption className="visually-hidden">Listado de {config.title.toLowerCase()}</caption>
        <thead>
          <tr>
            {config.columns.map((columna) => (
              <th scope="col" key={columna.key}>
                {columna.label}
              </th>
            ))}
            <th scope="col" className="text-end">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <TableSkeleton rows={5} columns={config.columns.length + 1} />
          ) : (
            items.map((item) => (
              <tr key={item._id}>
                {config.columns.map((columna) => (
                  <td key={columna.key}>
                    <Celda columna={columna} item={item} />
                  </td>
                ))}
                <td className="text-end">
                  <div className="row-actions">
                    <button
                      type="button"
                      className="btn btn-icon"
                      title="Editar"
                      aria-label={`Editar ${valorNombre(item)}`}
                      onClick={() => onEdit(item)}
                    >
                      <i className="bi bi-pencil-square" aria-hidden="true"></i>
                    </button>
                    <button
                      type="button"
                      className="btn btn-icon btn-icon-danger"
                      title="Eliminar"
                      aria-label={`Eliminar ${valorNombre(item)}`}
                      onClick={() => onDelete(item)}
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

export default CatalogoTable
