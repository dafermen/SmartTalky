import { Button } from '@smarttalky/ui'
import { useSyncExternalStore } from 'react'
import { useTranslation } from 'react-i18next'

import type { LocalProgressStore } from './local-progress-store'

interface FavoriteButtonProps {
  text: string
  store: LocalProgressStore
}

export function FavoriteButton({ text, store }: FavoriteButtonProps) {
  const { t } = useTranslation()
  const state = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot,
  )
  const id = text.trim().replace(/\s+/g, ' ').toLocaleLowerCase('en-US')
  const isFavorite = state.favorites.some((item) => item.id === id)

  return (
    <Button
      variant="secondary"
      aria-pressed={isFavorite}
      aria-label={
        isFavorite
          ? t('progress.removeFavorite', { text })
          : t('progress.addFavorite', { text })
      }
      onClick={() => store.toggleFavorite(text)}
    >
      <span aria-hidden="true">{isFavorite ? '★' : '☆'}</span>
      {isFavorite ? t('progress.favorite') : t('progress.saveFavorite')}
    </Button>
  )
}
