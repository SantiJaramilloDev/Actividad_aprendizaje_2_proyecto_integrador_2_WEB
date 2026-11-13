import { useMemo, useRef, useState } from 'react'
import { getApiErrorDetails, getApiErrorMessage } from '../../api/client'
import mediaService from '../../services/mediaService'
import { toastInfo, toastSuccess } from '../../utils/alerts'
import { validarCampo, validarFormulario } from '../../utils/validation'
import AppModal from '../ui/AppModal'
import FormField from '../ui/FormField'
import PosterThumb from './PosterThumb'

const anioMaximo = new Date().getFullYear() + 5

function valoresIniciales(media) {
  return {
    serial: media?.serial ?? '',
    titulo: media?.titulo ?? '',
    sinopsis: media?.sinopsis ?? '',
    urlPelicula: media?.urlPelicula ?? '',
    imagenPortada: media?.imagenPortada ?? '',
    anioEstreno: media?.anioEstreno !== undefined ? String(media.anioEstreno) : '',
    genero: media?.genero?._id ?? '',
    director: media?.director?._id ?? '',
    productora: media?.productora?._id ?? '',
    tipo: media?.tipo?._id ?? '',
  }
}

function opcionesConActual(lista, actual, campoNombre) {
  const opciones = lista.map((item) => ({
    value: item._id,
    label: item[campoNombre],
  }))

  if (actual && !lista.some((item) => item._id === actual._id)) {
    opciones.unshift({
      value: actual._id,
      label: `${actual[campoNombre]} (Inactivo)`,
    })
  }

  return opciones
}

function MediaForm({ media, referencias, onClose, onSaved }) {
  const esEdicion = Boolean(media)
  const [values, setValues] = useState(() => valoresIniciales(media))
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const summaryRef = useRef(null)

  const campos = useMemo(
    () => [
      {
        name: 'serial',
        label: 'Serial',
        type: 'text',
        required: true,
        maxLength: 50,
        placeholder: 'Ej. PEL-001',
        hint: 'Identificador único de la producción.',
      },
      {
        name: 'titulo',
        label: 'Título',
        type: 'text',
        required: true,
        maxLength: 200,
        placeholder: 'Ej. Origen',
      },
      {
        name: 'sinopsis',
        label: 'Sinopsis',
        type: 'textarea',
        maxLength: 2000,
        rows: 4,
        placeholder: 'Describe de qué trata la producción',
        hint: 'Opcional. Máximo 2000 caracteres.',
      },
      {
        name: 'anioEstreno',
        label: 'Año de estreno',
        type: 'number',
        required: true,
        min: 1888,
        max: anioMaximo,
        placeholder: 'Ej. 2010',
      },
      {
        name: 'urlPelicula',
        label: 'URL de la película',
        type: 'url',
        required: true,
        placeholder: 'https://ejemplo.com/pelicula.mp4',
        hint: 'Debe ser una URL http o https única.',
      },
      {
        name: 'imagenPortada',
        label: 'Imagen de portada',
        type: 'url',
        placeholder: 'https://ejemplo.com/portada.jpg',
        hint: 'Opcional. URL http o https de la imagen.',
      },
      {
        name: 'genero',
        label: 'Género principal',
        type: 'select',
        required: true,
        placeholder: 'Selecciona un género',
        options: opcionesConActual(referencias.generos, media?.genero, 'nombre'),
      },
      {
        name: 'director',
        label: 'Director principal',
        type: 'select',
        required: true,
        placeholder: 'Selecciona un director',
        options: opcionesConActual(referencias.directores, media?.director, 'nombres'),
      },
      {
        name: 'productora',
        label: 'Productora',
        type: 'select',
        required: true,
        placeholder: 'Selecciona una productora',
        options: opcionesConActual(referencias.productoras, media?.productora, 'nombre'),
      },
      {
        name: 'tipo',
        label: 'Tipo',
        type: 'select',
        required: true,
        placeholder: 'Selecciona un tipo',
        options: opcionesConActual(referencias.tipos, media?.tipo, 'nombre'),
      },
    ],
    [media, referencias]
  )

  const campoPorNombre = (nombre) => campos.find((campo) => campo.name === nombre)

  const enfocarResumen = () => {
    window.requestAnimationFrame(() => summaryRef.current?.focus())
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setValues((actual) => ({ ...actual, [name]: value }))

    if (errors[name]) {
      const campo = campoPorNombre(name)
      const mensaje = campo ? validarCampo(campo, value) : ''
      setErrors((actual) => ({ ...actual, [name]: mensaje }))
    }
  }

  const handleBlur = (event) => {
    const { name, value } = event.target
    const campo = campoPorNombre(name)
    if (!campo) return
    setErrors((actual) => ({ ...actual, [name]: validarCampo(campo, value) }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const nuevosErrores = validarFormulario(campos, values)
    setErrors(nuevosErrores)
    setFormError('')

    if (Object.keys(nuevosErrores).length > 0) {
      enfocarResumen()
      return
    }

    const payload = {
      serial: values.serial.trim(),
      titulo: values.titulo.trim(),
      sinopsis: values.sinopsis.trim(),
      urlPelicula: values.urlPelicula.trim(),
      imagenPortada: values.imagenPortada.trim(),
      anioEstreno: Number(values.anioEstreno),
      genero: values.genero,
      director: values.director,
      productora: values.productora,
      tipo: values.tipo,
    }

    setSubmitting(true)
    try {
      if (esEdicion) {
        const original = valoresIniciales(media)
        const cambios = {}

        Object.entries(payload).forEach(([clave, valor]) => {
          const anterior =
            clave === 'anioEstreno' ? Number(original[clave]) : original[clave]
          if (valor !== anterior) cambios[clave] = valor
        })

        if (Object.keys(cambios).length === 0) {
          toastInfo('No hay cambios por guardar')
          onClose()
          return
        }

        await mediaService.actualizarParcial(media._id, cambios)
        toastSuccess('La producción se actualizó correctamente')
      } else {
        await mediaService.crear(payload)
        toastSuccess('La producción se creó correctamente')
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

  const renderCampo = (nombre) => {
    const campo = campoPorNombre(nombre)
    if (!campo) return null

    return (
      <FormField
        key={campo.name}
        field={campo}
        value={values[campo.name]}
        error={errors[campo.name]}
        onChange={handleChange}
        onBlur={handleBlur}
      />
    )
  }

  return (
    <AppModal
      open
      onClose={submitting ? () => {} : onClose}
      title={esEdicion ? 'Editar producción' : 'Nueva producción'}
      subtitle={
        esEdicion
          ? `Actualiza la información de ${media.titulo}.`
          : 'Registra una película o serie en el catálogo.'
      }
      size="xl"
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
                {campos
                  .filter((campo) => errors[campo.name])
                  .map((campo) => (
                    <li key={campo.name}>
                      <a href={`#campo-${campo.name}`}>{errors[campo.name]}</a>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        )}

        <div className="row g-4">
          <div className="col-12 col-lg-7">
            <section className="panel-inset" aria-labelledby="media-info-principal">
              <h3 className="h6 text-uppercase text-secondary mb-3" id="media-info-principal">
                Información principal
              </h3>
              {renderCampo('serial')}
              {renderCampo('titulo')}
              {renderCampo('sinopsis')}
              <div className="row">
                <div className="col-12 col-sm-6">{renderCampo('anioEstreno')}</div>
                <div className="col-12 col-sm-6">{renderCampo('urlPelicula')}</div>
              </div>
              {renderCampo('imagenPortada')}
            </section>
          </div>

          <div className="col-12 col-lg-5">
            <section className="media-form-preview" aria-label="Vista previa de la portada">
              <PosterThumb
                src={values.imagenPortada}
                title={values.titulo || 'Nueva producción'}
                size="lg"
                className="w-100"
              />
              <p className="text-secondary small mb-0 mt-2">
                Vista previa de la portada. Si la imagen no carga, se mostrará un
                marcador con las iniciales del título.
              </p>
            </section>

            <section className="panel-inset mt-4" aria-labelledby="media-clasificacion">
              <h3 className="h6 text-uppercase text-secondary mb-3" id="media-clasificacion">
                Clasificación
              </h3>
              {renderCampo('genero')}
              {renderCampo('director')}
              {renderCampo('productora')}
              {renderCampo('tipo')}
              <p className="text-secondary small mb-0">
                Solo se muestran géneros, directores y productoras activos. Las
                referencias inactivas actuales se conservan si no las modificas.
              </p>
            </section>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose} disabled={submitting}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-accent" disabled={submitting}>
            {submitting && (
              <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
            )}
            {submitting
              ? 'Guardando…'
              : esEdicion
                ? 'Guardar cambios'
                : 'Crear producción'}
          </button>
        </div>
      </form>
    </AppModal>
  )
}

export default MediaForm
