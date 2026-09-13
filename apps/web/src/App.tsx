import { Capacitor } from '@capacitor/core'
import { QueryClientProvider } from '@tanstack/react-query'
import { lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import {
  BrowserRouter,
  HashRouter,
  Navigate,
  Route,
  Routes,
  useParams,
} from 'react-router-dom'

import { AppLayout } from './app/AppLayout'
import { NativeBackButton } from './app/NativeBackButton'
import { createSmartTalkyQueryClient } from './data/query-client'
import { isDocumentationEnabled } from './features/documentation/documentation-config'
import { HomePage } from './pages/HomePage'

const AboutPage = lazy(() =>
  import('./pages/AboutPage').then((module) => ({ default: module.AboutPage })),
)
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })),
)
const DocumentationPage = lazy(() =>
  import('./pages/DocumentationPage').then((module) => ({
    default: module.DocumentationPage,
  })),
)

const queryClient = createSmartTalkyQueryClient()

function LegacyDocumentationRedirect() {
  const { documentId } = useParams()
  return <Navigate replace to={documentId ? `/docs/${documentId}` : '/docs'} />
}

function RouteFallback() {
  const { t } = useTranslation()
  return (
    <p className="mx-auto w-full max-w-6xl px-4 py-12 text-ink-muted" role="status">
      {t('navigation.loadingPage')}
    </p>
  )
}

/** Define las rutas visibles sin acoplarlas al tipo de historial usado en pruebas. */
export function AppRoutes() {
  const documentationEnabled = isDocumentationEnabled()

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route
          path="acerca"
          element={
            <Suspense fallback={<RouteFallback />}>
              <AboutPage />
            </Suspense>
          }
        />
        {documentationEnabled ? (
          <>
            <Route
              path="docs/:documentId?"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <DocumentationPage />
                </Suspense>
              }
            />
            <Route
              path="documentacion/:documentId?"
              element={<LegacyDocumentationRedirect />}
            />
          </>
        ) : null}
        <Route
          path="*"
          element={
            <Suspense fallback={<RouteFallback />}>
              <NotFoundPage />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  )
}

interface AppProps {
  isNativePlatform?: boolean
}

/** Usa hash en el contenedor nativo y conserva URLs limpias en la web. */
export function App({ isNativePlatform = Capacitor.isNativePlatform() }: AppProps = {}) {
  const Router = isNativePlatform ? HashRouter : BrowserRouter

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <NativeBackButton enabled={isNativePlatform} />
        <AppRoutes />
      </Router>
    </QueryClientProvider>
  )
}
