export type WebSpeechErrorCode =
  'UNSUPPORTED' | 'VOICE_UNAVAILABLE' | 'PLAYBACK_FAILED' | 'CANCELLED'

export class WebSpeechError extends Error {
  public constructor(
    public readonly code: WebSpeechErrorCode,
    message: string,
  ) {
    super(message)
    this.name = 'WebSpeechError'
  }
}

export interface WebSpeechVoice {
  voiceURI: string
  name: string
  lang: string
  default: boolean
  localService: boolean
}

export interface WebSpeechRequest {
  text: string
  rate: number
  voiceURI?: string | undefined
}

export interface WebSpeechAdapter {
  isSupported(): boolean
  getVoices(): readonly WebSpeechVoice[]
  subscribeToVoiceChanges(listener: () => void): () => void
  speak(request: WebSpeechRequest): Promise<void>
  cancel(): void
}

interface SpeechSynthesisLike {
  getVoices(): readonly SpeechSynthesisVoice[]
  speak(utterance: SpeechSynthesisUtterance): void
  cancel(): void
  addEventListener(type: 'voiceschanged', listener: () => void): void
  removeEventListener(type: 'voiceschanged', listener: () => void): void
}

interface WebSpeechDependencies {
  synthesis?: SpeechSynthesisLike | undefined
  createUtterance?: ((text: string) => SpeechSynthesisUtterance) | undefined
}

function readBrowserDependencies(): WebSpeechDependencies {
  if (
    typeof window === 'undefined' ||
    window.speechSynthesis === undefined ||
    typeof window.SpeechSynthesisUtterance !== 'function'
  ) {
    return {}
  }

  return {
    synthesis: window.speechSynthesis,
    createUtterance: (text) => new window.SpeechSynthesisUtterance(text),
  }
}

function toPublicVoice(voice: SpeechSynthesisVoice): WebSpeechVoice {
  return {
    voiceURI: voice.voiceURI,
    name: voice.name,
    lang: voice.lang,
    default: voice.default,
    localService: voice.localService,
  }
}

/** Encapsula Web Speech para que la UI no dependa de objetos globales del navegador. */
export function createWebSpeechAdapter(
  dependencies: WebSpeechDependencies = readBrowserDependencies(),
): WebSpeechAdapter {
  const { synthesis, createUtterance } = dependencies
  const isSupported = () => synthesis !== undefined && createUtterance !== undefined

  return {
    isSupported,
    getVoices() {
      return synthesis?.getVoices().map(toPublicVoice) ?? []
    },
    subscribeToVoiceChanges(listener) {
      if (synthesis === undefined) {
        return () => undefined
      }

      synthesis.addEventListener('voiceschanged', listener)
      return () => synthesis.removeEventListener('voiceschanged', listener)
    },
    speak(request) {
      if (synthesis === undefined || createUtterance === undefined) {
        return Promise.reject(
          new WebSpeechError(
            'UNSUPPORTED',
            'Este navegador no ofrece síntesis de voz compatible.',
          ),
        )
      }

      if (!Number.isFinite(request.rate) || request.rate < 0.5 || request.rate > 2) {
        return Promise.reject(
          new WebSpeechError('PLAYBACK_FAILED', 'La velocidad de voz no es válida.'),
        )
      }

      const availableVoices = synthesis.getVoices()
      const selectedVoice = request.voiceURI
        ? availableVoices.find((voice) => voice.voiceURI === request.voiceURI)
        : undefined

      if (request.voiceURI !== undefined && selectedVoice === undefined) {
        return Promise.reject(
          new WebSpeechError(
            'VOICE_UNAVAILABLE',
            'La voz seleccionada ya no está disponible.',
          ),
        )
      }

      return new Promise<void>((resolve, reject) => {
        const utterance = createUtterance(request.text)
        utterance.lang = 'en-US'
        utterance.rate = request.rate
        utterance.voice = selectedVoice ?? null
        utterance.onend = () => resolve()
        utterance.onerror = (event) => {
          reject(
            new WebSpeechError(
              event.error === 'canceled' || event.error === 'interrupted'
                ? 'CANCELLED'
                : 'PLAYBACK_FAILED',
              event.error === 'canceled' || event.error === 'interrupted'
                ? 'La reproducción fue cancelada.'
                : 'El navegador no pudo reproducir la voz.',
            ),
          )
        }

        try {
          synthesis.speak(utterance)
        } catch {
          reject(
            new WebSpeechError(
              'PLAYBACK_FAILED',
              'El navegador no pudo iniciar la reproducción.',
            ),
          )
        }
      })
    },
    cancel() {
      synthesis?.cancel()
    },
  }
}
