import apiClient from '../api/client'

export function crearCatalogoService(recurso) {
  return {
    listar: async (params) => {
      const { data } = await apiClient.get(`/${recurso}`, { params })
      return data
    },
    listarActivos: async () => {
      const { data } = await apiClient.get(`/${recurso}`, {
        params: { estado: 'Activo' },
      })
      return data
    },
    obtener: async (id) => {
      const { data } = await apiClient.get(`/${recurso}/${id}`)
      return data
    },
    crear: async (datos) => {
      const { data } = await apiClient.post(`/${recurso}`, datos)
      return data
    },
    actualizar: async (id, datos) => {
      const { data } = await apiClient.put(`/${recurso}/${id}`, datos)
      return data
    },
    eliminar: async (id) => {
      await apiClient.delete(`/${recurso}/${id}`)
    },
  }
}
