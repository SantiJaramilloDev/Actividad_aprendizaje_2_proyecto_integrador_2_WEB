import { useCallback, useEffect, useState } from 'react'
import { getApiErrorMessage } from '../api/client'
import directorService from '../services/directorService'
import generoService from '../services/generoService'
import productoraService from '../services/productoraService'
import tipoService from '../services/tipoService'

const inicial = {
  generos: [],
  directores: [],
  productoras: [],
  tipos: [],
}

export default function useReferencias() {
  const [referencias, setReferencias] = useState(inicial)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let activo = true
    setLoading(true)
    setError('')

    Promise.all([
      generoService.listarActivos(),
      directorService.listarActivos(),
      productoraService.listarActivos(),
      tipoService.listar(),
    ])
      .then(([generos, directores, productoras, tipos]) => {
        if (!activo) return
        setReferencias({
          generos: Array.isArray(generos) ? generos : [],
          directores: Array.isArray(directores) ? directores : [],
          productoras: Array.isArray(productoras) ? productoras : [],
          tipos: Array.isArray(tipos) ? tipos : [],
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

  return { referencias, loading, error, recargar }
}
