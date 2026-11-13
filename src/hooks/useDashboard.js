import { useCallback, useEffect, useState } from 'react'
import { getApiErrorMessage } from '../api/client'
import directorService from '../services/directorService'
import generoService from '../services/generoService'
import mediaService from '../services/mediaService'
import productoraService from '../services/productoraService'
import tipoService from '../services/tipoService'

const inicial = {
  generos: [],
  directores: [],
  productoras: [],
  tipos: [],
  medias: [],
}

export default function useDashboard() {
  const [data, setData] = useState(inicial)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let activo = true
    setLoading(true)
    setError('')

    Promise.all([
      generoService.listar(),
      directorService.listar(),
      productoraService.listar(),
      tipoService.listar(),
      mediaService.listar(),
    ])
      .then(([generos, directores, productoras, tipos, medias]) => {
        if (!activo) return
        setData({
          generos: Array.isArray(generos) ? generos : [],
          directores: Array.isArray(directores) ? directores : [],
          productoras: Array.isArray(productoras) ? productoras : [],
          tipos: Array.isArray(tipos) ? tipos : [],
          medias: Array.isArray(medias) ? medias : [],
        })
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
  }, [reloadKey])

  const recargar = useCallback(() => setReloadKey((valor) => valor + 1), [])

  return { data, loading, error, recargar }
}
