# 🚀 Playwright Quick Start Guide

## Prerequisites

- Node.js 18+ installed
- Frontend & Backend running
- Test user created in database: `test@example.com` / `test123`

## Installation

```bash
# Navigate to playwright folder
cd playwright

# Install dependencies
npm install

# Install Playwright browsers (only need chromium for CI)
npx playwright install chromium

# Or install all browsers
npx playwright install
```

## Run Tests

### 1. Start your application first

```bash
# Terminal 1: Start Backend (from project root)
cd BE_nodejs
node src/server.js

# Terminal 2: Start Frontend (from project root)  
cd FE
npm run dev
```

### 2. Run Playwright tests

```bash
# Terminal 3: Run tests (from playwright folder)
cd playwright

# Run all tests
npm test

# Run tests in headed mode (see browser)
npm run test:headed

# Run tests in UI mode (interactive)
npm run test:ui

# Run specific test file
npx playwright test tests/auth.spec.js

# Run tests matching pattern
npx playwright test -g "TC001"

# Run in debug mode
npm run test:debug
```

## View Results

```bash
# Open HTML report
npm run test:report

# Or manually
npx playwright show-report
```

## Common Commands

```bash
# Run only Chrome tests
npm run test:chrome

# Run only Firefox tests
npm run test:firefox

# Run only WebKit tests
npm run test:webkit

# Generate test code (record actions)
npm run test:codegen

# List all tests
npx playwright test --list

# Show test coverage
npx playwright test --reporter=html
```

## Troubleshooting

### ❌ Tests fail because frontend not running
**Solution:** Make sure `npm run dev` is running in FE folder

### ❌ Login tests fail
**Solution:** Ensure test user exists in database:
```sql
-- Check if user exists
SELECT * FROM users_customuser WHERE email = 'test@example.com';
```

### ❌ Timeout errors
**Solution:** Increase timeout in `playwright.config.js`:
```javascript
timeout: 60 * 1000, // 60 seconds
```

### ❌ Browser not installed
**Solution:** 
```bash
npx playwright install chromium
```

## Test Structure

```
tests/
├── auth.spec.js        # TC001-TC010: Login, Signup, Logout
├── dashboard.spec.js   # TC011-TC025: Dashboard, Charts, Filters
├── map.spec.js         # TC026-TC030: Map display, Sensors
└── api.spec.js         # TC031-TC040: API endpoints

pages/
├── BasePage.js         # Common methods
├── LoginPage.js        # Login page actions
├── DashboardPage.js    # Dashboard page actions
├── MapPage.js          # Map page actions
└── SignUpPage.js       # Signup page actions
```

## Writing New Tests

1. **Create Page Object** (if needed):

```javascript
// pages/NewPage.js
const BasePage = require('./BasePage');

class NewPage extends BasePage {
  constructor(page) {
    super(page);
    this.btnElement = 'button.my-button';
  }

  async clickButton() {
    await this.click(this.btnElement);
  }
}

module.exports = NewPage;
```

2. **Create Test Spec**:

```javascript
// tests/new.spec.js
const { test, expect } = require('@playwright/test');
const NewPage = require('../pages/NewPage');

test.describe('New Tests', () => {
  test('TC041 - Should do something', async ({ page }) => {
    const newPage = new NewPage(page);
    await newPage.navigate();
    await newPage.clickButton();
    expect(await newPage.isVisible(newPage.btnElement)).toBeTruthy();
  });
});
```

## CI/CD Integration

Tests automatically run in GitHub Actions after deployment via `.github/workflows/test.yml`.

To run manually:
1. Go to GitHub Actions
2. Select "Quality & Security Tests"
3. Click "Run workflow"

## Tips

- 💡 Use `test:ui` mode for debugging
- 💡 Use `--headed` to see what's happening
- 💡 Use `test:codegen` to generate test code
- 💡 Check `test-results/` for screenshots/videos on failure
- 💡 Always clear localStorage between tests if needed

## Next Steps

- Read full documentation: [README.md](README.md)
- Learn Page Object Model: [Playwright POM](https://playwright.dev/docs/pom)
- Explore test examples in `tests/` folder

---

Happy Testing! 🎭

