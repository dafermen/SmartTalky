import { defineConfig, devices } from '@playwright/test'

const testEnvironment = {
  ...process.env,
  NODE_ENV: 'test',
  PORT: '3000',
  LOG_LEVEL: 'silent',
  OPENAI_API_KEY: '',
}

export default defineConfig({
  testDir: './test/e2e',
  testMatch: 'smarttalky.spec.mjs',
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? 'github' : 'list',
  timeout: 30_000,
  use: {
    baseURL: 'http://127.0.0.1:5180',
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
  webServer: [
    {
      command: 'npm run start --workspace @smarttalky/api',
      url: 'http://127.0.0.1:3000/api/v1/health',
      env: testEnvironment,
      reuseExistingServer: false,
      timeout: 30_000,
    },
    {
      command: 'npm run preview --workspace @smarttalky/web',
      url: 'http://127.0.0.1:5180',
      env: {
        ...process.env,
        SMARTTALKY_API_TARGET: 'http://127.0.0.1:3000',
      },
      reuseExistingServer: false,
      timeout: 30_000,
    },
  ],
})
