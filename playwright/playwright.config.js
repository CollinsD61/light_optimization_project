// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',
  
  /* Maximum time one test can run for - increased for CI */
  timeout: process.env.CI ? 60 * 1000 : 30 * 1000, // 60s on CI, 30s locally
  
  /* Run tests in files in parallel */
  fullyParallel: true, // Enable parallel execution for speed
  
  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: !!process.env.CI,
  
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  
  /* Use maximum available workers for parallel execution */
  workers: process.env.CI ? '75%' : undefined, // CI: 75% of cores, Local: 50% (default)
  
  /* Reporter to use */
  reporter: [
    ['html'],
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }]
  ],
  
  /* Shared settings for all the projects below */
  use: {
    /* Base URL to use in actions like `await page.goto('/')` */
    baseURL: process.env.BASE_URL || 'https://lightoptimization.io.vn',
    
    /* Collect trace when retrying the failed test */
    trace: 'on-first-retry',
    
    /* Screenshot on failure */
    screenshot: 'only-on-failure',
    
    /* Video on failure */
    video: 'retain-on-failure',
    
    /* Viewport */
    viewport: { width: 1280, height: 720 },
    
    /* Increase action timeout on CI */
    actionTimeout: process.env.CI ? 15000 : 10000,
    
    /* Increase navigation timeout on CI */
    navigationTimeout: process.env.CI ? 30000 : 15000,
    
    /* Ensure Playwright User-Agent is preserved for rate limiting skip */
    extraHTTPHeaders: {
      // Keep Playwright in User-Agent for backend rate limiting detection
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Playwright/1.40.0'
    },
  },

  /* Configure projects for different test types and browsers */
  projects: [
    // Test Groups - Run specific test suites
    {
      name: 'smoke',
      testMatch: '**/*.spec.js',
      grep: /@smoke/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'api',
      testMatch: '**/*.spec.js',
      grep: /@api/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'e2e',
      testMatch: '**/*.spec.js',
      grep: /@e2e/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'regression',
      testMatch: '**/*.spec.js',
      grep: /@regression/,
      use: { ...devices['Desktop Chrome'] },
    },
    
    // Default: All tests on Chromium
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // Optional: Other browsers (commented out by default)
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run dev',
  //   url: 'http://localhost:5173',
  //   reuseExistingServer: !process.env.CI,
  // },
});
