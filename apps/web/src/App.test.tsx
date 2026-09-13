import userEvent from '@testing-library/user-event'
import { screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { App, AppRoutes } from './App'
import { renderWithQuery } from './test/render-with-query'

describe('rutas principales', () => {
  it('presenta la práctica y navega a la información del proyecto', async () => {
    const user = userEvent.setup()
    renderWithQuery(
      <MemoryRouter>
        <AppRoutes />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', {
        name: 'Haz que el inglés suene más cercano',
      }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: 'Acerca de' }))

    expect(
      await screen.findByRole('heading', {
        name: 'Aprender pronunciación sin complicaciones',
      }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: 'Documentación' }))

    expect(
      await screen.findByRole(
        'heading',
        { name: 'Documentación de SmartTalky' },
        { timeout: 5_000 },
      ),
    ).toBeInTheDocument()
  }, 10_000)

  it('usa navegación hash dentro del contenedor nativo', async () => {
    const user = userEvent.setup()
    window.location.hash = ''
    renderWithQuery(<App isNativePlatform />)

    await user.click(screen.getByRole('link', { name: 'Acerca de' }))

    expect(window.location.hash).toBe('#/acerca')
  })

  it('conserva la ruta documental anterior mediante redirección', async () => {
    renderWithQuery(
      <MemoryRouter initialEntries={['/documentacion']}>
        <AppRoutes />
      </MemoryRouter>,
    )

    expect(
      await screen.findByRole(
        'heading',
        { name: 'Documentación de SmartTalky' },
        { timeout: 5_000 },
      ),
    ).toBeInTheDocument()
  })
})
