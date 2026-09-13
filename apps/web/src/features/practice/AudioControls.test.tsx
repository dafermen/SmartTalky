import userEvent from '@testing-library/user-event'
import { act, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { AudioControls } from './AudioControls'
import type { PlaybackResult, PlayPronunciation } from './types'

describe('AudioControls', () => {
  it('envía una modalidad distinta desde cada botón', async () => {
    const user = userEvent.setup()
    const play: PlayPronunciation = vi.fn().mockResolvedValue({
      source: 'web-speech',
      usedFallback: true,
    })
    render(<AudioControls playPronunciation={play} />)

    await user.click(
      screen.getByRole('button', { name: 'Escuchar pronunciación natural' }),
    )
    await user.click(screen.getByRole('button', { name: 'Escuchar pronunciación lenta' }))
    await user.click(screen.getByRole('button', { name: 'Escuchar en modo profesor' }))

    expect(play).toHaveBeenNthCalledWith(1, 'natural')
    expect(play).toHaveBeenNthCalledWith(2, 'slow')
    expect(play).toHaveBeenNthCalledWith(3, 'teacher')
  })

  it('anuncia reproducción y bloquea llamadas simultáneas', async () => {
    const user = userEvent.setup()
    let finishPlayback: (() => void) | undefined
    const play: PlayPronunciation = vi.fn(
      () =>
        new Promise<PlaybackResult>((resolve) => {
          finishPlayback = () => resolve({ source: 'web-speech', usedFallback: true })
        }),
    )
    render(<AudioControls playPronunciation={play} />)

    const naturalButton = screen.getByRole('button', {
      name: 'Escuchar pronunciación natural',
    })
    await user.click(naturalButton)

    expect(naturalButton).toHaveAttribute('aria-pressed', 'true')
    expect(
      screen.getByRole('button', { name: 'Escuchar pronunciación lenta' }),
    ).toBeDisabled()
    expect(screen.getByText('Reproduciendo…')).toBeInTheDocument()

    await act(async () => {
      finishPlayback?.()
    })
    await waitFor(() => expect(naturalButton).toHaveAttribute('aria-pressed', 'false'))
    expect(
      screen.getByText('Audio reproducido con la voz gratuita de este dispositivo.'),
    ).toBeInTheDocument()
  })

  it('presenta el fallo y permite volver a intentar', async () => {
    const user = userEvent.setup()
    const play: PlayPronunciation = vi
      .fn()
      .mockRejectedValueOnce(new Error('fallo interno'))
      .mockResolvedValueOnce({ source: 'provider', usedFallback: false })
    render(<AudioControls playPronunciation={play} />)

    const button = screen.getByRole('button', {
      name: 'Escuchar pronunciación natural',
    })
    await user.click(button)
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'No pudimos reproducir el audio',
    )

    await user.click(button)
    expect(await screen.findByRole('status')).toHaveTextContent(
      'Audio principal de SmartTalky reproducido.',
    )
    expect(play).toHaveBeenCalledTimes(2)
  })

  it('cuenta únicamente reproducciones completadas', async () => {
    const user = userEvent.setup()
    const onPlayed = vi.fn()
    const play: PlayPronunciation = vi
      .fn()
      .mockRejectedValueOnce(new Error())
      .mockResolvedValueOnce({ source: 'provider', usedFallback: false })
    render(<AudioControls playPronunciation={play} onPlayed={onPlayed} />)
    const button = screen.getByRole('button', {
      name: 'Escuchar pronunciación natural',
    })

    await user.click(button)
    expect(onPlayed).not.toHaveBeenCalled()
    await user.click(button)
    expect(onPlayed).toHaveBeenCalledWith('natural')
  })
})
