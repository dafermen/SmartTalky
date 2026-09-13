import type { PronunciationMode } from '@smarttalky/types'

export const LOCAL_PROGRESS_STORAGE_KEY = 'smarttalky.local-progress'
export const LOCAL_PROGRESS_VERSION = 4
export const DEFAULT_HISTORY_LIMIT = 20
export const PRACTICE_RATES = [0.75, 1, 1.25] as const

export interface HistoryItem {
  id: string
  text: string
  locale: 'en-US'
  accessedAt: string
}

export interface FavoriteItem {
  id: string
  text: string
  locale: 'en-US'
  createdAt: string
}

export interface PracticeCount {
  id: string
  text: string
  count: number
  lastPracticedAt: string
}

export interface PracticePreferences {
  voiceURI?: string | undefined
  rate: (typeof PRACTICE_RATES)[number]
  mode: PronunciationMode
}

export const DEFAULT_PREFERENCES: PracticePreferences = {
  rate: 1,
  mode: 'natural',
}

export interface LocalProgressState {
  version: typeof LOCAL_PROGRESS_VERSION
  history: readonly HistoryItem[]
  favorites: readonly FavoriteItem[]
  practiceCounts: readonly PracticeCount[]
  preferences: PracticePreferences
}

export interface StorageLike {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

interface LocalProgressStoreOptions {
  storage?: StorageLike | undefined
  historyLimit?: number | undefined
  now?: (() => Date) | undefined
}

function emptyState(): LocalProgressState {
  return {
    version: LOCAL_PROGRESS_VERSION,
    history: [],
    favorites: [],
    practiceCounts: [],
    preferences: { ...DEFAULT_PREFERENCES },
  }
}

function isFavoriteItem(value: unknown): value is FavoriteItem {
  if (typeof value !== 'object' || value === null) return false
  const item = value as Partial<FavoriteItem>
  return (
    typeof item.id === 'string' &&
    typeof item.text === 'string' &&
    item.locale === 'en-US' &&
    typeof item.createdAt === 'string'
  )
}

function readPreferences(value: unknown): PracticePreferences | undefined {
  if (typeof value !== 'object' || value === null) return undefined
  const preferences = value as Partial<PracticePreferences>
  const voiceURI = preferences.voiceURI
  if (
    voiceURI !== undefined &&
    (typeof voiceURI !== 'string' || voiceURI.length === 0 || voiceURI.length > 512)
  ) {
    return undefined
  }
  if (!PRACTICE_RATES.includes(preferences.rate as (typeof PRACTICE_RATES)[number])) {
    return undefined
  }
  if (!['natural', 'slow', 'teacher'].includes(preferences.mode ?? '')) {
    return undefined
  }
  return {
    ...(voiceURI === undefined ? {} : { voiceURI }),
    rate: preferences.rate as PracticePreferences['rate'],
    mode: preferences.mode as PronunciationMode,
  }
}

function isHistoryItem(value: unknown): value is HistoryItem {
  if (typeof value !== 'object' || value === null) return false
  const item = value as Partial<HistoryItem>
  return (
    typeof item.id === 'string' &&
    typeof item.text === 'string' &&
    item.locale === 'en-US' &&
    typeof item.accessedAt === 'string'
  )
}

function isPracticeCount(value: unknown): value is PracticeCount {
  if (typeof value !== 'object' || value === null) return false
  const item = value as Partial<PracticeCount>
  return (
    typeof item.id === 'string' &&
    typeof item.text === 'string' &&
    typeof item.count === 'number' &&
    Number.isSafeInteger(item.count) &&
    item.count > 0 &&
    typeof item.lastPracticedAt === 'string'
  )
}

interface ReadStateResult {
  state: LocalProgressState
  migrated: boolean
}

function migrateState(value: unknown): ReadStateResult | undefined {
  if (typeof value !== 'object' || value === null) return undefined
  const candidate = value as {
    version?: unknown
    history?: unknown
    favorites?: unknown
    preferences?: unknown
    practiceCounts?: unknown
  }
  if (!Array.isArray(candidate.history) || !candidate.history.every(isHistoryItem)) {
    return undefined
  }

  if (candidate.version === 1) {
    return {
      state: {
        version: LOCAL_PROGRESS_VERSION,
        history: candidate.history,
        favorites: [],
        practiceCounts: [],
        preferences: { ...DEFAULT_PREFERENCES },
      },
      migrated: true,
    }
  }

  if (!Array.isArray(candidate.favorites) || !candidate.favorites.every(isFavoriteItem)) {
    return undefined
  }

  if (candidate.version === 2) {
    return {
      state: {
        version: LOCAL_PROGRESS_VERSION,
        history: candidate.history,
        favorites: candidate.favorites,
        practiceCounts: [],
        preferences: { ...DEFAULT_PREFERENCES },
      },
      migrated: true,
    }
  }

  const preferences = readPreferences(candidate.preferences)
  if (preferences === undefined) {
    return undefined
  }

  if (candidate.version === 3) {
    return {
      state: {
        version: LOCAL_PROGRESS_VERSION,
        history: candidate.history,
        favorites: candidate.favorites,
        practiceCounts: [],
        preferences,
      },
      migrated: true,
    }
  }

  if (
    candidate.version !== LOCAL_PROGRESS_VERSION ||
    !Array.isArray(candidate.practiceCounts) ||
    !candidate.practiceCounts.every(isPracticeCount)
  ) {
    return undefined
  }

  return {
    state: {
      version: LOCAL_PROGRESS_VERSION,
      history: candidate.history,
      favorites: candidate.favorites,
      practiceCounts: candidate.practiceCounts,
      preferences,
    },
    migrated: false,
  }
}

function readState(storage?: StorageLike): ReadStateResult {
  if (storage === undefined) return { state: emptyState(), migrated: false }

  try {
    const rawValue = storage.getItem(LOCAL_PROGRESS_STORAGE_KEY)
    if (rawValue === null) return { state: emptyState(), migrated: false }
    const value: unknown = JSON.parse(rawValue)
    return migrateState(value) ?? { state: emptyState(), migrated: false }
  } catch {
    return { state: emptyState(), migrated: false }
  }
}

function historyId(text: string) {
  return text.trim().replace(/\s+/g, ' ').toLocaleLowerCase('en-US')
}

/** Administra progreso local con snapshots estables para React y sin cuentas. */
export function createLocalProgressStore(options: LocalProgressStoreOptions = {}) {
  const historyLimit = options.historyLimit ?? DEFAULT_HISTORY_LIMIT
  const now = options.now ?? (() => new Date())
  const loaded = readState(options.storage)
  let state = loaded.state
  const listeners = new Set<() => void>()

  if (loaded.migrated) {
    try {
      options.storage?.setItem(LOCAL_PROGRESS_STORAGE_KEY, JSON.stringify(state))
    } catch {
      // La migración sigue disponible en memoria aunque falle la escritura.
    }
  }

  const persist = () => {
    try {
      options.storage?.setItem(LOCAL_PROGRESS_STORAGE_KEY, JSON.stringify(state))
    } catch {
      // La sesión continúa en memoria si el navegador bloquea el almacenamiento.
    }
    listeners.forEach((listener) => listener())
  }

  return {
    getSnapshot: () => state,
    subscribe(listener: () => void) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    recordHistory(text: string) {
      const normalizedText = text.trim().replace(/\s+/g, ' ')
      if (normalizedText.length === 0) return
      const id = historyId(normalizedText)
      const nextItem: HistoryItem = {
        id,
        text: normalizedText,
        locale: 'en-US',
        accessedAt: now().toISOString(),
      }
      state = {
        version: LOCAL_PROGRESS_VERSION,
        history: [nextItem, ...state.history.filter((item) => item.id !== id)].slice(
          0,
          historyLimit,
        ),
        favorites: state.favorites,
        practiceCounts: state.practiceCounts,
        preferences: state.preferences,
      }
      persist()
    },
    toggleFavorite(text: string) {
      const normalizedText = text.trim().replace(/\s+/g, ' ')
      if (normalizedText.length === 0) return false
      const id = historyId(normalizedText)
      const alreadyFavorite = state.favorites.some((item) => item.id === id)
      state = {
        ...state,
        favorites: alreadyFavorite
          ? state.favorites.filter((item) => item.id !== id)
          : [
              {
                id,
                text: normalizedText,
                locale: 'en-US',
                createdAt: now().toISOString(),
              },
              ...state.favorites,
            ],
      }
      persist()
      return !alreadyFavorite
    },
    recordPractice(text: string) {
      const normalizedText = text.trim().replace(/\s+/g, ' ')
      if (normalizedText.length === 0) return
      const id = historyId(normalizedText)
      const current = state.practiceCounts.find((item) => item.id === id)
      state = {
        ...state,
        practiceCounts: [
          {
            id,
            text: normalizedText,
            count: (current?.count ?? 0) + 1,
            lastPracticedAt: now().toISOString(),
          },
          ...state.practiceCounts.filter((item) => item.id !== id),
        ].slice(0, historyLimit),
      }
      persist()
    },
    updatePreferences(update: Partial<PracticePreferences>) {
      const candidate = readPreferences({ ...state.preferences, ...update })
      state = {
        ...state,
        preferences: candidate ?? { ...DEFAULT_PREFERENCES },
      }
      persist()
    },
    clearHistory() {
      state = { ...state, history: [] }
      persist()
    },
    clearFavorites() {
      state = { ...state, favorites: [] }
      persist()
    },
    clearAll() {
      state = emptyState()
      persist()
    },
    exportData() {
      return JSON.stringify(
        {
          format: 'smarttalky-progress',
          version: LOCAL_PROGRESS_VERSION,
          exportedAt: now().toISOString(),
          data: state,
        },
        null,
        2,
      )
    },
  }
}

function browserStorage(): StorageLike | undefined {
  try {
    return typeof window === 'undefined' ? undefined : window.localStorage
  } catch {
    return undefined
  }
}

export const localProgressStore = createLocalProgressStore({
  storage: browserStorage(),
})

export type LocalProgressStore = ReturnType<typeof createLocalProgressStore>
