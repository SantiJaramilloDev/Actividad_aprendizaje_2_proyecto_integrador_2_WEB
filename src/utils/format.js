const formatterFecha = new Intl.DateTimeFormat('es-CO', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

const formatterFechaHora = new Intl.DateTimeFormat('es-CO', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

export function formatFecha(valor) {
  if (!valor) return '—'
  const fecha = new Date(valor)
  if (Number.isNaN(fecha.getTime())) return '—'
  return formatterFecha.format(fecha)
}

export function formatFechaHora(valor) {
  if (!valor) return '—'
  const fecha = new Date(valor)
  if (Number.isNaN(fecha.getTime())) return '—'
  return formatterFechaHora.format(fecha)
}

export function truncar(texto, maximo = 90) {
  if (!texto) return '—'
  return texto.length > maximo ? `${texto.slice(0, maximo).trim()}…` : texto
}

export function iniciales(texto = '') {
  return texto
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((palabra) => palabra[0]?.toUpperCase() ?? '')
    .join('')
}
