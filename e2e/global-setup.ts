import { chromium } from '@playwright/test'

/**
 * Global setup for E2E tests
 * Runs before all tests
 */

async function globalSetup() {
  // Optional: You can perform setup here
  // For example, seed test data, create test accounts, etc.

  console.log('E2E test suite starting...')

  // Example: Check if server is accessible
  const browser = await chromium.launch()
  const page = await browser.newPage()

  try {
    const baseURL = process.env.BASE_URL || 'http://localhost:3000'
    const response = await page.goto(baseURL, { waitUntil: 'domcontentloaded' })

    if (!response) {
      throw new Error('Failed to connect to test server')
    }

    console.log(`Connected to ${baseURL}`)
  } finally {
    await browser.close()
  }
}

export default globalSetup
