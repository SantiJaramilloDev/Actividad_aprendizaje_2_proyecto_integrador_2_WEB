import { formatFechaHora } from '../../utils/format'
import AppModal from '../ui/AppModal'
import PosterThumb from './PosterThumb'

function Dato({ label, children }) {
  return (
    <div className="preview-dato">
      <dt>{label}</dt>
      <dd>{children || '—'}</dd>
    </div>
  )
}

function MediaPreview({ media, onClose }) {
  return (
    <AppModal
      open
      onClose={onClose}
      title={media.titulo}
      subtitle={`Serial ${media.serial}`}
      size="lg"
    >
      <div className="row g-4">
        <div className="col-12 col-sm-4">
          <PosterThumb
            src={media.imagenPortada}
            title={media.titulo}
            size="lg"
            className="w-100"
          />
        </div>

        <div className="col-12 col-sm-8">
          <dl className="preview-grid mb-0">
            <Dato label="Tipo">{media.tipo?.nombre}</Dato>
            <Dato label="Año de estreno">{media.anioEstreno}</Dato>
            <Dato label="Género">{media.genero?.nombre}</Dato>
            <Dato label="Director">{media.director?.nombres}</Dato>
            <Dato label="Productora">{media.productora?.nombre}</Dato>
            <Dato label="Actualizado">{formatFechaHora(media.fechaActualizacion)}</Dato>
          </dl>

          <div className="mt-4">
            <h3 className="h6 text-secondary text-uppercase mb-2">Sinopsis</h3>
            <p className="mb-0">{media.sinopsis || 'Sin sinopsis registrada.'}</p>
          </div>

          <div className="mt-4 d-flex flex-wrap gap-2">
            <a
              className="btn btn-accent"
              href={media.urlPelicula}
              target="_blank"
              rel="noreferrer"
            >
              <i className="bi bi-box-arrow-up-right me-2" aria-hidden="true"></i>
              Abrir producción
            </a>
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </AppModal>
  )
}

export default MediaPreview
