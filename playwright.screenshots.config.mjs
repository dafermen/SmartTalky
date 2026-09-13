import { defineConfig, devices } from '@playwright/test'

import baseConfig from './playwright.config.mjs'

export default defineConfig({
  ...baseConfig,
  testMatch: 'screenshots.spec.mjs',
  projects: [
    {
      name: 'chromium-screenshots',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
