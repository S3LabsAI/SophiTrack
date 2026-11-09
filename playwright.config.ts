import { defineConfig, devices } from '@playwright/test'

// Smoke tests run in WebKit at iPhone size, the app's main target.
export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:4173',
  },
  projects: [{ name: 'iphone-webkit', use: { ...devices['iPhone 15'] } }],
  webServer: {
    command: 'npm run build && npm run preview -- --port 4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
  },
})
