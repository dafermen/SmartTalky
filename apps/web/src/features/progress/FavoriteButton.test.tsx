import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { FavoriteButton } from './FavoriteButton'
import { createLocalProgressStore } from './local-progress-store'

describe('FavoriteButton', () => {
  it('activa y desactiva el favorito con estado accesible', async () => {
    const user = userEvent.setup()
    const store = createLocalProgressStore()
    render(<FavoriteButton text="hello" store={store} />)

    const addButton = screen.getByRole('button', {
      name: 'Guardar hello en favoritos',
    })
    expect(addButton).toHaveAttribute('aria-pressed', 'false')

    await user.click(addButton)
    const removeButton = screen.getByRole('button', {
      name: 'Quitar hello de favoritos',
    })
    expect(removeButton).toHaveAttribute('aria-pressed', 'true')

    await user.click(removeButton)
    expect(
      screen.getByRole('button', { name: 'Guardar hello en favoritos' }),
    ).toHaveAttribute('aria-pressed', 'false')
  })
})
