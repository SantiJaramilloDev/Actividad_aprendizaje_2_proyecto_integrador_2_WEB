import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000,
})

export function getApiErrorMessage(error) {
  if (error?.code === 'ECONNABORTED') {
    return 'La solicitud tardó demasiado. Verifica que la API esté encendida e inténtalo de nuevo.'
  }

  if (!error?.response) {
    return 'No fue posible conectarse con la API. Revisa que el servidor esté en ejecución.'
  }

  return (
    error.response.data?.message ||
    error.message ||
    'Ocurrió un error inesperado al comunicarse con la API'
  )
}

export function getApiErrorDetails(error) {
  const details = error?.response?.data?.details

  if (!Array.isArray(details)) {
    return {}
  }

  return details.reduce((acumulado, detalle) => {
    if (detalle?.campo) {
      acumulado[detalle.campo] = detalle.mensaje
    }
    return acumulado
  }, {})
}

export default apiClient
