import { Card } from '@smarttalky/ui'
import { useState, useSyncExternalStore } from 'react'
import { useTranslation } from 'react-i18next'

import type { LocalProgressStore } from './local-progress-store'

interface HistoryPanelProps {
  store: LocalProgressStore
}

export function HistoryPanel({ store }: HistoryPanelProps) {
  const { t } = useTranslation()
  const state = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot,
  )
  const [query, setQuery] = useState('')
  const normalizedQuery = query.trim().toLocaleLowerCase('en-US')
  const history = state.history.filter(({ text }) =>
    text.toLocaleLowerCase('en-US').includes(normalizedQuery),
  )
  const favorites = state.favorites.filter(({ text }) =>
    text.toLocaleLowerCase('en-US').includes(normalizedQuery),
  )
  const hasNoMatches =
    normalizedQuery.length > 0 && history.length === 0 && favorites.length === 0

  return (
    <Card className="grid gap-4 p-5 sm:p-7">
      <div>
        <h2 className="m-0 text-xl font-black">{t('progress.historyTitle')}</h2>
        <p className="mb-0 mt-1 text-sm leading-6 text-ink-muted">
          {t('progress.localOnly')}
        </p>
      </div>
      <label className="grid gap-2 text-sm font-bold" htmlFor="progress-search">
        {t('progress.searchLabel')}
        <input
          id="progress-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="min-h-11 rounded-control border border-border bg-white px-3 font-normal outline-none focus:border-focus focus:shadow-control"
          placeholder={t('progress.searchPlaceholder')}
        />
      </label>
      {hasNoMatches ? (
        <p className="m-0 rounded-control bg-surface-muted p-3 text-sm text-ink-muted">
          {t('progress.noSearchResults')}
        </p>
      ) : null}
      {state.history.length === 0 ? (
        <p className="m-0 text-sm text-ink-muted">{t('progress.emptyHistory')}</p>
      ) : (
        <ol className="m-0 grid list-none gap-2 p-0">
          {history.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-3 rounded-card bg-surface-muted px-4 py-3"
            >
              <span className="break-words font-bold">{item.text}</span>
              <span className="shrink-0 text-xs text-ink-muted">{item.locale}</span>
            </li>
          ))}
        </ol>
      )}
      <div className="border-t border-slate-200 pt-4">
        <h3 className="m-0 text-lg font-black">{t('progress.favoritesTitle')}</h3>
        {state.favorites.length === 0 ? (
          <p className="mb-0 mt-2 text-sm text-ink-muted">
            {t('progress.emptyFavorites')}
          </p>
        ) : (
          <ul className="mb-0 mt-3 grid list-none gap-2 p-0">
            {favorites.map((item) => (
              <li
                key={item.id}
                className="rounded-card bg-amber-50 px-4 py-3 font-bold text-amber-950"
              >
                <span aria-hidden="true">★ </span>
                {item.text}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  )
}
