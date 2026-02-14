/**
 * Global teardown for E2E tests
 * Runs after all tests
 */

async function globalTeardown() {
  console.log('E2E test suite completed')

  // Optional: Cleanup operations
  // For example: clear test data, close connections, etc.
}

export default globalTeardown
