import { useState } from 'react'
import { iniciales } from '../../utils/format'

function PosterThumb({ src, title = '', size = 'sm', className = '' }) {
  const [fallo, setFallo] = useState(false)
  const mostrarImagen = Boolean(src) && !fallo

  return (
    <div className={`poster-thumb poster-thumb-${size} ${className}`.trim()}>
      {mostrarImagen ? (
        <img
          src={src}
          alt={`Póster de ${title}`}
          loading="lazy"
          onError={() => setFallo(true)}
        />
      ) : (
        <div className="poster-fallback" aria-hidden="true">
          <i className="bi bi-film"></i>
          <span>{iniciales(title)}</span>
        </div>
      )}
    </div>
  )
}

export default PosterThumb
