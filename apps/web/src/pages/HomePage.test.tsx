import userEvent from '@testing-library/user-event'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import type {
  LookupPronunciation,
  PronunciationEntry,
  PronunciationResult,
} from '../features/practice/types'
import { renderWithQuery } from '../test/render-with-query'
import { createLocalProgressStore } from '../features/progress/local-progress-store'
import { HomePage } from './HomePage'

const helloEntry: PronunciationEntry = {
  text: 'hello',
  kind: 'word',
  locale: 'en-US',
  ipa: '/həˈloʊ/',
  syllables: [
    { text: 'hel', stressed: false },
    { text: 'lo', stressed: true },
  ],
  translation: 'hola',
  example: 'Hello, it is nice to meet you.',
}
const helloResult: PronunciationResult = { entry: helloEntry, audio: [] }

describe('HomePage', () => {
  it('permite elegir un ejemplo sin enviar la consulta automáticamente', async () => {
    const user = userEvent.setup()
    const lookup = vi.fn<LookupPronunciation>()
    renderWithQuery(<HomePage lookupPronunciation={lookup} />)

    await user.click(screen.getByRole('button', { name: 'hello' }))

    expect(
      screen.getByRole('textbox', { name: 'Palabra o frase en inglés' }),
    ).toHaveValue('hello')
    expect(lookup).not.toHaveBeenCalled()
  })

  it('valida que exista una palabra antes de consultar', async () => {
    const user = userEvent.setup()
    renderWithQuery(<HomePage />)

    await user.click(screen.getByRole('button', { name: 'Preparar pronunciación' }))

    expect(
      screen.getByText('Escribe una palabra o frase para continuar.'),
    ).toHaveAttribute('role', 'alert')
  })

  it.each([
    ['a'.repeat(121), 'Usa como máximo 120 caracteres.'],
    ['hello\u0085world', 'El texto contiene caracteres no permitidos.'],
  ])('aplica en la web los límites compartidos con la API', async (text, message) => {
    const user = userEvent.setup()
    const lookup = vi.fn<LookupPronunciation>()
    renderWithQuery(<HomePage lookupPronunciation={lookup} />)
    const textbox = screen.getByRole('textbox', { name: 'Palabra o frase en inglés' })

    fireEvent.change(textbox, { target: { value: text } })
    await user.click(screen.getByRole('button', { name: 'Preparar pronunciación' }))

    expect(screen.getByText(message)).toHaveAttribute('role', 'alert')
    expect(lookup).not.toHaveBeenCalled()
  })

  it('muestra carga, datos educativos y los tres modos', async () => {
    const user = userEvent.setup()
    const lookup: LookupPronunciation = async () => {
      await new Promise((resolve) => window.setTimeout(resolve, 20))
      return helloResult
    }
    const play = vi.fn(async () => ({ source: 'provider' as const, usedFallback: false }))
    renderWithQuery(<HomePage lookupPronunciation={lookup} playPronunciation={play} />)

    await user.type(
      screen.getByRole('textbox', { name: 'Palabra o frase en inglés' }),
      'hello',
    )
    await user.click(screen.getByRole('button', { name: 'Preparar pronunciación' }))

    expect(screen.getAllByText('Preparando tu guía…')).toHaveLength(2)
    expect(
      await screen.findByRole('region', { name: 'Guía de pronunciación para hello' }),
    ).toBeInTheDocument()
    expect(screen.getByText('/həˈloʊ/')).toBeInTheDocument()

    const modeButtons = [
      screen.getByRole('button', { name: 'Escuchar pronunciación natural' }),
      screen.getByRole('button', { name: 'Escuchar pronunciación lenta' }),
      screen.getByRole('button', { name: 'Escuchar en modo profesor' }),
    ]
    expect(modeButtons).toHaveLength(3)

    await user.click(modeButtons[0]!)
    await waitFor(() => expect(play).toHaveBeenCalledWith('natural'))
  })

  it('cuenta una repetición y permite comenzar otra práctica', async () => {
    const user = userEvent.setup()
    const store = createLocalProgressStore()
    renderWithQuery(
      <HomePage
        lookupPronunciation={async () => helloResult}
        playPronunciation={async () => ({ source: 'provider', usedFallback: false })}
        progressStore={store}
      />,
    )
    const textbox = screen.getByRole('textbox', {
      name: 'Palabra o frase en inglés',
    })
    await user.type(textbox, 'hello')
    await user.click(screen.getByRole('button', { name: 'Preparar pronunciación' }))
    await screen.findByRole('region', { name: 'Guía de pronunciación para hello' })

    await user.click(
      screen.getByRole('button', { name: 'Escuchar pronunciación natural' }),
    )
    expect(await screen.findByText('1 repetición')).toBeInTheDocument()

    await user.click(
      screen.getByRole('button', { name: 'Practicar otra palabra o frase' }),
    )
    expect(textbox).toHaveValue('')
    await waitFor(() => expect(textbox).toHaveFocus())
    expect(
      screen.queryByRole('region', { name: 'Guía de pronunciación para hello' }),
    ).toBeNull()
  })

  it('presenta un mensaje recuperable cuando la consulta falla', async () => {
    const user = userEvent.setup()
    const lookup = vi
      .fn<LookupPronunciation>()
      .mockRejectedValue(new Error('fallo simulado'))
    renderWithQuery(<HomePage lookupPronunciation={lookup} />)

    await user.type(
      screen.getByRole('textbox', { name: 'Palabra o frase en inglés' }),
      'hello',
    )
    await user.click(screen.getByRole('button', { name: 'Preparar pronunciación' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'No pudimos preparar la guía',
    )
  })

  it('permite reintentar después de un error', async () => {
    const user = userEvent.setup()
    const lookup = vi
      .fn<LookupPronunciation>()
      .mockRejectedValueOnce(new Error('fallo temporal'))
      .mockResolvedValueOnce(helloResult)
    renderWithQuery(<HomePage lookupPronunciation={lookup} />)

    await user.type(
      screen.getByRole('textbox', { name: 'Palabra o frase en inglés' }),
      'hello',
    )
    await user.click(screen.getByRole('button', { name: 'Preparar pronunciación' }))
    expect(await screen.findByRole('alert')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Preparar pronunciación' }))
    expect(
      await screen.findByRole('region', { name: 'Guía de pronunciación para hello' }),
    ).toBeInTheDocument()
    expect(lookup).toHaveBeenCalledTimes(2)
  })

  it('cancela la solicitud activa al desmontar la pantalla', async () => {
    const user = userEvent.setup()
    let receivedSignal: AbortSignal | undefined
    const lookup: LookupPronunciation = async (_text, signal) => {
      receivedSignal = signal
      return await new Promise<PronunciationResult>((_resolve, reject) => {
        signal?.addEventListener('abort', () => {
          reject(new DOMException('Solicitud cancelada.', 'AbortError'))
        })
      })
    }
    const view = renderWithQuery(<HomePage lookupPronunciation={lookup} />)

    await user.type(
      screen.getByRole('textbox', { name: 'Palabra o frase en inglés' }),
      'hello',
    )
    await user.click(screen.getByRole('button', { name: 'Preparar pronunciación' }))
    await waitFor(() => expect(receivedSignal).toBeDefined())

    view.unmount()
    expect(receivedSignal?.aborted).toBe(true)
  })
})
