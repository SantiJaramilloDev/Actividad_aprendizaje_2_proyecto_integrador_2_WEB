import { useRef, useState } from 'react'
import { getApiErrorDetails, getApiErrorMessage } from '../../api/client'
import { toastSuccess } from '../../utils/alerts'
import { validarCampo, validarFormulario } from '../../utils/validation'
import AppModal from '../ui/AppModal'
import FormField from '../ui/FormField'

function CatalogoForm({ config, item, onClose, onSaved }) {
  const [values, setValues] = useState(() => ({
    ...config.initialValues,
    ...(item ?? {}),
  }))
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const summaryRef = useRef(null)

  const esEdicion = Boolean(item)
  const nombre = item ? item.nombre ?? item.nombres : ''

  const enfocarResumen = () => {
    window.requestAnimationFrame(() => summaryRef.current?.focus())
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setValues((actual) => ({ ...actual, [name]: value }))

    if (errors[name]) {
      const campo = config.fields.find((field) => field.name === name)
      const mensaje = campo ? validarCampo(campo, value) : ''
      setErrors((actual) => ({ ...actual, [name]: mensaje }))
    }
  }

  const handleBlur = (event) => {
    const { name, value } = event.target
    const campo = config.fields.find((field) => field.name === name)
    if (!campo) return
    const mensaje = validarCampo(campo, value)
    setErrors((actual) => ({ ...actual, [name]: mensaje }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const nuevosErrores = validarFormulario(config.fields, values)
    setErrors(nuevosErrores)
    setFormError('')

    if (Object.keys(nuevosErrores).length > 0) {
      enfocarResumen()
      return
    }

    const payload = config.fields.reduce((acumulado, field) => {
      const valor = values[field.name]
      acumulado[field.name] = typeof valor === 'string' ? valor.trim() : valor
      return acumulado
    }, {})

    setSubmitting(true)
    try {
      if (esEdicion) {
        await config.service.actualizar(item._id, payload)
        toastSuccess(`El ${config.resource} se actualizó correctamente`)
      } else {
        await config.service.crear(payload)
        toastSuccess(`El ${config.resource} se creó correctamente`)
      }
      onSaved()
    } catch (error) {
      const detalle = getApiErrorDetails(error)
      setErrors((actual) => ({ ...actual, ...detalle }))
      setFormError(getApiErrorMessage(error))
      enfocarResumen()
    } finally {
      setSubmitting(false)
    }
  }

  const hayErrores = Object.keys(errors).some((clave) => errors[clave])

  return (
    <AppModal
      open
      onClose={submitting ? () => {} : onClose}
      title={esEdicion ? `Editar ${config.resource}` : `Nuevo ${config.resource}`}
      subtitle={
        esEdicion
          ? `Actualiza la información de ${nombre}.`
          : `Completa la información para registrar un ${config.resource}.`
      }
      size="md"
    >
      <form onSubmit={handleSubmit} noValidate>
        {(formError || hayErrores) && (
          <div
            className="form-error-summary"
            role="alert"
            tabIndex={-1}
            ref={summaryRef}
          >
            <strong>Revisa la información del formulario</strong>
            {formError && <p className="mb-2 mt-1">{formError}</p>}
            {hayErrores && (
              <ul className="mb-0">
                {config.fields
                  .filter((field) => errors[field.name])
                  .map((field) => (
                    <li key={field.name}>
                      <a href={`#campo-${field.name}`}>{errors[field.name]}</a>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        )}

        {config.fields.map((field) => (
          <FormField
            key={field.name}
            field={field}
            value={values[field.name]}
            error={errors[field.name]}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        ))}

        <div className="form-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose} disabled={submitting}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-accent" disabled={submitting}>
            {submitting && (
              <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
            )}
            {submitting ? 'Guardando…' : esEdicion ? 'Guardar cambios' : `Crear ${config.resource}`}
          </button>
        </div>
      </form>
    </AppModal>
  )
}

export default CatalogoForm
