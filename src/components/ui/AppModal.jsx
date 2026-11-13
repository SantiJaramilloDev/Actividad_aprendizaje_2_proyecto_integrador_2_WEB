import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

function AppModal({ open, onClose, title, subtitle, size = 'md', children }) {
  const dialogRef = useRef(null)
  const onCloseRef = useRef(onClose)
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!open) return undefined

    const dialog = dialogRef.current
    if (!dialog) return undefined

    const previouslyFocused = document.activeElement
    document.body.classList.add('app-modal-open')

    const getFocusable = () =>
      Array.from(dialog.querySelectorAll(FOCUSABLE)).filter(
        (element) => element.offsetParent !== null
      )

    const focusTimer = window.setTimeout(() => {
      const preferred =
        dialog.querySelector('[data-autofocus]') ||
        dialog.querySelector('input:not([type="hidden"]), select, textarea')
      const first = preferred || getFocusable()[0] || dialog
      first.focus()
    }, 0)

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onCloseRef.current?.()
        return
      }

      if (event.key !== 'Tab') return

      const focusable = getFocusable()
      if (!focusable.length) {
        event.preventDefault()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      window.clearTimeout(focusTimer)
      document.removeEventListener('keydown', handleKeyDown)
      document.body.classList.remove('app-modal-open')
      if (previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus()
      }
    }
  }, [open])

  if (!open) return null

  return createPortal(
    <div
      className="app-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onCloseRef.current?.()
        }
      }}
    >
      <div
        className={`app-modal app-modal-${size}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={subtitle ? descriptionId : undefined}
        ref={dialogRef}
        tabIndex={-1}
      >
        <div className="app-modal-header">
          <div>
            <h2 className="h5 mb-0" id={titleId}>
              {title}
            </h2>
            {subtitle && (
              <p className="text-secondary small mb-0 mt-1" id={descriptionId}>
                {subtitle}
              </p>
            )}
          </div>
          <button
            type="button"
            className="btn-close btn-close-white"
            aria-label="Cerrar ventana"
            onClick={() => onCloseRef.current?.()}
          ></button>
        </div>
        <div className="app-modal-body">{children}</div>
      </div>
    </div>,
    document.body
  )
}

export default AppModal
