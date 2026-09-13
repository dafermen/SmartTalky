import type { ButtonHTMLAttributes } from 'react'

const variantClasses = {
  primary:
    'bg-brand-primary text-white hover:bg-brand-primary-hover disabled:bg-slate-300 disabled:text-slate-600',
  secondary:
    'border border-border bg-surface-raised text-ink hover:border-brand-primary hover:text-brand-primary disabled:text-slate-400',
  ghost: 'bg-transparent text-ink-muted hover:bg-surface-muted hover:text-ink',
} as const

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variantClasses
  fullWidth?: boolean
}

/** Botón táctil con foco visible y variantes semánticas. */
export function Button({
  variant = 'primary',
  fullWidth = false,
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  const widthClass = fullWidth ? 'w-full' : ''

  return (
    <button
      type={type}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-control px-5 py-3 text-base font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed ${variantClasses[variant]} ${widthClass} ${className}`}
      {...props}
    />
  )
}
