import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import type { WebSpeechAdapter } from '../speech/web-speech-adapter'
import { createLocalProgressStore } from './local-progress-store'
import { PracticeSettings } from './PracticeSettings'

const adapter: WebSpeechAdapter = {
  isSupported: () => true,
  getVoices: () => [
    {
      voiceURI: 'us-voice',
      name: 'US voice',
      lang: 'en-US',
      default: true,
      localService: true,
    },
  ],
  subscribeToVoiceChanges: () => () => undefined,
  speak: vi.fn(async () => undefined),
  cancel: vi.fn(),
}

describe('PracticeSettings', () => {
  it('muestra defaults y conserva voz, velocidad y modalidad', async () => {
    const user = userEvent.setup()
    const store = createLocalProgressStore()
    const view = render(<PracticeSettings adapter={adapter} store={store} />)

    expect(screen.getByLabelText('Velocidad')).toHaveValue('1')
    expect(screen.getByLabelText('Modalidad preferida')).toHaveValue('natural')

    await user.selectOptions(screen.getByLabelText('Voz del dispositivo'), 'us-voice')
    await user.selectOptions(screen.getByLabelText('Velocidad'), '1.25')
    await user.selectOptions(screen.getByLabelText('Modalidad preferida'), 'teacher')

    view.unmount()
    render(<PracticeSettings adapter={adapter} store={store} />)
    expect(screen.getByLabelText('Voz del dispositivo')).toHaveValue('us-voice')
    expect(screen.getByLabelText('Velocidad')).toHaveValue('1.25')
    expect(screen.getByLabelText('Modalidad preferida')).toHaveValue('teacher')
  })
})
