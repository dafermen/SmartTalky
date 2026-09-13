import { forwardRef, useId, type InputHTMLAttributes } from 'react'

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  helperText?: string | undefined
  errorMessage?: string | undefined
}

/** Campo de texto etiquetado que relaciona ayuda y error con tecnologías asistivas. */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { id, label, helperText, errorMessage, className = '', ...props },
  ref,
) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const helperId = helperText === undefined ? undefined : `${fieldId}-helper`
  const errorId = errorMessage === undefined ? undefined : `${fieldId}-error`
  const describedBy = [helperId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className="grid gap-2">
      <label htmlFor={fieldId} className="text-sm font-bold text-ink">
        {label}
      </label>
      <input
        ref={ref}
        id={fieldId}
        aria-describedby={describedBy}
        aria-invalid={errorMessage === undefined ? undefined : true}
        className={`min-h-12 w-full rounded-control border bg-surface-raised px-4 py-3 text-base text-ink outline-none transition-shadow placeholder:text-slate-400 focus:border-focus focus:shadow-control ${errorMessage === undefined ? 'border-border' : 'border-error-ink'} ${className}`}
        {...props}
      />
      {helperText === undefined ? null : (
        <p id={helperId} className="m-0 text-sm leading-6 text-ink-muted">
          {helperText}
        </p>
      )}
      {errorMessage === undefined ? null : (
        <p id={errorId} className="m-0 text-sm font-semibold text-error-ink" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  )
})
