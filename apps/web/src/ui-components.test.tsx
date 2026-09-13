import { Button, Card, TextField } from '@smarttalky/ui'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

describe('componentes fundamentales', () => {
  it('expone nombre, ayuda y error del campo de texto', () => {
    render(
      <TextField
        label="Palabra o frase"
        helperText="Escribe en inglés."
        errorMessage="Este campo es obligatorio."
      />,
    )

    const field = screen.getByRole('textbox', { name: 'Palabra o frase' })
    expect(field).toHaveAccessibleDescription(
      'Escribe en inglés. Este campo es obligatorio.',
    )
    expect(field).toHaveAttribute('aria-invalid', 'true')
  })

  it('mantiene semántica nativa en botón y tarjeta', () => {
    render(
      <Card aria-label="Ejemplo">
        <Button>Escuchar</Button>
      </Card>,
    )

    expect(screen.getByRole('region', { name: 'Ejemplo' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Escuchar' })).toBeEnabled()
  })
})
