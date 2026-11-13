import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <section className="empty-state not-found" aria-labelledby="notfound-title">
      <span className="empty-icon" aria-hidden="true">
        <i className="bi bi-camera-reels"></i>
      </span>
      <p className="not-found-code mb-1">404</p>
      <h1 className="h3 mb-2" id="notfound-title">
        Esta escena no existe
      </h1>
      <p className="text-secondary mb-3">
        La página que buscas no está disponible o cambió de lugar.
      </p>
      <Link to="/" className="btn btn-accent">
        <i className="bi bi-arrow-left me-2" aria-hidden="true"></i>
        Volver al dashboard
      </Link>
    </section>
  )
}

export default NotFoundPage
