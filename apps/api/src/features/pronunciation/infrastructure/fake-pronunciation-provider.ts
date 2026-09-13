import type { PronunciationEntry, PronunciationResponse } from '@smarttalky/types'

import {
  FAKE_WAV_BYTES,
  fakeAudioKeyByMode,
} from '../../audio/infrastructure/fake-audio-repository.js'
import type { PronunciationProvider } from '../application/get-pronunciation.js'

const educationalDetails: Record<
  string,
  Omit<PronunciationEntry, 'text' | 'kind' | 'locale'>
> = {
  hello: {
    ipa: '/həˈloʊ/',
    syllables: [
      { text: 'hel', stressed: false },
      { text: 'lo', stressed: true },
    ],
    translation: 'hola',
    example: 'Hello, it is nice to meet you.',
    exampleTranslation: 'Hola, es un gusto conocerte.',
  },
  comfortable: {
    ipa: '/ˈkʌm.fɚ.t̬ə.bəl/',
    syllables: [
      { text: 'com', stressed: true },
      { text: 'fort', stressed: false },
      { text: 'a', stressed: false },
      { text: 'ble', stressed: false },
    ],
    translation: 'cómodo o cómoda',
    example: 'These shoes are very comfortable.',
    exampleTranslation: 'Estos zapatos son muy cómodos.',
  },
}

/** Proveedor determinista de desarrollo; no usa red, archivos ni servicios pagos. */
export const fakePronunciationProvider: PronunciationProvider = {
  async lookup(request): Promise<PronunciationResponse> {
    const details = educationalDetails[request.text.toLocaleLowerCase('en-US')] ?? {}

    return {
      pronunciation: {
        text: request.text,
        kind: request.text.includes(' ') ? 'phrase' : 'word',
        locale: request.locale,
        ...details,
      },
      audio: request.modes.map((mode) => ({
        key: fakeAudioKeyByMode[mode],
        mode,
        mimeType: 'audio/wav',
        byteLength: FAKE_WAV_BYTES.byteLength,
      })),
    }
  },
}
