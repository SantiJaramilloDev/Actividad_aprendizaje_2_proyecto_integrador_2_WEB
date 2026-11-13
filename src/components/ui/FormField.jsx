function FormField({ field, value, error, onChange, onBlur }) {
  const id = `campo-${field.name}`
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const describedBy =
    [error ? errorId : null, field.hint ? hintId : null].filter(Boolean).join(' ') ||
    undefined

  const common = {
    id,
    name: field.name,
    value: value ?? '',
    onChange,
    onBlur,
    required: field.required,
    'aria-invalid': Boolean(error),
    'aria-describedby': describedBy,
    className: `form-control${error ? ' is-invalid' : ''}`,
    autoComplete: field.autoComplete ?? 'off',
  }

  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">
        {field.label}
        {field.required ? (
          <span className="text-danger ms-1" aria-hidden="true">
            *
          </span>
        ) : (
          <span className="field-optional">Opcional</span>
        )}
      </label>

      {field.type === 'textarea' && (
        <textarea
          {...common}
          rows={field.rows ?? 3}
          maxLength={field.maxLength}
          placeholder={field.placeholder}
        />
      )}

      {field.type === 'select' && (
        <select {...common} className={`form-select${error ? ' is-invalid' : ''}`}>
          <option value="">{field.placeholder ?? 'Selecciona una opción'}</option>
          {field.options?.map((opcion) => (
            <option key={opcion.value} value={opcion.value}>
              {opcion.label}
            </option>
          ))}
        </select>
      )}

      {(!field.type || field.type === 'text' || field.type === 'number' || field.type === 'url') && (
        <input
          {...common}
          type={field.type === 'url' ? 'url' : field.type === 'number' ? 'number' : 'text'}
          maxLength={field.type === 'text' ? field.maxLength : undefined}
          min={field.min}
          max={field.max}
          step={field.step}
          inputMode={field.type === 'number' ? 'numeric' : undefined}
          placeholder={field.placeholder}
        />
      )}

      {field.hint && (
        <div className="form-text" id={hintId}>
          {field.hint}
        </div>
      )}

      {error && (
        <div className="invalid-feedback d-block" id={errorId} role="alert">
          {error}
        </div>
      )}
    </div>
  )
}

export default FormField
