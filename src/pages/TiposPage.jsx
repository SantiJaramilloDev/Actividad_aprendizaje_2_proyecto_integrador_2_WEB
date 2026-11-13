import CatalogoPage from '../components/catalogo/CatalogoPage'
import { catalogos } from '../config/catalogos'

const config = catalogos.find((catalogo) => catalogo.key === 'tipos')

function TiposPage() {
  return <CatalogoPage config={config} />
}

export default TiposPage
