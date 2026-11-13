import { Route, Routes } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import DashboardPage from '../pages/DashboardPage'
import DirectoresPage from '../pages/DirectoresPage'
import GenerosPage from '../pages/GenerosPage'
import MediasPage from '../pages/MediasPage'
import NotFoundPage from '../pages/NotFoundPage'
import ProductorasPage from '../pages/ProductorasPage'
import TiposPage from '../pages/TiposPage'

function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="generos" element={<GenerosPage />} />
        <Route path="directores" element={<DirectoresPage />} />
        <Route path="productoras" element={<ProductorasPage />} />
        <Route path="tipos" element={<TiposPage />} />
        <Route path="medias" element={<MediasPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
