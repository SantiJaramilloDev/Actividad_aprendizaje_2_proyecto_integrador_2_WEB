import CatalogoPage from '../components/catalogo/CatalogoPage'
import { catalogos } from '../config/catalogos'

const config = catalogos.find((catalogo) => catalogo.key === 'productoras')

function ProductorasPage() {
  return <CatalogoPage config={config} />
}

export default ProductorasPage
