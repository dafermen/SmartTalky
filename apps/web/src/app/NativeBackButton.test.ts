import { describe, expect, it, vi } from 'vitest'

import { handleNativeBack } from './native-back-navigation'

describe('botón Atrás nativo', () => {
  it('vuelve a la pantalla anterior cuando no está en el inicio', () => {
    const navigateBack = vi.fn()
    const exitApp = vi.fn().mockResolvedValue(undefined)

    handleNativeBack('/acerca', navigateBack, exitApp)

    expect(navigateBack).toHaveBeenCalledOnce()
    expect(exitApp).not.toHaveBeenCalled()
  })

  it('cierra la aplicación cuando ya está en el inicio', () => {
    const navigateBack = vi.fn()
    const exitApp = vi.fn().mockResolvedValue(undefined)

    handleNativeBack('/', navigateBack, exitApp)

    expect(navigateBack).not.toHaveBeenCalled()
    expect(exitApp).toHaveBeenCalledOnce()
  })
})
