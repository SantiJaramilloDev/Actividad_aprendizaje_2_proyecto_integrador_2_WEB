import { useEffect, useState } from 'react'

export default function useDebouncedValue(valor, retraso = 350) {
  const [valorDiferido, setValorDiferido] = useState(valor)

  useEffect(() => {
    const temporizador = setTimeout(() => setValorDiferido(valor), retraso)
    return () => clearTimeout(temporizador)
  }, [valor, retraso])

  return valorDiferido
}
