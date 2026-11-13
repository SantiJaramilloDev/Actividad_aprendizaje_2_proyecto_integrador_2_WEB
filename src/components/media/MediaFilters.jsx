function MediaFilters({
  filtros,
  onChange,
  onClear,
  referencias,
  resultados,
  cargandoReferencias,
}) {
  const hayFiltros = Boolean(filtros.titulo || filtros.genero || filtros.tipo)

  return (
    <div className="toolbar toolbar-media">
      <div className="search-box">
        <i className="bi bi-search" aria-hidden="true"></i>
        <input
          type="search"
          className="form-control"
          placeholder="Buscar por título…"
          value={filtros.titulo}
          onChange={(event) => onChange('titulo', event.target.value)}
          aria-label="Buscar producciones por título"
        />
        {filtros.titulo && (
          <button
            type="button"
            className="search-clear"
            aria-label="Limpiar búsqueda"
            onClick={() => onChange('titulo', '')}
          >
            <i className="bi bi-x-lg" aria-hidden="true"></i>
          </button>
        )}
      </div>

      <select
        className="form-select toolbar-select"
        value={filtros.genero}
        onChange={(event) => onChange('genero', event.target.value)}
        aria-label="Filtrar por género"
        disabled={cargandoReferencias}
      >
        <option value="">Todos los géneros</option>
        {referencias.generos.map((genero) => (
          <option key={genero._id} value={genero._id}>
            {genero.nombre}
          </option>
        ))}
      </select>

      <select
        className="form-select toolbar-select"
        value={filtros.tipo}
        onChange={(event) => onChange('tipo', event.target.value)}
        aria-label="Filtrar por tipo"
        disabled={cargandoReferencias}
      >
        <option value="">Todos los tipos</option>
        {referencias.tipos.map((tipo) => (
          <option key={tipo._id} value={tipo._id}>
            {tipo.nombre}
          </option>
        ))}
      </select>

      <button
        type="button"
        className="btn btn-ghost"
        onClick={onClear}
        disabled={!hayFiltros}
      >
        <i className="bi bi-arrow-counterclockwise me-2" aria-hidden="true"></i>
        Limpiar
      </button>

      <span className="toolbar-count ms-auto" aria-live="polite">
        {resultados} {resultados === 1 ? 'producción' : 'producciones'}
      </span>
    </div>
  )
}

export default MediaFilters
