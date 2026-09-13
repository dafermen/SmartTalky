import type { PronunciationAudio } from '@smarttalky/types'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { WebSpeechAdapter } from './web-speech-adapter'
import {
  createPronunciationPlayer,
  createHtmlAudioPlayer,
  PronunciationPlaybackError,
  type ProviderAudioPlayer,
} from './pronunciation-player'

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

const audio: PronunciationAudio = {
  key: 'a'.repeat(64),
  mode: 'natural',
  mimeType: 'audio/wav',
  byteLength: 44,
}

function createWebSpeech(supported = true): WebSpeechAdapter {
  return {
    isSupported: () => supported,
    getVoices: () => [],
    subscribeToVoiceChanges: () => () => undefined,
    speak: vi.fn(async () => undefined),
    cancel: vi.fn(),
  }
}

function createProvider(play = vi.fn(async () => undefined)): ProviderAudioPlayer {
  return { play }
}

describe('createPronunciationPlayer', () => {
  it('prefiere el audio principal cuando funciona', async () => {
    const provider = createProvider()
    const webSpeech = createWebSpeech()
    const play = createPronunciationPlayer({ providerAudioPlayer: provider, webSpeech })

    await expect(
      play({ text: 'hello', mode: 'natural', audio: [audio], rate: 1 }),
    ).resolves.toEqual({ source: 'provider', usedFallback: false })
    expect(provider.play).toHaveBeenCalledWith(audio)
    expect(webSpeech.speak).not.toHaveBeenCalled()
  })

  it('recupera con Web Speech cuando el audio principal falla', async () => {
    const provider = createProvider(vi.fn().mockRejectedValue(new Error('fallo')))
    const webSpeech = createWebSpeech()
    const play = createPronunciationPlayer({ providerAudioPlayer: provider, webSpeech })

    await expect(
      play({ text: 'hello', mode: 'natural', audio: [audio], rate: 1 }),
    ).resolves.toEqual({ source: 'web-speech', usedFallback: true })
    expect(webSpeech.speak).toHaveBeenCalledWith({
      text: 'hello',
      rate: 1,
      voiceURI: undefined,
    })
  })

  it('evita reproducir el WAV simulado y usa directamente la voz gratuita', async () => {
    const provider = createProvider()
    const webSpeech = createWebSpeech()
    const play = createPronunciationPlayer({ providerAudioPlayer: provider, webSpeech })

    await expect(
      play({
        text: 'hello',
        mode: 'natural',
        audio: [{ ...audio, key: 'mock-natural' }],
        rate: 1,
      }),
    ).resolves.toEqual({ source: 'web-speech', usedFallback: true })
    expect(provider.play).not.toHaveBeenCalled()
  })

  it('hace claramente más lenta la modalidad lenta', async () => {
    const webSpeech = createWebSpeech()
    const play = createPronunciationPlayer({
      providerAudioPlayer: createProvider(),
      webSpeech,
    })

    await play({ text: 'hello', mode: 'slow', audio: [], rate: 1 })

    expect(webSpeech.speak).toHaveBeenCalledWith({
      text: 'hello',
      rate: 0.75,
      voiceURI: undefined,
    })
  })

  it('aplica natural, sílabas lentas y natural en modo profesor', async () => {
    const webSpeech = createWebSpeech()
    const play = createPronunciationPlayer({
      providerAudioPlayer: createProvider(),
      webSpeech,
    })

    await play({
      text: 'hello',
      mode: 'teacher',
      audio: [],
      rate: 1,
      segments: ['hel', 'lo'],
    })

    expect(webSpeech.speak).toHaveBeenNthCalledWith(1, {
      text: 'hello',
      rate: 1,
      voiceURI: undefined,
    })
    expect(webSpeech.speak).toHaveBeenNthCalledWith(2, {
      text: 'hel',
      rate: 0.75,
      voiceURI: undefined,
    })
    expect(webSpeech.speak).toHaveBeenNthCalledWith(3, {
      text: 'lo',
      rate: 0.75,
      voiceURI: undefined,
    })
    expect(webSpeech.speak).toHaveBeenNthCalledWith(4, {
      text: 'hello',
      rate: 1,
      voiceURI: undefined,
    })
  })

  it('presenta un error seguro si tampoco existe respaldo', async () => {
    const play = createPronunciationPlayer({
      providerAudioPlayer: createProvider(
        vi.fn().mockRejectedValue(new Error('fallo privado')),
      ),
      webSpeech: createWebSpeech(false),
    })

    await expect(
      play({ text: 'hello', mode: 'natural', audio: [audio], rate: 1 }),
    ).rejects.toBeInstanceOf(PronunciationPlaybackError)
  })
})

describe('createHtmlAudioPlayer', () => {
  it('resuelve únicamente cuando el elemento de audio termina', async () => {
    let ended: (() => void) | undefined
    const play = vi.fn(async () => undefined)
    vi.stubGlobal(
      'Audio',
      class {
        public constructor(public readonly src: string) {}
        public addEventListener(type: string, listener: () => void) {
          if (type === 'ended') ended = listener
        }
        public play = play
        public pause = vi.fn()
      },
    )
    const playback = createHtmlAudioPlayer().play(audio)

    expect(play).toHaveBeenCalledOnce()
    expect(ended).toBeTypeOf('function')
    ended?.()
    await expect(playback).resolves.toBeUndefined()
  })

  it('convierte rechazo del elemento en error seguro', async () => {
    vi.stubGlobal(
      'Audio',
      class {
        public addEventListener() {}
        public play = vi.fn().mockRejectedValue(new Error('detalle privado'))
        public pause = vi.fn()
      },
    )

    await expect(createHtmlAudioPlayer().play(audio)).rejects.toBeInstanceOf(
      PronunciationPlaybackError,
    )
  })

  it('abandona un audio bloqueado para permitir el respaldo', async () => {
    vi.useFakeTimers()
    const pause = vi.fn()
    vi.stubGlobal(
      'Audio',
      class {
        public addEventListener() {}
        public play = vi.fn(async () => undefined)
        public pause = pause
      },
    )

    const playback = createHtmlAudioPlayer(1_000).play(audio)
    const rejection = expect(playback).rejects.toBeInstanceOf(PronunciationPlaybackError)
    await vi.advanceTimersByTimeAsync(1_000)

    await rejection
    expect(pause).toHaveBeenCalledOnce()
  })
})
