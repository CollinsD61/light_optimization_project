# 🎭 Playwright E2E Testing Framework

Playwright testing framework với Page Object Model cho dự án Web Sensor Monitoring.

## 📂 Cấu trúc folder

```
playwright/
├── pages/                  # Page Object Models
│   ├── BasePage.js        # Base class cho tất cả pages
│   ├── LoginPage.js       # Login page
│   ├── SignUpPage.js      # Sign up page
│   ├── DashboardPage.js   # Dashboard page
│   └── MapPage.js         # Map page
├── tests/                  # Test specifications
│   ├── auth.spec.js       # Authentication tests (TC001-TC010)
│   ├── dashboard.spec.js  # Dashboard tests (TC011-TC025)
│   ├── map.spec.js        # Map tests (TC026-TC030)
│   └── api.spec.js        # API tests (TC031-TC040)
├── test-results/          # Test results & reports
├── playwright.config.js   # Playwright configuration
├── package.json           # Dependencies
└── README.md             # This file
```

## 🚀 Setup

### 1. Install dependencies

```bash
cd playwright
npm install
npx playwright install
```

### 2. Configure environment (optional)

Default test target: **Production** (`https://lightoptimization.io.vn`)

To test locally, create `.env` file:

```env
BASE_URL=http://localhost:5173
API_URL=http://localhost:8000
```

## 🧪 Running Tests

### Run all tests

```bash
npm test
```

### Run specific test file

```bash
npx playwright test tests/auth.spec.js
```

### Run tests in headed mode (see browser)

```bash
npm run test:headed
```

### Run tests in UI mode (interactive)

```bash
npm run test:ui
```

### Run tests in specific browser

```bash
npm run test:chrome
npm run test:firefox
npm run test:webkit
```

### Run tests in debug mode

```bash
npm run test:debug
```

### View test report

```bash
npm run test:report
```

## 📝 Test Cases

### Authentication Tests (TC001-TC010)

| Test ID | Description | Status |
|---------|-------------|--------|
| TC001 | Login page displayed correctly | ✅ |
| TC002 | Login with valid credentials | ✅ |
| TC003 | Login with invalid email | ✅ |
| TC004 | Login with empty credentials | ✅ |
| TC005 | Navigate to forgot password | ✅ |
| TC006 | Navigate to sign up | ✅ |
| TC007 | Sign up page displayed | ✅ |
| TC008 | Logout from dashboard | ✅ |
| TC009 | Access protected page without login | ✅ |
| TC010 | Remember session after refresh | ✅ |

### Dashboard Tests (TC011-TC025)

| Test ID | Description | Status |
|---------|-------------|--------|
| TC011 | Dashboard displayed correctly | ✅ |
| TC012 | Charts displayed | ✅ |
| TC013 | Filter by 1 day | ✅ |
| TC014 | Filter by 7 days | ✅ |
| TC015 | Filter by 30 days | ✅ |
| TC016 | Filter by custom date range | ✅ |
| TC017 | Clear filters | ✅ |
| TC018 | Export to CSV | ✅ |
| TC019-TC022 | Navigation tests | ✅ |
| TC023-TC025 | UI element tests | ✅ |

### Map Tests (TC026-TC030)

| Test ID | Description | Status |
|---------|-------------|--------|
| TC026 | Map displayed correctly | ✅ |
| TC027 | Map loads within timeout | ✅ |
| TC028 | Click sensor marker | ✅ |
| TC029 | Get sensor data | ✅ |
| TC030 | Map container exists | ✅ |

### API Tests (TC031-TC040)

| Test ID | Description | Status |
|---------|-------------|--------|
| TC031 | Health check | ✅ |
| TC032 | Login API valid | ✅ |
| TC033 | Login API invalid | ✅ |
| TC034 | Get sensor data with auth | ✅ |
| TC035 | Get sensor data without auth | ✅ |
| TC036 | Send IoT data | ✅ |
| TC037 | Get sensors list | ✅ |
| TC038 | Register new user | ✅ |
| TC039-TC040 | Headers tests | ✅ |

## 📐 Page Object Model

### BasePage

Base class với common methods:
- `goto(url)` - Navigate to URL
- `click(selector)` - Click element
- `fill(selector, value)` - Fill input
- `getText(selector)` - Get text
- `isVisible(selector)` - Check visibility
- `waitForElement(selector)` - Wait for element
- `getLocalStorageItem(key)` - Get storage
- `setLocalStorageItem(key, value)` - Set storage
- `clearLocalStorage()` - Clear storage

### LoginPage

Methods:
- `navigate()` - Go to login page
- `login(email, password)` - Perform login
- `isLoginSuccessful()` - Check if logged in
- `getErrorMessage()` - Get error text
- `clickForgotPassword()` - Navigate to forgot password
- `clickSignUp()` - Navigate to sign up

### DashboardPage

Methods:
- `navigate()` - Go to dashboard
- `isDashboardDisplayed()` - Check if displayed
- `setDateRange(start, end)` - Set date filter
- `clickQuickFilter(type)` - Apply quick filter
- `clearFilters()` - Clear all filters
- `exportToCsv()` - Export data
- `navigateToPage(name)` - Navigate using sidebar

### MapPage

Methods:
- `navigate()` - Go to map page
- `isMapDisplayed()` - Check if map loaded
- `clickSensorMarker(index)` - Click on marker
- `isSensorInfoDisplayed()` - Check popup
- `getSensorData()` - Get sensor info

## 🔧 Configuration

### playwright.config.js

Key configurations:
- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Retries**: 2 on CI, 0 locally
- **Timeout**: 60s per test
- **Screenshots**: On failure
- **Videos**: On failure
- **Traces**: On first retry
- **Reports**: HTML, JSON, JUnit

### Parallel Execution

Tests run in parallel by default. To disable:

```bash
npx playwright test --workers=1
```

## 📊 Reports

After running tests, reports are generated in:
- `test-results/html-report/` - HTML report
- `test-results/results.json` - JSON results
- `test-results/junit.xml` - JUnit XML

View HTML report:

```bash
npx playwright show-report
```

## 🐛 Debugging

### Debug single test

```bash
npx playwright test tests/auth.spec.js --debug
```

### Codegen (record tests)

```bash
npm run test:codegen
```

### Inspector

```bash
npx playwright test --debug
```

## 📸 Screenshots & Videos

Screenshots and videos are automatically captured on failure:
- `test-results/*/screenshots/`
- `test-results/*/videos/`

## 🔐 Test Data

Default test user:
```
Email: test@example.com
Password: test123
```

Make sure this user exists in your database before running tests.

## 🌍 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `BASE_URL` | Frontend URL | `http://localhost:5173` |
| `API_URL` | Backend URL | `http://localhost:8000` |
| `CI` | CI environment | `false` |

## 💡 Tips

1. **Run specific test**:
   ```bash
   npx playwright test -g "TC001"
   ```

2. **Run tests matching pattern**:
   ```bash
   npx playwright test tests/auth
   ```

3. **Update snapshots**:
   ```bash
   npx playwright test --update-snapshots
   ```

4. **List all tests**:
   ```bash
   npx playwright test --list
   ```

5. **Trace viewer**:
   ```bash
   npx playwright show-trace test-results/*/trace.zip
   ```

## 🚀 CI/CD Integration

Tests are integrated in `.github/workflows/test.yml`:

```yaml
- name: Run Playwright tests
  run: |
    cd playwright
    npm install
    npx playwright install --with-deps
    npx playwright test
```

## 📝 Writing New Tests

1. Create Page Object in `pages/`:

```javascript
const BasePage = require('./BasePage');

class NewPage extends BasePage {
  constructor(page) {
    super(page);
    this.element = 'selector';
  }
  
  async doSomething() {
    await this.click(this.element);
  }
}

module.exports = NewPage;
```

2. Create test spec in `tests/`:

```javascript
const { test, expect } = require('@playwright/test');
const NewPage = require('../pages/NewPage');

test.describe('New Tests', () => {
  test('TC041 - Test something', async ({ page }) => {
    const newPage = new NewPage(page);
    await newPage.navigate();
    expect(await newPage.isVisible(newPage.element)).toBeTruthy();
  });
});
```

## 📚 Resources

- [Playwright Docs](https://playwright.dev/)
- [Page Object Model](https://playwright.dev/docs/pom)
- [Best Practices](https://playwright.dev/docs/best-practices)

---

Last updated: November 4, 2025

