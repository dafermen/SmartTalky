import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { HistoryPanel } from './HistoryPanel'
import { createLocalProgressStore } from './local-progress-store'

describe('HistoryPanel', () => {
  it('filtra historial y favoritos localmente', async () => {
    const user = userEvent.setup()
    const store = createLocalProgressStore()
    store.recordHistory('hello')
    store.recordHistory('comfortable')
    store.toggleFavorite('hello')
    render(<HistoryPanel store={store} />)

    await user.type(
      screen.getByRole('searchbox', { name: 'Buscar en historial y favoritos' }),
      'hello',
    )

    expect(screen.getAllByText('hello')).toHaveLength(2)
    expect(screen.queryByText('comfortable')).toBeNull()
  })
})
