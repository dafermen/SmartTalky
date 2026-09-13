import { defineConfig, devices } from '@playwright/test'

const baseURL = process.env.SMARTTALKY_STAGING_URL

if (baseURL === undefined || !baseURL.startsWith('https://')) {
  throw new Error('SMARTTALKY_STAGING_URL debe ser una URL HTTPS explícita.')
}

export default defineConfig({
  testDir: './test/e2e',
  testMatch: ['smarttalky.spec.mjs', 'staging-operations.spec.mjs'],
  fullyParallel: false,
  forbidOnly: true,
  retries: 0,
  workers: 1,
  reporter: 'list',
  timeout: 30_000,
  use: {
    baseURL,
    ignoreHTTPSErrors: false,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium-desktop',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'chromium-mobile',
      use: { ...devices['Pixel 7'] },
    },
  ],
})
