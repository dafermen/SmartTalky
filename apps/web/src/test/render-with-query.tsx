import { QueryClientProvider } from '@tanstack/react-query'
import { render, type RenderOptions, type RenderResult } from '@testing-library/react'
import type { ReactElement } from 'react'

import { createSmartTalkyQueryClient } from '../data/query-client'

export function renderWithQuery(
  element: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
): RenderResult {
  const queryClient = createSmartTalkyQueryClient()

  return render(
    <QueryClientProvider client={queryClient}>{element}</QueryClientProvider>,
    options,
  )
}
