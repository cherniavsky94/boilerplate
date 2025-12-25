import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  expect: {
    timeout: 10 * 1000,
  },
  use: {
    baseURL: 'http://localhost:4173',
    viewport: { width: 1280, height: 720 },
  },
  webServer: {
    command: 'pnpm dev -- --host --port 4173',
    url: 'http://localhost:4173',
    reuseExistingServer: true,
    timeout: 30 * 1000,
  },
});
