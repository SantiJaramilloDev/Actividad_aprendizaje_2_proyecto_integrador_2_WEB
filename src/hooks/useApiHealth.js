import { useCallback, useEffect, useState } from 'react'
import apiClient, { getApiErrorMessage } from '../api/client'

const estadoInicial = {
  status: 'loading',
  message: 'Verificando conexión…',
  checkedAt: null,
}

export default function useApiHealth() {
  const [estado, setEstado] = useState(estadoInicial)

  const verificar = useCallback(async () => {
    setEstado((actual) => ({ ...actual, status: 'loading', message: 'Verificando conexión…' }))

    try {
      const { data } = await apiClient.get('/health')
      setEstado({
        status: 'ok',
        message: data?.mensaje ?? 'API conectada correctamente',
        checkedAt: new Date(),
      })
    } catch (error) {
      setEstado({
        status: 'error',
        message: getApiErrorMessage(error),
        checkedAt: new Date(),
      })
    }
  }, [])

  useEffect(() => {
    verificar()
  }, [verificar])

  return { ...estado, verificar }
}
