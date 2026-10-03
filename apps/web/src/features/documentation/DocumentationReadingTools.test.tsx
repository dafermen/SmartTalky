import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { CopyableCode } from './DocumentationReadingTools'
import { matchDocumentation } from './use-documentation-search'
afterEach(() => vi.restoreAllMocks())
describe('herramientas de lectura documental', () => {
  it('busca contenido completo con acentos y todas las palabras', () => {
    const sources = [
      { sourcePath: 'README.md', content: 'Un respaldo astronómico verificable.' },
    ]
    expect(
      matchDocumentation('respaldo astronomico', sources).map((entry) => entry.id),
    ).toEqual(['readme'])
    expect(matchDocumentation('astronomico inexistente', sources)).toEqual([])
    expect(
      matchDocumentation('junior', []).some((entry) => entry.id === 'guia-junior'),
    ).toBe(true)
  })
  it('copia el código literal sin controles de interfaz', async () => {
    const user = userEvent.setup()
    const write = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined)
    render(
      <CopyableCode>
        <code>{'npm run dev\n'}</code>
      </CopyableCode>,
    )
    await user.click(screen.getByRole('button', { name: 'Copiar código' }))
    expect(write).toHaveBeenCalledWith('npm run dev\n')
    expect(screen.getByRole('button', { name: 'Copiado' })).toBeInTheDocument()
  })
  it('ofrece alternativa si se deniega el portapapeles', async () => {
    const user = userEvent.setup()
    vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(
      new DOMException('Denied', 'NotAllowedError'),
    )
    render(
      <CopyableCode>
        <code>example</code>
      </CopyableCode>,
    )
    await user.click(screen.getByRole('button', { name: 'Copiar código' }))
    expect(
      screen.getByRole('button', { name: 'Selecciona el código para copiar' }),
    ).toBeInTheDocument()
  })
})
