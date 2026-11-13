import CatalogoPage from '../components/catalogo/CatalogoPage'
import { catalogos } from '../config/catalogos'

const config = catalogos.find((catalogo) => catalogo.key === 'generos')

function GenerosPage() {
  return <CatalogoPage config={config} />
}

export default GenerosPage
