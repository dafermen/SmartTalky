import { DEFAULT_LANGUAGE_SETTINGS } from '@smarttalky/shared'
import { describe, expect, it } from 'vitest'

import { i18n } from './config'

describe('internacionalización inicial', () => {
  it('separa los cuatro conceptos lingüísticos y resuelve español', () => {
    expect(DEFAULT_LANGUAGE_SETTINGS).toEqual({
      interfaceLanguage: 'es',
      nativeLanguage: 'es',
      learningLanguage: 'en',
      pronunciationLocale: 'en-US',
    })
    expect(i18n.language).toBe('es')
    expect(i18n.t('home.submit')).toBe('Preparar pronunciación')
  })
})
