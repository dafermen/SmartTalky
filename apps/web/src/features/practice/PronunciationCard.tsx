import { Card } from '@smarttalky/ui'
import { useState, useSyncExternalStore } from 'react'
import { useTranslation } from 'react-i18next'

import { AudioControls } from './AudioControls'
import type { PlayPronunciation, PronunciationEntry } from './types'
import { FavoriteButton } from '../progress/FavoriteButton'
import type { LocalProgressStore } from '../progress/local-progress-store'

interface PronunciationCardProps {
  entry: PronunciationEntry
  playPronunciation: PlayPronunciation
  progressStore: LocalProgressStore
  copyText?: ((text: string) => Promise<void>) | undefined
}

async function copyToClipboard(text: string) {
  if (navigator.clipboard === undefined) {
    throw new Error('Clipboard no disponible.')
  }
  await navigator.clipboard.writeText(text)
}

/** Muestra datos educativos disponibles sin inventar valores ausentes. */
export function PronunciationCard({
  entry,
  playPronunciation,
  progressStore,
  copyText = copyToClipboard,
}: PronunciationCardProps) {
  const { t } = useTranslation()
  const [copyMessage, setCopyMessage] = useState('')
  const progressState = useSyncExternalStore(
    progressStore.subscribe,
    progressStore.getSnapshot,
    progressStore.getSnapshot,
  )
  const practiceCount =
    progressState.practiceCounts.find(
      ({ id }) =>
        id === entry.text.trim().replace(/\s+/g, ' ').toLocaleLowerCase('en-US'),
    )?.count ?? 0

  const copy = async (value: string, label: string) => {
    try {
      await copyText(value)
      setCopyMessage(t('pronunciation.copied', { label }))
    } catch {
      setCopyMessage(t('pronunciation.copyError'))
    }
  }

  return (
    <Card
      className="grid gap-6 overflow-hidden border-brand-primary/15 p-0"
      aria-label={t('pronunciation.cardLabel', { text: entry.text })}
    >
      <header className="flex flex-col gap-4 bg-gradient-to-br from-brand-soft via-white to-secondary-soft p-5 sm:flex-row sm:items-start sm:justify-between sm:p-7">
        <div>
          <p className="m-0 text-sm font-bold uppercase tracking-wider text-brand-primary">
            {t('home.success')}
          </p>
          <h2 className="mb-0 mt-2 break-words text-4xl font-black tracking-tight text-ink sm:text-5xl">
            {entry.text}
          </h2>
          {entry.translation === undefined ? null : (
            <p className="mb-0 mt-2 text-lg font-semibold text-ink-muted">
              {entry.translation}
            </p>
          )}
          <button
            type="button"
            className="mt-4 min-h-10 rounded-control border border-border bg-white px-3 text-sm font-bold text-brand-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            onClick={() =>
              void copy(entry.text, t('pronunciation.copyWordLabel').toLowerCase())
            }
          >
            {t('pronunciation.copyWord')}
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-fit rounded-full bg-secondary-soft px-3 py-1 text-sm font-bold text-brand-secondary">
            {entry.locale}
          </span>
          <FavoriteButton text={entry.text} store={progressStore} />
          <span className="rounded-full bg-stress-surface px-3 py-1 text-sm font-bold text-stress-ink">
            {t('progress.repetitions', { count: practiceCount })}
          </span>
        </div>
      </header>

      <dl className="m-0 grid gap-4 px-5 sm:grid-cols-2 sm:px-7">
        <div className="rounded-card border border-border p-4">
          <dt className="text-sm font-bold text-ink-muted">
            {t('pronunciation.ipaLabel')}
          </dt>
          <dd className="mb-0 mt-2 flex flex-wrap items-center justify-between gap-3 text-xl font-semibold">
            <span>{entry.ipa ?? t('pronunciation.notAvailable')}</span>
            {entry.ipa === undefined ? null : (
              <button
                type="button"
                className="min-h-10 rounded-control border border-border px-3 text-sm font-bold text-brand-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                onClick={() =>
                  void copy(entry.ipa ?? '', t('pronunciation.ipaLabel').toLowerCase())
                }
              >
                {t('pronunciation.copy')}
              </button>
            )}
          </dd>
        </div>
        <div className="rounded-card border border-border p-4">
          <dt className="text-sm font-bold text-ink-muted">
            {t(
              entry.kind === 'word'
                ? 'pronunciation.syllablesLabel'
                : 'pronunciation.segmentsLabel',
            )}
          </dt>
          <dd className="mb-0 mt-2">
            {entry.syllables === undefined ? (
              t('pronunciation.notAvailable')
            ) : (
              <>
                <span className="flex flex-wrap gap-1 text-xl font-bold">
                  {entry.syllables.map((syllable, index) => (
                    <span key={`${syllable.text}-${index}`}>
                      {index === 0 ? null : <span aria-hidden="true">·</span>}
                      <mark
                        className={
                          syllable.stressed
                            ? 'rounded bg-stress-surface px-1 text-stress-ink'
                            : 'bg-transparent text-ink'
                        }
                      >
                        {syllable.text}
                      </mark>
                    </span>
                  ))}
                </span>
                <span className="mt-2 block text-sm text-ink-muted">
                  {t('pronunciation.stressHint')}
                </span>
              </>
            )}
          </dd>
        </div>
        {entry.translation === undefined ? (
          <div className="rounded-card bg-surface-muted p-4">
            <dt className="text-sm font-bold text-ink-muted">
              {t('pronunciation.translationLabel')}
            </dt>
            <dd className="mb-0 mt-2 text-lg">{t('pronunciation.notAvailable')}</dd>
          </div>
        ) : null}
        <div
          className={`rounded-card bg-surface-muted p-4 ${
            entry.translation === undefined ? '' : 'sm:col-span-2'
          }`}
        >
          <dt className="text-sm font-bold text-ink-muted">
            {t('pronunciation.exampleLabel')}
          </dt>
          <dd className="mb-0 mt-2 text-lg italic">
            {entry.example ?? t('pronunciation.notAvailable')}
            {entry.exampleTranslation === undefined ? null : (
              <span className="mt-2 block not-italic text-ink-muted">
                {entry.exampleTranslation}
              </span>
            )}
            {entry.example === undefined ? null : (
              <button
                type="button"
                className="mt-3 block min-h-10 rounded-control border border-border bg-white px-3 text-sm font-bold not-italic text-brand-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                onClick={() =>
                  void copy(
                    [entry.example, entry.exampleTranslation].filter(Boolean).join('\n'),
                    t('pronunciation.exampleLabel').toLowerCase(),
                  )
                }
              >
                {t('pronunciation.copyExample')}
              </button>
            )}
          </dd>
        </div>
      </dl>

      <div className="px-5 pb-5 sm:px-7 sm:pb-7">
        <AudioControls
          playPronunciation={playPronunciation}
          onPlayed={() => progressStore.recordPractice(entry.text)}
        />
        {copyMessage === '' ? null : (
          <p
            className="mb-0 mt-3 rounded-control bg-brand-soft px-4 py-3 text-sm font-bold text-brand-primary"
            role="status"
          >
            {copyMessage}
          </p>
        )}
      </div>
    </Card>
  )
}
