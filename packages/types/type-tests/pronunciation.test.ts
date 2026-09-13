import {
  PRONUNCIATION_MODES,
  type PronunciationMode,
  type PronunciationResponse,
} from '../src/index.js'

const response = {
  pronunciation: {
    text: 'comfortable',
    kind: 'word',
    locale: 'en-US',
    ipa: '/ˈkʌm.fɚ.t̬ə.bəl/',
    syllables: [{ text: 'com', stressed: true }],
  },
  audio: [
    {
      key: 'opaque-audio-key',
      mode: 'natural',
      mimeType: 'audio/mpeg',
      byteLength: 1024,
    },
  ],
} satisfies PronunciationResponse

function acceptMode(mode: PronunciationMode): PronunciationMode {
  return mode
}

for (const mode of PRONUNCIATION_MODES) {
  acceptMode(mode)
}

acceptMode(response.audio[0]!.mode)

// @ts-expect-error "fast" no pertenece al contrato del MVP.
acceptMode('fast')

const invalidResponse: PronunciationResponse = {
  ...response,
  audio: [
    {
      ...response.audio[0]!,
      // @ts-expect-error Solo se publican tipos MIME permitidos explícitamente.
      mimeType: 'audio/ogg',
    },
  ],
}

void invalidResponse
