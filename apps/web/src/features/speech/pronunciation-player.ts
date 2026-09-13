import type { PronunciationAudio, PronunciationMode } from '@smarttalky/types'

import { resolveApiUrl } from '../../config/api-url'
import type { PlaybackResult } from '../practice/types'
import { createWebSpeechAdapter, type WebSpeechAdapter } from './web-speech-adapter'

export class PronunciationPlaybackError extends Error {
  public constructor(message = 'No fue posible reproducir la pronunciación.') {
    super(message)
    this.name = 'PronunciationPlaybackError'
  }
}

export interface ProviderAudioPlayer {
  play(audio: PronunciationAudio): Promise<void>
}

export interface PronunciationPlaybackRequest {
  text: string
  mode: PronunciationMode
  audio: readonly PronunciationAudio[]
  rate: number
  segments?: readonly string[] | undefined
  voiceURI?: string | undefined
}

interface PronunciationPlayerDependencies {
  providerAudioPlayer: ProviderAudioPlayer
  webSpeech: WebSpeechAdapter
}

const SLOW_RATE_FACTOR = 0.75

export function createHtmlAudioPlayer(timeoutMs = 30_000): ProviderAudioPlayer {
  return {
    play(audio) {
      return new Promise<void>((resolve, reject) => {
        const element = new Audio(
          resolveApiUrl(`/api/v1/audio/${encodeURIComponent(audio.key)}`),
        )
        let settled = false
        const settle = (result: 'success' | 'failure') => {
          if (settled) return
          settled = true
          window.clearTimeout(timeoutId)
          if (result === 'success') resolve()
          else reject(new PronunciationPlaybackError())
        }
        const fail = () => settle('failure')

        element.addEventListener('ended', () => settle('success'), { once: true })
        element.addEventListener('error', fail, { once: true })
        element.addEventListener('stalled', fail, { once: true })
        const timeoutId = window.setTimeout(() => {
          element.pause()
          fail()
        }, timeoutMs)
        void element.play().catch(fail)
      })
    },
  }
}

async function speakWithMode(
  webSpeech: WebSpeechAdapter,
  request: PronunciationPlaybackRequest,
) {
  const speak = (text: string, rate: number) =>
    webSpeech.speak({
      text,
      rate: Math.max(0.5, Math.min(2, rate)),
      voiceURI: request.voiceURI,
    })

  if (request.mode === 'teacher') {
    const segments =
      request.segments
        ?.map((segment) => segment.trim())
        .filter((segment) => segment.length > 0) ?? []

    await speak(request.text, request.rate)
    if (segments.length > 1) {
      for (const segment of segments) {
        await speak(segment, request.rate * SLOW_RATE_FACTOR)
      }
    } else {
      await speak(request.text, request.rate * SLOW_RATE_FACTOR)
    }
    await speak(request.text, request.rate)
    return
  }

  await speak(
    request.text,
    request.mode === 'slow' ? request.rate * SLOW_RATE_FACTOR : request.rate,
  )
}

/** Prefiere el audio del backend y usa Web Speech de forma explícita al faltar o fallar. */
export function createPronunciationPlayer({
  providerAudioPlayer,
  webSpeech,
}: PronunciationPlayerDependencies) {
  return async (request: PronunciationPlaybackRequest): Promise<PlaybackResult> => {
    const providerAudio = request.audio.find((audio) => audio.mode === request.mode)
    const isSimulatedAudio = providerAudio?.key.startsWith('mock-') ?? false
    let providerFailed = false

    if (providerAudio !== undefined && !isSimulatedAudio) {
      try {
        await providerAudioPlayer.play(providerAudio)
        return { source: 'provider', usedFallback: false }
      } catch {
        providerFailed = true
      }
    }

    if (!webSpeech.isSupported()) {
      throw new PronunciationPlaybackError(
        providerFailed
          ? 'El audio principal falló y este navegador no ofrece una voz de respaldo.'
          : 'Este navegador no ofrece una voz compatible para la pronunciación.',
      )
    }

    try {
      await speakWithMode(webSpeech, request)
      return {
        source: 'web-speech',
        usedFallback: providerFailed || providerAudio === undefined || isSimulatedAudio,
      }
    } catch {
      throw new PronunciationPlaybackError()
    }
  }
}

export const playPronunciation = createPronunciationPlayer({
  providerAudioPlayer: createHtmlAudioPlayer(),
  webSpeech: createWebSpeechAdapter(),
})
