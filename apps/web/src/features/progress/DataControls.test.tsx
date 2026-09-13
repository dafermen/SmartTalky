import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { DataControls } from './DataControls'
import { createLocalProgressStore } from './local-progress-store'

describe('DataControls', () => {
  it('exige confirmación antes de borrar y permite cancelar', async () => {
    const user = userEvent.setup()
    const store = createLocalProgressStore()
    store.recordHistory('hello')
    const confirmAction = vi.fn().mockReturnValueOnce(false).mockReturnValueOnce(true)
    render(<DataControls store={store} confirmAction={confirmAction} />)

    const button = screen.getByRole('button', { name: 'Borrar historial' })
    await user.click(button)
    expect(store.getSnapshot().history).toHaveLength(1)

    await user.click(button)
    expect(store.getSnapshot().history).toHaveLength(0)
    expect(screen.getByRole('status')).toHaveTextContent('Historial eliminado')
  })

  it('borra favoritos por separado y restablece todo', async () => {
    const user = userEvent.setup()
    const store = createLocalProgressStore()
    store.recordHistory('hello')
    store.toggleFavorite('hello')
    render(<DataControls store={store} confirmAction={() => true} />)

    await user.click(screen.getByRole('button', { name: 'Borrar favoritos' }))
    expect(store.getSnapshot().favorites).toHaveLength(0)
    expect(store.getSnapshot().history).toHaveLength(1)

    store.updatePreferences({ mode: 'teacher' })
    await user.click(screen.getByRole('button', { name: 'Borrar todos mis datos' }))
    expect(store.getSnapshot()).toMatchObject({
      history: [],
      favorites: [],
      preferences: { rate: 1, mode: 'natural' },
    })
  })

  it('descarga una exportación JSON versionada', async () => {
    const user = userEvent.setup()
    const store = createLocalProgressStore({
      now: () => new Date('2026-07-18T12:00:00.000Z'),
    })
    store.recordHistory('hello')
    const download = vi.fn()
    render(<DataControls store={store} download={download} />)

    await user.click(screen.getByRole('button', { name: 'Exportar JSON' }))

    expect(download).toHaveBeenCalledOnce()
    const [filename, contents] = download.mock.calls[0] as [string, string]
    expect(filename).toBe('smarttalky-progreso.json')
    expect(JSON.parse(contents)).toMatchObject({
      format: 'smarttalky-progress',
      version: 4,
      exportedAt: '2026-07-18T12:00:00.000Z',
      data: { history: [{ text: 'hello' }] },
    })
  })

  it('informa un fallo de descarga y permite volver a intentar', async () => {
    const user = userEvent.setup()
    const download = vi
      .fn()
      .mockImplementationOnce(() => {
        throw new DOMException('Descarga bloqueada', 'SecurityError')
      })
      .mockImplementationOnce(() => undefined)
    render(<DataControls store={createLocalProgressStore()} download={download} />)

    const button = screen.getByRole('button', { name: 'Exportar JSON' })
    await user.click(button)
    expect(screen.getByRole('alert')).toHaveTextContent('No pudimos preparar la descarga')

    await user.click(button)
    expect(screen.getByRole('status')).toHaveTextContent('Copia JSON preparada')
    expect(download).toHaveBeenCalledTimes(2)
  })
})
