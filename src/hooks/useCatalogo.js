import { useCallback, useEffect, useState } from 'react'
import { getApiErrorMessage } from '../api/client'

export default function useCatalogo(service) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let activo = true
    setLoading(true)
    setError('')

    service
      .listar()
      .then((data) => {
        if (activo) setItems(Array.isArray(data) ? data : [])
      })
      .catch((err) => {
        if (activo) setError(getApiErrorMessage(err))
      })
      .finally(() => {
        if (activo) setLoading(false)
      })

    return () => {
      activo = false
    }
  }, [service, reloadKey])

  const recargar = useCallback(() => setReloadKey((valor) => valor + 1), [])

  return { items, loading, error, recargar }
}
