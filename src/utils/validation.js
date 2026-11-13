export function esUrlHttp(valor) {
  if (typeof valor !== 'string' || valor.trim() === '') {
    return false
  }

  try {
    const url = new URL(valor)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export function validarCampo(campo, valor) {
  const vacio =
    valor === undefined ||
    valor === null ||
    (typeof valor === 'string' && valor.trim() === '')

  if (campo.required && vacio) {
    return `${campo.label} es obligatorio`
  }

  if (vacio) {
    return ''
  }

  const texto = typeof valor === 'string' ? valor.trim() : valor

  if (typeof texto === 'string') {
    if (campo.minLength && texto.length < campo.minLength) {
      return `${campo.label} debe tener al menos ${campo.minLength} caracteres`
    }

    if (campo.maxLength && texto.length > campo.maxLength) {
      return `${campo.label} no puede superar los ${campo.maxLength} caracteres`
    }
  }

  if (campo.type === 'url' && !esUrlHttp(texto)) {
    return `${campo.label} debe ser una URL http o https válida`
  }

  if (campo.type === 'number') {
    const numero = Number(texto)

    if (!Number.isInteger(numero)) {
      return `${campo.label} debe ser un número entero`
    }

    if (campo.min !== undefined && numero < campo.min) {
      return `${campo.label} debe ser mayor o igual a ${campo.min}`
    }

    if (campo.max !== undefined && numero > campo.max) {
      return `${campo.label} debe ser menor o igual a ${campo.max}`
    }
  }

  return ''
}

export function validarFormulario(campos, valores) {
  return campos.reduce((errores, campo) => {
    const mensaje = validarCampo(campo, valores[campo.name])
    if (mensaje) {
      errores[campo.name] = mensaje
    }
    return errores
  }, {})
}
