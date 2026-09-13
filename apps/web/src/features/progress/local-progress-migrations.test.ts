import { describe, expect, it } from 'vitest'

import progressV1 from './fixtures/progress-v1.json'
import progressV2 from './fixtures/progress-v2.json'
import {
  createLocalProgressStore,
  LOCAL_PROGRESS_STORAGE_KEY,
  LOCAL_PROGRESS_VERSION,
  type StorageLike,
} from './local-progress-store'

function createStorage(value: unknown) {
  const values = new Map([[LOCAL_PROGRESS_STORAGE_KEY, JSON.stringify(value)]])
  const storage: StorageLike = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, nextValue) => values.set(key, nextValue),
  }
  return { values, storage }
}

describe('migraciones de progreso local', () => {
  it('migra v1 conservando historial y creando los campos posteriores', () => {
    const source = createStorage(progressV1)
    const store = createLocalProgressStore({ storage: source.storage })

    expect(store.getSnapshot()).toMatchObject({
      version: LOCAL_PROGRESS_VERSION,
      history: [{ text: 'hello' }],
      favorites: [],
      preferences: { rate: 1, mode: 'natural' },
    })
    expect(JSON.parse(source.values.get(LOCAL_PROGRESS_STORAGE_KEY) ?? '').version).toBe(
      LOCAL_PROGRESS_VERSION,
    )
  })

  it('migra v2 conservando historial y favoritos', () => {
    const store = createLocalProgressStore({ storage: createStorage(progressV2).storage })

    expect(store.getSnapshot()).toMatchObject({
      version: LOCAL_PROGRESS_VERSION,
      history: [{ text: 'comfortable' }],
      favorites: [{ text: 'hello' }],
      preferences: { rate: 1, mode: 'natural' },
    })
  })

  it('migra v3 agregando contadores sin perder preferencias', () => {
    const store = createLocalProgressStore({
      storage: createStorage({
        version: 3,
        history: [],
        favorites: [],
        preferences: { rate: 1.25, mode: 'teacher' },
      }).storage,
    })

    expect(store.getSnapshot()).toMatchObject({
      version: LOCAL_PROGRESS_VERSION,
      practiceCounts: [],
      preferences: { rate: 1.25, mode: 'teacher' },
    })
  })

  it.each([
    '{json roto',
    JSON.stringify({ version: 99, history: [] }),
    JSON.stringify({ version: 1, history: [{ text: 'incompleto' }] }),
  ])('se recupera sin lanzar ante datos incompatibles', (rawValue) => {
    const storage: StorageLike = {
      getItem: () => rawValue,
      setItem: () => undefined,
    }

    expect(() => createLocalProgressStore({ storage })).not.toThrow()
    expect(createLocalProgressStore({ storage }).getSnapshot()).toMatchObject({
      history: [],
      favorites: [],
      preferences: { rate: 1, mode: 'natural' },
    })
  })
})
