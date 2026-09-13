import userEvent from '@testing-library/user-event'
import { act, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'

import type { WebSpeechAdapter, WebSpeechVoice } from './web-speech-adapter'
import { VoiceSettings } from './VoiceSettings'

function createAdapter(initialVoices: readonly WebSpeechVoice[]) {
  let voices = initialVoices
  const listeners = new Set<() => void>()
  const adapter: WebSpeechAdapter = {
    isSupported: () => true,
    getVoices: () => voices,
    subscribeToVoiceChanges(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    speak: vi.fn(async () => undefined),
    cancel: vi.fn(),
  }

  return {
    adapter,
    update(nextVoices: readonly WebSpeechVoice[]) {
      voices = nextVoices
      listeners.forEach((listener) => listener())
    },
  }
}

const englishVoice: WebSpeechVoice = {
  voiceURI: 'english-us',
  name: 'English US',
  lang: 'en-US',
  default: true,
  localService: true,
}

function StatefulSettings({ adapter }: { adapter: WebSpeechAdapter }) {
  const [voiceURI, setVoiceURI] = useState<string>()
  return (
    <VoiceSettings adapter={adapter} voiceURI={voiceURI} onVoiceChange={setVoiceURI} />
  )
}

describe('VoiceSettings', () => {
  it('muestra estado vacío y reacciona cuando aparece una voz en-US', async () => {
    const source = createAdapter([])
    render(<StatefulSettings adapter={source.adapter} />)

    expect(
      screen.getByText(/No encontramos voces en inglés estadounidense/),
    ).toBeInTheDocument()

    act(() => source.update([englishVoice]))
    expect(screen.getByRole('combobox', { name: 'Voz del dispositivo' })).toHaveValue('')
    expect(
      screen.getByRole('option', { name: 'English US · predeterminada' }),
    ).toBeInTheDocument()
  })

  it('filtra otros idiomas y permite elegir una voz disponible', async () => {
    const user = userEvent.setup()
    const source = createAdapter([
      { ...englishVoice, lang: 'es-US', voiceURI: 'spanish', name: 'Español' },
      englishVoice,
    ])
    render(<StatefulSettings adapter={source.adapter} />)

    const select = screen.getByRole('combobox', { name: 'Voz del dispositivo' })
    expect(screen.queryByRole('option', { name: 'Español' })).not.toBeInTheDocument()
    await user.selectOptions(select, 'english-us')
    expect(select).toHaveValue('english-us')
  })

  it('descarta de forma segura una preferencia que desapareció', () => {
    const source = createAdapter([englishVoice])
    const onVoiceChange = vi.fn()
    const view = render(
      <VoiceSettings
        adapter={source.adapter}
        voiceURI="english-us"
        onVoiceChange={onVoiceChange}
      />,
    )

    act(() => source.update([]))
    view.rerender(
      <VoiceSettings
        adapter={source.adapter}
        voiceURI="english-us"
        onVoiceChange={onVoiceChange}
      />,
    )
    expect(onVoiceChange).toHaveBeenCalledWith(undefined)
  })
})
