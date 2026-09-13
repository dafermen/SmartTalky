import type { LookupPronunciation, PronunciationEntry } from './types'

const samples: Record<string, PronunciationEntry> = {
  hello: {
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
  },
  comfortable: {
    text: 'comfortable',
    kind: 'word',
    locale: 'en-US',
    ipa: '/ˈkʌm.fɚ.t̬ə.bəl/',
    syllables: [
      { text: 'com', stressed: true },
      { text: 'fort', stressed: false },
      { text: 'a', stressed: false },
      { text: 'ble', stressed: false },
    ],
    translation: 'cómodo o cómoda',
    example: 'These shoes are very comfortable.',
  },
}

function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds)
  })
}

/** Simula una consulta educativa hasta que exista el contrato de API de la Fase 3. */
export const lookupMockPronunciation: LookupPronunciation = async (text) => {
  await wait(450)
  const normalizedText = text.trim().replace(/\s+/g, ' ')
  const entry = samples[normalizedText.toLowerCase()] ?? {
    text: normalizedText,
    kind: normalizedText.includes(' ') ? 'phrase' : 'word',
    locale: 'en-US',
  }

  return { entry, audio: [] }
}
