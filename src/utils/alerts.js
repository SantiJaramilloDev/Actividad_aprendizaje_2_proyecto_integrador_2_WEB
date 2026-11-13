import Swal from 'sweetalert2'
import { getApiErrorMessage } from '../api/client'

const base = {
  background: '#141416',
  color: '#f8fafc',
  confirmButtonColor: '#e11d48',
  cancelButtonColor: '#3f3f46',
  customClass: {
    popup: 'app-swal',
  },
}

export function toastSuccess(title) {
  return Swal.fire({
    ...base,
    toast: true,
    position: 'top-end',
    icon: 'success',
    title,
    showConfirmButton: false,
    timer: 2600,
    timerProgressBar: true,
  })
}

export function toastInfo(title) {
  return Swal.fire({
    ...base,
    toast: true,
    position: 'top-end',
    icon: 'info',
    title,
    showConfirmButton: false,
    timer: 2400,
    timerProgressBar: true,
  })
}

export function toastError(title) {
  return Swal.fire({
    ...base,
    toast: true,
    position: 'top-end',
    icon: 'error',
    title,
    showConfirmButton: false,
    timer: 3600,
    timerProgressBar: true,
  })
}

export function confirmarEliminacion({ titulo, texto }) {
  return Swal.fire({
    ...base,
    title: titulo,
    text: texto,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,
    focusCancel: true,
  }).then((resultado) => resultado.isConfirmed)
}

export function mostrarErrorApi(error, titulo = 'No se pudo completar la acción') {
  const details = error?.response?.data?.details
  const mensaje = getApiErrorMessage(error)
  let html = ''

  if (Array.isArray(details) && details.length) {
    html = `<p class="mb-2">${mensaje}</p><ul class="text-start mb-0">${details
      .map((detalle) => `<li>${detalle.campo}: ${detalle.mensaje}</li>`)
      .join('')}</ul>`
  }

  return Swal.fire({
    ...base,
    icon: 'error',
    title: titulo,
    ...(html ? { html } : { text: mensaje }),
    confirmButtonText: 'Entendido',
  })
}
