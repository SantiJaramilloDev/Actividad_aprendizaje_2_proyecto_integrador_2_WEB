import { useCallback, useEffect, useState } from 'react'
import { getApiErrorMessage } from '../api/client'
import mediaService from '../services/mediaService'

export default function useMedias(filtros) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let activo = true
    const params = {}

    if (filtros.titulo) params.titulo = filtros.titulo
    if (filtros.genero) params.genero = filtros.genero
    if (filtros.tipo) params.tipo = filtros.tipo

    setLoading(true)
    setError('')

    mediaService
      .listar(params)
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
  }, [filtros, reloadKey])

  const recargar = useCallback(() => setReloadKey((valor) => valor + 1), [])

  return { items, loading, error, recargar }
}
