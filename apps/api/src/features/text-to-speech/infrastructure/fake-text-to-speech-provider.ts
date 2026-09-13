import { FAKE_WAV_BYTES } from '../../audio/infrastructure/fake-wav.js'
import {
  TextToSpeechProviderError,
  type TextToSpeechProvider,
} from '../application/text-to-speech-provider.js'

interface FakeTextToSpeechProviderOptions {
  failure?: TextToSpeechProviderError | undefined
}

/** Fake determinista para desarrollar y probar sin red ni servicios pagos. */
export function createFakeTextToSpeechProvider(
  options: FakeTextToSpeechProviderOptions = {},
): TextToSpeechProvider {
  return {
    async synthesize(_request, signal) {
      if (signal?.aborted === true) {
        throw new TextToSpeechProviderError(
          'REQUEST_ABORTED',
          'La síntesis simulada fue cancelada.',
          { retryable: false, cause: signal.reason },
        )
      }

      if (options.failure !== undefined) {
        throw options.failure
      }

      return {
        bytes: FAKE_WAV_BYTES.slice(),
        metadata: {
          mimeType: 'audio/wav',
          provider: 'fake',
          model: 'fake-tts-v1',
          voice: 'fake-en-us',
          durationMs: 100,
        },
      }
    },
  }
}

export const fakeTextToSpeechProvider = createFakeTextToSpeechProvider()
