import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { createLocalProgressStore } from './local-progress-store'
import { PracticeWorkspace } from './PracticeWorkspace'

describe('PracticeWorkspace', () => {
  it('carga el contenido secundario únicamente al abrir cada panel', async () => {
    const user = userEvent.setup()
    render(<PracticeWorkspace store={createLocalProgressStore()} />)

    expect(screen.queryByRole('heading', { name: 'Historial reciente' })).toBeNull()
    await user.click(screen.getByText('Historial y favoritos'))
    expect(
      await screen.findByRole('heading', { name: 'Historial reciente' }),
    ).toBeInTheDocument()

    expect(screen.queryByRole('heading', { name: 'Preferencias de práctica' })).toBeNull()
    await user.click(screen.getByText('Preferencias y datos'))
    expect(
      await screen.findByRole('heading', { name: 'Preferencias de práctica' }),
    ).toBeInTheDocument()
  })
})
