import type { HTMLAttributes } from 'react'

export type CardProps = HTMLAttributes<HTMLElement>

/** Superficie elevada para agrupar contenido relacionado sin imponer su semántica interna. */
export function Card({ className = '', ...props }: CardProps) {
  return (
    <section
      className={`rounded-card border border-border bg-surface-raised shadow-card ${className}`}
      {...props}
    />
  )
}
