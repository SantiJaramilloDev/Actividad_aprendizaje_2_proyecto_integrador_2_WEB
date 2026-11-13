import apiClient from '../api/client'

const RECURSO = 'medias'

const mediaService = {
  listar: async (params) => {
    const { data } = await apiClient.get(`/${RECURSO}`, { params })
    return data
  },
  obtener: async (id) => {
    const { data } = await apiClient.get(`/${RECURSO}/${id}`)
    return data
  },
  crear: async (datos) => {
    const { data } = await apiClient.post(`/${RECURSO}`, datos)
    return data
  },
  actualizar: async (id, datos) => {
    const { data } = await apiClient.put(`/${RECURSO}/${id}`, datos)
    return data
  },
  actualizarParcial: async (id, datos) => {
    const { data } = await apiClient.patch(`/${RECURSO}/${id}`, datos)
    return data
  },
  eliminar: async (id) => {
    await apiClient.delete(`/${RECURSO}/${id}`)
  },
}

export default mediaService
