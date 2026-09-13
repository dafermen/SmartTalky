import { Button } from '@smarttalky/ui'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { LocalProgressStore } from './local-progress-store'

interface DataControlsProps {
  store: LocalProgressStore
  confirmAction?: ((message: string) => boolean) | undefined
  download?: ((filename: string, contents: string) => void) | undefined
}

function downloadJson(filename: string, contents: string) {
  const url = URL.createObjectURL(
    new Blob([contents], { type: 'application/json;charset=utf-8' }),
  )
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export function DataControls({
  store,
  confirmAction = (message) => window.confirm(message),
  download = downloadJson,
}: DataControlsProps) {
  const { t } = useTranslation()
  const [message, setMessage] = useState<{
    text: string
    isError: boolean
  }>()

  const clear = (confirmation: string, action: () => void, successMessage: string) => {
    if (!confirmAction(confirmation)) return
    action()
    setMessage({ text: successMessage, isError: false })
  }

  const exportProgress = () => {
    try {
      download('smarttalky-progreso.json', store.exportData())
      setMessage({ text: t('data.exported'), isError: false })
    } catch {
      setMessage({ text: t('data.exportError'), isError: true })
    }
  }

  return (
    <div className="grid gap-3 border-t border-slate-200 pt-4">
      <div>
        <h3 className="m-0 text-lg font-black">{t('data.title')}</h3>
        <p className="mb-0 mt-1 text-sm leading-6 text-ink-muted">
          {t('data.description')}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={exportProgress}>
          {t('data.export')}
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            clear(t('data.confirmHistory'), store.clearHistory, t('data.historyCleared'))
          }
        >
          {t('data.clearHistory')}
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            clear(
              t('data.confirmFavorites'),
              store.clearFavorites,
              t('data.favoritesCleared'),
            )
          }
        >
          {t('data.clearFavorites')}
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            clear(t('data.confirmAll'), store.clearAll, t('data.allCleared'))
          }
        >
          {t('data.clearAll')}
        </Button>
      </div>
      {message === undefined ? null : (
        <p
          className={`m-0 text-sm font-bold ${message.isError ? 'text-error-ink' : 'text-teal-800'}`}
          role={message.isError ? 'alert' : 'status'}
        >
          {message.text}
        </p>
      )}
    </div>
  )
}
