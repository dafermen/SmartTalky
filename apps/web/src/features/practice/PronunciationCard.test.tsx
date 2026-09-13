import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { createLocalProgressStore } from '../progress/local-progress-store'
import { PronunciationCard } from './PronunciationCard'

describe('PronunciationCard', () => {
  it('copia palabra y ejemplo mediante una dependencia controlada', async () => {
    const user = userEvent.setup()
    const copyText = vi.fn(async () => undefined)
    render(
      <PronunciationCard
        entry={{
          text: 'hello',
          kind: 'word',
          locale: 'en-US',
          ipa: '/həˈloʊ/',
          syllables: [
            { text: 'hel', stressed: false },
            { text: 'lo', stressed: true },
          ],
          example: 'Hello, it is nice to meet you.',
          exampleTranslation: 'Hola, es un gusto conocerte.',
        }}
        playPronunciation={async () => ({
          source: 'provider',
          usedFallback: false,
        })}
        progressStore={createLocalProgressStore()}
        copyText={copyText}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Copiar palabra' }))
    expect(copyText).toHaveBeenLastCalledWith('hello')
    expect(await screen.findByRole('status')).toHaveTextContent('Se copió palabra')

    await user.click(screen.getByRole('button', { name: 'Copiar ejemplo' }))
    expect(copyText).toHaveBeenLastCalledWith(
      'Hello, it is nice to meet you.\nHola, es un gusto conocerte.',
    )
  })
})
