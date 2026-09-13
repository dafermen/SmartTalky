import axe from 'axe-core'
import userEvent from '@testing-library/user-event'
import { screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { AppRoutes } from './App'
import { createLocalProgressStore } from './features/progress/local-progress-store'
import type { LookupPronunciation } from './features/practice/types'
import { HomePage } from './pages/HomePage'
import { renderWithQuery } from './test/render-with-query'

async function expectNoAutomatedViolations() {
  const results = await axe.run(document.body, {
    rules: {
      'color-contrast': { enabled: false },
    },
  })

  expect(results.violations).toEqual([])
}

describe('accesibilidad base', () => {
  it('no presenta violaciones automatizables en la vista inicial', async () => {
    renderWithQuery(
      <MemoryRouter>
        <AppRoutes />
      </MemoryRouter>,
    )

    await expectNoAutomatedViolations()
  })

  it('no presenta violaciones en la guía completa y controles locales', async () => {
    const user = userEvent.setup()
    const lookup: LookupPronunciation = async (text) => ({
      entry: {
        text,
        kind: 'word',
        locale: 'en-US',
        ipa: '/həˈloʊ/',
        syllables: [
          { text: 'hel', stressed: false },
          { text: 'lo', stressed: true },
        ],
        translation: 'hola',
        example: 'Hello, it is nice to meet you.',
      },
      audio: [],
    })
    renderWithQuery(
      <main>
        <HomePage
          lookupPronunciation={lookup}
          progressStore={createLocalProgressStore()}
        />
      </main>,
    )

    await user.type(
      screen.getByRole('textbox', { name: 'Palabra o frase en inglés' }),
      'hello',
    )
    await user.click(screen.getByRole('button', { name: 'Preparar pronunciación' }))
    await screen.findByRole('region', { name: 'Guía de pronunciación para hello' })

    await expectNoAutomatedViolations()
  })

  it('no presenta violaciones automatizables en privacidad ni en página 404', async () => {
    const about = renderWithQuery(
      <MemoryRouter initialEntries={['/acerca']}>
        <AppRoutes />
      </MemoryRouter>,
    )
    await screen.findByRole('heading', {
      name: 'Aprender pronunciación sin complicaciones',
    })
    await expectNoAutomatedViolations()

    about.unmount()
    renderWithQuery(
      <MemoryRouter initialEntries={['/ruta-inexistente']}>
        <AppRoutes />
      </MemoryRouter>,
    )
    await screen.findByRole('heading', { name: 'Esta página no existe' })
    await expectNoAutomatedViolations()
  })

  it('no presenta violaciones automatizables en el centro documental', async () => {
    renderWithQuery(
      <MemoryRouter initialEntries={['/docs']}>
        <AppRoutes />
      </MemoryRouter>,
    )

    await screen.findByRole(
      'heading',
      { name: 'Documentación de SmartTalky' },
      { timeout: 5_000 },
    )
    await expectNoAutomatedViolations()
  }, 10_000)
})
