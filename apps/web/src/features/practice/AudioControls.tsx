import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { PlayPronunciation, PronunciationMode } from './types'

interface AudioControlsProps {
  playPronunciation: PlayPronunciation
  onPlayed?: ((mode: PronunciationMode) => void) | undefined
}

const modes: readonly PronunciationMode[] = ['natural', 'slow', 'teacher']
const modeIcons: Readonly<Record<PronunciationMode, string>> = {
  natural: '≈',
  slow: '½',
  teacher: 'Aa',
}

/** Presenta las modalidades y anuncia el estado de la reproducción simulada. */
export function AudioControls({ playPronunciation, onPlayed }: AudioControlsProps) {
  const { t } = useTranslation()
  const [playingMode, setPlayingMode] = useState<PronunciationMode>()
  const [lastPlayedMode, setLastPlayedMode] = useState<PronunciationMode>()
  const [playbackMessage, setPlaybackMessage] = useState<string>()
  const [playbackError, setPlaybackError] = useState(false)

  const play = async (mode: PronunciationMode) => {
    setPlayingMode(mode)
    setLastPlayedMode(undefined)
    setPlaybackMessage(undefined)
    setPlaybackError(false)
    try {
      const result = await playPronunciation(mode)
      onPlayed?.(mode)
      setLastPlayedMode(mode)
      setPlaybackMessage(
        result.source === 'provider'
          ? t('pronunciation.providerPlayed')
          : result.usedFallback
            ? t('pronunciation.fallbackPlayed')
            : t('pronunciation.devicePlayed'),
      )
    } catch {
      setPlaybackError(true)
      setPlaybackMessage(t('pronunciation.playbackError'))
    } finally {
      setPlayingMode(undefined)
    }
  }

  return (
    <div className="grid gap-4 border-t border-border pt-6">
      <div>
        <h3 className="m-0 text-xl font-black">{t('pronunciation.modesTitle')}</h3>
        <p className="mb-0 mt-1 text-sm leading-6 text-ink-muted">
          {t('pronunciation.modesDescription')}
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {modes.map((mode) => {
          const isPlaying = playingMode === mode
          const wasPlayed = lastPlayedMode === mode
          return (
            <button
              key={mode}
              type="button"
              className={`grid min-h-48 content-between gap-4 rounded-card border p-4 text-left transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-60 ${
                isPlaying
                  ? 'border-brand-primary bg-brand-soft shadow-control'
                  : wasPlayed
                    ? 'border-brand-secondary bg-secondary-soft'
                    : 'border-border bg-surface-raised hover:-translate-y-0.5 hover:border-brand-primary hover:shadow-card'
              }`}
              aria-label={t(`pronunciation.${mode}PlayLabel`)}
              aria-pressed={isPlaying}
              disabled={playingMode !== undefined}
              onClick={() => void play(mode)}
            >
              <span>
                <span className="mb-3 flex items-start justify-between gap-2">
                  <span
                    className="grid size-10 place-items-center rounded-xl bg-brand-soft text-lg font-black text-brand-primary"
                    aria-hidden="true"
                  >
                    {modeIcons[mode]}
                  </span>
                  {mode === 'natural' ? (
                    <span className="rounded-full bg-secondary-soft px-2 py-1 text-[0.7rem] font-black uppercase tracking-wide text-brand-secondary">
                      {t('pronunciation.recommended')}
                    </span>
                  ) : null}
                </span>
                <strong className="block text-lg text-ink">
                  {t(`pronunciation.${mode}`)}
                </strong>
                <span className="mt-1 block text-sm leading-6 text-ink-muted">
                  {t(`pronunciation.${mode}Description`)}
                </span>
                {mode === 'teacher' ? (
                  <span className="mt-3 block rounded-control bg-surface-muted px-3 py-2 text-xs font-bold text-ink-muted">
                    {t('pronunciation.teacherSequence')}
                  </span>
                ) : null}
              </span>
              <span className="flex items-center gap-2 font-black text-brand-primary">
                <span aria-hidden="true">{isPlaying ? '■' : '▶'}</span>
                {isPlaying
                  ? t('pronunciation.playingShort')
                  : wasPlayed
                    ? t('pronunciation.playedAction')
                    : t('pronunciation.playAction')}
              </span>
            </button>
          )
        })}
      </div>
      <details className="rounded-control bg-surface-muted px-4 py-3 text-sm">
        <summary className="font-bold text-ink-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus">
          {t('pronunciation.limitationSummary')}
        </summary>
        <p className="mb-0 mt-2 leading-6 text-ink-muted">
          {t('pronunciation.limitation')}
        </p>
      </details>
      {playbackMessage === undefined ? null : (
        <p
          className={`m-0 rounded-card px-4 py-3 text-sm font-bold ${
            playbackError
              ? 'bg-error-surface text-error-ink'
              : 'bg-secondary-soft text-brand-secondary'
          }`}
          role={playbackError ? 'alert' : 'status'}
        >
          {playbackMessage}
        </p>
      )}
      <p className="sr-only" aria-live="polite">
        {playingMode === undefined
          ? lastPlayedMode === undefined
            ? ''
            : t('pronunciation.played')
          : t('pronunciation.playing', {
              mode: t(`pronunciation.${playingMode}`).toLowerCase(),
            })}
      </p>
    </div>
  )
}
