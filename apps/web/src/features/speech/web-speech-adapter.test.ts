import { describe, expect, it, vi } from 'vitest'

import { createWebSpeechAdapter, WebSpeechError } from './web-speech-adapter'

interface FakeUtterance {
  text: string
  lang: string
  rate: number
  voice: SpeechSynthesisVoice | null
  onend: (() => void) | null
  onerror: ((event: SpeechSynthesisErrorEvent) => void) | null
}

function createVoice(overrides: Partial<SpeechSynthesisVoice> = {}) {
  return {
    default: false,
    lang: 'en-US',
    localService: true,
    name: 'Test voice',
    voiceURI: 'test-voice',
    ...overrides,
  } satisfies SpeechSynthesisVoice
}

function createFakes(voices: readonly SpeechSynthesisVoice[] = [createVoice()]) {
  let utterance: FakeUtterance | undefined
  const listeners = new Set<() => void>()
  const synthesis = {
    getVoices: vi.fn(() => voices),
    speak: vi.fn(),
    cancel: vi.fn(),
    addEventListener: vi.fn((_type: 'voiceschanged', listener: () => void) => {
      listeners.add(listener)
    }),
    removeEventListener: vi.fn((_type: 'voiceschanged', listener: () => void) => {
      listeners.delete(listener)
    }),
  }
  const createUtterance = vi.fn((text: string) => {
    utterance = {
      text,
      lang: '',
      rate: 1,
      voice: null,
      onend: null,
      onerror: null,
    }
    return utterance as unknown as SpeechSynthesisUtterance
  })

  return {
    synthesis,
    createUtterance,
    getUtterance: () => utterance,
    emitVoicesChanged: () => listeners.forEach((listener) => listener()),
  }
}

describe('createWebSpeechAdapter', () => {
  it('informa falta de soporte sin tocar objetos globales', async () => {
    const adapter = createWebSpeechAdapter({})

    expect(adapter.isSupported()).toBe(false)
    expect(adapter.getVoices()).toEqual([])
    await expect(adapter.speak({ text: 'hello', rate: 1 })).rejects.toMatchObject({
      code: 'UNSUPPORTED',
    })
  })

  it('reproduce en en-US con velocidad y voz seleccionadas', async () => {
    const voice = createVoice()
    const fakes = createFakes([voice])
    const adapter = createWebSpeechAdapter(fakes)

    expect(adapter.isSupported()).toBe(true)
    expect(adapter.getVoices()).toEqual([
      {
        voiceURI: 'test-voice',
        name: 'Test voice',
        lang: 'en-US',
        default: false,
        localService: true,
      },
    ])

    const playback = adapter.speak({
      text: 'comfortable',
      rate: 0.8,
      voiceURI: 'test-voice',
    })
    const utterance = fakes.getUtterance()
    expect(utterance).toMatchObject({
      text: 'comfortable',
      lang: 'en-US',
      rate: 0.8,
      voice,
    })
    utterance?.onend?.()

    await expect(playback).resolves.toBeUndefined()
  })

  it('notifica cambios de voces y permite cancelar la suscripción', () => {
    const fakes = createFakes()
    const adapter = createWebSpeechAdapter(fakes)
    const listener = vi.fn()

    const unsubscribe = adapter.subscribeToVoiceChanges(listener)
    fakes.emitVoicesChanged()
    expect(listener).toHaveBeenCalledOnce()

    unsubscribe()
    fakes.emitVoicesChanged()
    expect(listener).toHaveBeenCalledOnce()
  })

  it('convierte voz ausente, fallo y cancelación en errores controlados', async () => {
    const fakes = createFakes()
    const adapter = createWebSpeechAdapter(fakes)

    await expect(
      adapter.speak({ text: 'hello', rate: 1, voiceURI: 'missing' }),
    ).rejects.toMatchObject({ code: 'VOICE_UNAVAILABLE' })

    const failedPlayback = adapter.speak({ text: 'hello', rate: 1 })
    fakes
      .getUtterance()
      ?.onerror?.({ error: 'synthesis-failed' } as SpeechSynthesisErrorEvent)
    await expect(failedPlayback).rejects.toBeInstanceOf(WebSpeechError)

    const cancelledPlayback = adapter.speak({ text: 'hello', rate: 1 })
    fakes.getUtterance()?.onerror?.({ error: 'canceled' } as SpeechSynthesisErrorEvent)
    await expect(cancelledPlayback).rejects.toMatchObject({ code: 'CANCELLED' })

    adapter.cancel()
    expect(fakes.synthesis.cancel).toHaveBeenCalledOnce()
  })

  it('rechaza velocidades fuera del rango seguro', async () => {
    const adapter = createWebSpeechAdapter(createFakes())

    await expect(adapter.speak({ text: 'hello', rate: 3 })).rejects.toMatchObject({
      code: 'PLAYBACK_FAILED',
    })
  })
})
