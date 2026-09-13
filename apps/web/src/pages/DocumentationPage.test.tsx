import userEvent from '@testing-library/user-event'
import { screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { renderWithQuery } from '../test/render-with-query'
import { DocumentationPage } from './DocumentationPage'

function renderDocumentation(path = '/docs') {
  return renderWithQuery(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/docs/:documentId?" element={<DocumentationPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  window.localStorage.clear()
  delete document.documentElement.dataset.documentationTheme
})

describe('centro de documentación', () => {
  it('filtra el catálogo con términos comprensibles', async () => {
    const user = userEvent.setup()
    renderDocumentation()

    await user.type(
      screen.getByRole('searchbox', { name: 'Buscar documentación' }),
      'junior',
    )

    const content = document.getElementById('documentation-content')
    expect(content).not.toBeNull()
    expect(
      within(content!).getByRole('link', {
        name: /Guía para desarrolladores junior/,
      }),
    ).toBeInTheDocument()
    expect(
      within(content!).queryByRole('link', { name: /Visión del proyecto/ }),
    ).toBeNull()
  })

  it('carga y presenta Markdown sin interpretar HTML inseguro', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(
          new Response(
            '# Guía de prueba\n\n## Sección útil\n\nContenido seguro.\n\n[Archivo interno](AGENTS.md)\n\n<script>alert("no")</script>',
            { status: 200 },
          ),
        ),
    )
    renderDocumentation('/docs/guia-junior')

    expect(
      await screen.findByRole('heading', { name: 'Guía de prueba' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Contenido seguro.')).toBeInTheDocument()
    expect(screen.getByText('Archivo interno')).not.toHaveAttribute('href')
    expect(document.querySelector('script')).toBeNull()
    expect(screen.getByRole('heading', { name: 'Sección útil' })).toHaveAttribute(
      'id',
      'seccion-util',
    )
    expect(screen.getAllByRole('link', { name: 'Sección útil' })[0]).toHaveAttribute(
      'href',
      '#seccion-util',
    )
    expect(
      screen.getByRole('link', { name: /Siguiente.*Instalación local/ }),
    ).toHaveAttribute('href', '/docs/instalacion')
  })

  it('ofrece regreso explícito, menú móvil y tema persistente', async () => {
    const user = userEvent.setup()
    renderDocumentation()

    const menu = screen.getByRole('button', {
      name: 'Abrir menú de documentación',
    })
    await user.click(menu)
    expect(menu).toHaveAttribute('aria-expanded', 'true')
    expect(
      screen
        .getAllByRole('link', { name: /Volver a la aplicación/ })
        .every((link) => link.getAttribute('href') === '/'),
    ).toBe(true)

    const theme = screen.getByRole('button', { name: 'Tema oscuro' })
    await user.click(theme)
    expect(document.documentElement.dataset.documentationTheme).toBe('dark')
    expect(window.localStorage.getItem('smarttalky-documentation-theme')).toBe('dark')
  })

  it('permanece usable si el navegador bloquea el almacenamiento del tema', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('Bloqueado', 'SecurityError')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Bloqueado', 'SecurityError')
    })

    renderDocumentation()

    expect(
      screen.getByRole('heading', { name: 'Documentación de SmartTalky' }),
    ).toBeInTheDocument()
  })
})
