import CatalogoPage from '../components/catalogo/CatalogoPage'
import { catalogos } from '../config/catalogos'

const config = catalogos.find((catalogo) => catalogo.key === 'directores')

function DirectoresPage() {
  return <CatalogoPage config={config} />
}

export default DirectoresPage
