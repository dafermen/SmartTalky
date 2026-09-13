import { describe, expect, it } from 'vitest'

import {
  createLocalProgressStore,
  LOCAL_PROGRESS_STORAGE_KEY,
  type StorageLike,
} from './local-progress-store'

function createStorage(initialValue?: string) {
  const values = new Map<string, string>()
  if (initialValue !== undefined) {
    values.set(LOCAL_PROGRESS_STORAGE_KEY, initialValue)
  }
  const storage: StorageLike = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  }
  return { storage, values }
}

describe('createLocalProgressStore', () => {
  it('añade consultas y las persiste localmente', () => {
    const source = createStorage()
    const store = createLocalProgressStore({
      storage: source.storage,
      now: () => new Date('2026-07-18T12:00:00.000Z'),
    })

    store.recordHistory('  Hello   world ')

    expect(store.getSnapshot().history).toEqual([
      {
        id: 'hello world',
        text: 'Hello world',
        locale: 'en-US',
        accessedAt: '2026-07-18T12:00:00.000Z',
      },
    ])
    expect(JSON.parse(source.values.get(LOCAL_PROGRESS_STORAGE_KEY) ?? '')).toEqual(
      store.getSnapshot(),
    )
  })

  it('deduplica sin distinguir mayúsculas y mueve la consulta reciente al inicio', () => {
    let tick = 0
    const store = createLocalProgressStore({
      storage: createStorage().storage,
      now: () => new Date(`2026-07-18T12:00:0${tick++}.000Z`),
    })

    store.recordHistory('hello')
    store.recordHistory('world')
    store.recordHistory('HELLO')

    expect(store.getSnapshot().history.map((item) => item.text)).toEqual([
      'HELLO',
      'world',
    ])
  })

  it('respeta el límite configurado y conserva las consultas más recientes', () => {
    const store = createLocalProgressStore({ historyLimit: 2 })

    store.recordHistory('one')
    store.recordHistory('two')
    store.recordHistory('three')

    expect(store.getSnapshot().history.map((item) => item.text)).toEqual(['three', 'two'])
  })

  it('activa y desactiva favoritos persistentes sin duplicados', () => {
    const source = createStorage()
    const store = createLocalProgressStore({ storage: source.storage })

    expect(store.toggleFavorite('Hello')).toBe(true)
    expect(store.toggleFavorite('HELLO')).toBe(false)
    expect(store.getSnapshot().favorites).toEqual([])

    store.toggleFavorite('Hello')
    const persisted = JSON.parse(source.values.get(LOCAL_PROGRESS_STORAGE_KEY) ?? '') as {
      favorites: unknown[]
    }
    expect(persisted.favorites).toHaveLength(1)
  })

  it('cuenta repeticiones locales por texto sin distinguir mayúsculas', () => {
    const store = createLocalProgressStore({
      now: () => new Date('2026-07-25T12:00:00.000Z'),
    })

    store.recordPractice('Hello')
    store.recordPractice('HELLO')

    expect(store.getSnapshot().practiceCounts).toEqual([
      {
        id: 'hello',
        text: 'HELLO',
        count: 2,
        lastPracticedAt: '2026-07-25T12:00:00.000Z',
      },
    ])
  })

  it('aplica defaults y persiste preferencias válidas', () => {
    const source = createStorage()
    const store = createLocalProgressStore({ storage: source.storage })

    expect(store.getSnapshot().preferences).toEqual({ rate: 1, mode: 'natural' })
    store.updatePreferences({ voiceURI: 'voice-a', rate: 1.25, mode: 'teacher' })

    const restored = createLocalProgressStore({ storage: source.storage })
    expect(restored.getSnapshot().preferences).toEqual({
      voiceURI: 'voice-a',
      rate: 1.25,
      mode: 'teacher',
    })
  })

  it('recupera defaults ante preferencias inválidas', () => {
    const store = createLocalProgressStore()

    store.updatePreferences({ rate: 9 as 1 })
    expect(store.getSnapshot().preferences).toEqual({ rate: 1, mode: 'natural' })
  })

  it('limpia cada colección o restablece todo preservando la selección correcta', () => {
    const store = createLocalProgressStore()
    store.recordHistory('hello')
    store.toggleFavorite('hello')
    store.updatePreferences({ mode: 'teacher' })

    store.clearHistory()
    expect(store.getSnapshot()).toMatchObject({
      history: [],
      favorites: [{ text: 'hello' }],
      preferences: { mode: 'teacher' },
    })

    store.clearFavorites()
    expect(store.getSnapshot().favorites).toEqual([])
    store.clearAll()
    expect(store.getSnapshot().preferences).toEqual({ rate: 1, mode: 'natural' })
  })

  it('continúa en memoria cuando el navegador rechaza la escritura', () => {
    const storage: StorageLike = {
      getItem: () => null,
      setItem: () => {
        throw new DOMException('Bloqueado', 'SecurityError')
      },
    }
    const store = createLocalProgressStore({ storage })

    expect(() => store.recordHistory('hello')).not.toThrow()
    expect(store.getSnapshot().history).toMatchObject([{ text: 'hello' }])
  })

  it('recupera defaults cuando el navegador rechaza la lectura', () => {
    const storage: StorageLike = {
      getItem: () => {
        throw new DOMException('Bloqueado', 'SecurityError')
      },
      setItem: () => undefined,
    }

    expect(createLocalProgressStore({ storage }).getSnapshot()).toMatchObject({
      history: [],
      favorites: [],
      preferences: { rate: 1, mode: 'natural' },
    })
  })
})
