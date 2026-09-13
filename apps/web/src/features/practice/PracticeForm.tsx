import { zodResolver } from '@hookform/resolvers/zod'
import {
  createPronunciationTextSchema,
  MAX_PRONUNCIATION_TEXT_LENGTH,
} from '@smarttalky/shared'
import { Button, Card, TextField } from '@smarttalky/ui'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

interface PracticeFormProps {
  isLoading: boolean
  onSubmit: (text: string) => Promise<void>
  resetRequestId?: number | undefined
}

interface PracticeFormValues {
  text: string
}

/** Recoge una frase corta y reutiliza el mismo contrato que la API. */
export function PracticeForm({
  isLoading,
  onSubmit,
  resetRequestId = 0,
}: PracticeFormProps) {
  const { t } = useTranslation()
  const schema = useMemo(
    () =>
      z.object({
        text: createPronunciationTextSchema(MAX_PRONUNCIATION_TEXT_LENGTH, {
          required: t('validation.required'),
          maxLength: t('validation.maxLength'),
          controlCharacters: t('validation.controlCharacters'),
        }),
      }),
    [t],
  )
  const {
    register,
    handleSubmit,
    setFocus,
    setValue,
    reset,
    formState: { errors },
  } = useForm<PracticeFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { text: '' },
  })
  const examples = ['hello', 'comfortable', 'How are you?'] as const

  useEffect(() => {
    if (resetRequestId === 0) return
    reset({ text: '' })
    const focusTimer = window.setTimeout(() => setFocus('text'), 0)
    return () => window.clearTimeout(focusTimer)
  }, [reset, resetRequestId, setFocus])

  const chooseExample = (example: string) => {
    setValue('text', example, { shouldDirty: true, shouldValidate: true })
    setFocus('text')
  }

  return (
    <Card
      className="relative overflow-hidden border-brand-primary/15 p-5 sm:p-7"
      aria-labelledby="practice-form-title"
    >
      <div
        className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-primary via-violet-500 to-brand-secondary"
        aria-hidden="true"
      />
      <form
        className="grid gap-5"
        onSubmit={(event) => void handleSubmit(({ text }) => onSubmit(text))(event)}
        noValidate
      >
        <div>
          <h2 id="practice-form-title" className="m-0 text-xl font-black tracking-tight">
            {t('home.formTitle')}
          </h2>
          <p className="mb-0 mt-1 text-sm leading-6 text-ink-muted">
            {t('home.formDescription')}
          </p>
        </div>
        <TextField
          {...register('text')}
          label={t('home.inputLabel')}
          placeholder={t('home.inputPlaceholder')}
          helperText={t('home.inputHelp')}
          errorMessage={errors.text?.message}
          autoComplete="off"
          disabled={isLoading}
        />
        <div>
          <p className="m-0 text-xs font-bold uppercase tracking-wider text-ink-muted">
            {t('home.quickExamples')}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {examples.map((example) => (
              <button
                key={example}
                type="button"
                className="min-h-10 rounded-full border border-border bg-surface px-3 py-2 text-sm font-bold text-ink transition-colors hover:border-brand-primary hover:bg-brand-soft hover:text-brand-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                disabled={isLoading}
                onClick={() => chooseExample(example)}
              >
                {example}
              </button>
            ))}
          </div>
        </div>
        <Button type="submit" fullWidth disabled={isLoading}>
          {isLoading ? (
            <>
              <span
                className="size-5 animate-spin rounded-full border-2 border-white/40 border-t-white"
                aria-hidden="true"
              />
              {t('home.loading')}
            </>
          ) : (
            t('home.submit')
          )}
        </Button>
      </form>
    </Card>
  )
}
