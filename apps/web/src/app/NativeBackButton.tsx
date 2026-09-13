import { App as CapacitorApp } from '@capacitor/app'
import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { handleNativeBack } from './native-back-navigation'

interface NativeBackButtonProps {
  enabled: boolean
}

/** Conecta el botón físico Atrás de Android con el historial de rutas de SmartTalky. */
export function NativeBackButton({ enabled }: NativeBackButtonProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const pathnameRef = useRef(location.pathname)

  useEffect(() => {
    pathnameRef.current = location.pathname
  }, [location.pathname])

  useEffect(() => {
    if (!enabled) {
      return
    }

    let disposed = false
    let removeListener: (() => Promise<void>) | undefined

    void CapacitorApp.addListener('backButton', () => {
      handleNativeBack(
        pathnameRef.current,
        () => navigate(-1),
        () => CapacitorApp.exitApp(),
      )
    }).then((listener) => {
      if (disposed) {
        void listener.remove()
        return
      }

      removeListener = () => listener.remove()
    })

    return () => {
      disposed = true
      void removeListener?.()
    }
  }, [enabled, navigate])

  return null
}
