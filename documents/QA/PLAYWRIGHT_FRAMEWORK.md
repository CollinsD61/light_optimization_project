# 🎭 Playwright E2E Testing Framework

## Tổng quan

Playwright framework với **Page Object Model** cho dự án Light Optimization System.

## 📂 Cấu trúc

```
playwright/
├── pages/                  # 📄 Page Object Models
│   ├── BasePage.js        # Base class cho tất cả pages
│   ├── LoginPage.js       # Login page (email, password, Google login)
│   ├── SignUpPage.js      # Sign up page
│   ├── DashboardPage.js   # Dashboard (charts, filters, export)
│   └── MapPage.js         # Map page (sensors, markers)
│
├── tests/                  # 🧪 Test Specifications
│   ├── auth.spec.js       # TC001-TC010: Authentication
│   ├── dashboard.spec.js  # TC011-TC025: Dashboard features
│   ├── map.spec.js        # TC026-TC030: Map functionality
│   └── api.spec.js        # TC031-TC040: API endpoints
│
├── test-results/          # 📊 Test results & artifacts
├── playwright-report/     # 📈 HTML reports
├── playwright.config.js   # ⚙️ Configuration
├── package.json           # 📦 Dependencies
├── README.md             # 📖 Full documentation
├── QUICKSTART.md         # 🚀 Quick start guide
└── .gitignore            # 🙈 Git ignore rules
```

## ✨ Tính năng

### 1. Page Object Model Pattern
- ✅ Tách biệt test logic và page structure
- ✅ Reusable methods
- ✅ Easy maintenance
- ✅ Better readability

### 2. Multi-Browser Testing
- ✅ Chromium (Chrome/Edge)
- ✅ Firefox
- ✅ WebKit (Safari)
- ✅ Mobile Chrome
- ✅ Mobile Safari

### 3. Test Coverage (40+ test cases)

#### Authentication (TC001-TC010)
- Login với email/password
- Login với Google OAuth
- Logout
- Sign up
- Forgot password
- Session management
- Protected routes

#### Dashboard (TC011-TC025)
- Charts display (Light, Temperature, Humidity)
- Date range filters (1 day, 7 days, 30 days, 2 months)
- Custom date range
- Clear filters
- Export to CSV
- Navigation
- UI elements

#### Map (TC026-TC030)
- Map display
- Sensor markers
- Click sensor info
- Real-time data
- Map interactions

#### API (TC031-TC040)
- Health check endpoint
- Authentication API
- Sensor data API
- IoT data reception
- Sensors list API
- CORS headers
- Error responses

### 4. Rich Reporting
- 📊 HTML reports với screenshots
- 🎥 Videos on failure
- 🔍 Traces for debugging
- 📈 JSON results
- 📝 JUnit XML

### 5. CI/CD Integration
- ✅ Tự động chạy sau deployment
- ✅ Parallel execution
- ✅ Artifacts upload (screenshots, videos, reports)
- ✅ Retry on failure

## 🚀 Quick Start

### Installation
```bash
cd playwright
npm install
npx playwright install chromium
```

### Run Tests
```bash
# Đảm bảo FE & BE đang chạy
npm test
```

### View Report
```bash
npm run test:report
```

## 📝 Page Object Models

### BasePage
Base class với common methods:
```javascript
- goto(url)                     // Navigate
- click(selector)               // Click element
- fill(selector, value)         // Fill input
- getText(selector)             // Get text
- isVisible(selector)           // Check visibility
- waitForElement(selector)      // Wait for element
- getLocalStorageItem(key)      // Get storage
- setLocalStorageItem(key, val) // Set storage
- clearLocalStorage()           // Clear storage
- takeScreenshot(name)          // Screenshot
- reload()                      // Reload page
```

### LoginPage
```javascript
class LoginPage extends BasePage {
  // Locators
  this.emailInput
  this.passwordInput
  this.btnLogin
  this.linkForgotPassword
  this.linkSignUp
  
  // Methods
  async navigate()
  async login(email, password)
  async isLoginSuccessful()
  async getErrorMessage()
  async clickForgotPassword()
  async clickSignUp()
}
```

### DashboardPage
```javascript
class DashboardPage extends BasePage {
  // Locators
  this.chartsContainer
  this.quickFilters
  this.dateInputs
  this.btnExport
  this.sidebar
  
  // Methods
  async navigate()
  async isDashboardDisplayed()
  async setDateRange(start, end)
  async clickQuickFilter(type)
  async clearFilters()
  async exportToCsv()
  async navigateToPage(name)
}
```

### MapPage
```javascript
class MapPage extends BasePage {
  // Locators
  this.mapContainer
  this.sensorMarkers
  this.sensorInfo
  
  // Methods
  async navigate()
  async isMapDisplayed()
  async clickSensorMarker(index)
  async isSensorInfoDisplayed()
  async getSensorData()
}
```

## 🧪 Test Examples

### Authentication Test
```javascript
test('TC002 - Login with valid credentials', async ({ page }) => {
  await loginPage.navigate();
  await loginPage.login('test@example.com', 'test123');
  await page.waitForURL('**/mainlayout/**', { timeout: 10000 });
  
  expect(await loginPage.isLoginSuccessful()).toBeTruthy();
  expect(loginPage.getCurrentUrl()).toContain('/mainlayout');
});
```

### Dashboard Test
```javascript
test('TC013 - Filter data by 1 day', async () => {
  await dashboardPage.navigate();
  await dashboardPage.clickQuickFilter('1day');
  await dashboardPage.wait(2000);
  
  expect(await dashboardPage.areChartsDisplayed()).toBeTruthy();
});
```

### API Test
```javascript
test('TC031 - Health check endpoint', async ({ request }) => {
  const response = await request.get('http://localhost:8000/api/health');
  
  expect(response.status()).toBe(200);
  const data = await response.json();
  expect(data.status).toBe('OK');
});
```

## ⚙️ Configuration

### playwright.config.js
```javascript
{
  testDir: './tests',
  timeout: 30000,
  fullyParallel: true,
  retries: CI ? 2 : 0,
  workers: CI ? 1 : undefined,
  reporter: ['html', 'list', 'json'],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  }
}
```

## 📊 CI/CD Integration

### GitHub Actions (.github/workflows/test.yml)

```yaml
playwright-tests:
  runs-on: ubuntu-latest
  steps:
    - Checkout code
    - Setup Node.js
    - Install FE dependencies
    - Start FE server
    - Wait for server ready
    - Install Playwright
    - Run Playwright tests
    - Upload reports (screenshots, videos, HTML)
```

### Workflow Flow
```
Push to master
     ↓
update.yml (Deploy)
     ↓ (on success)
test.yml (Testing)
     ↓
security-and-quality (parallel)
     ├─ SonarCloud
     ├─ Snyk
     └─ Trivy
     
playwright-tests (parallel)
     ├─ 40+ E2E tests
     ├─ Screenshots on failure
     └─ Video recording
     
test-summary
     └─ Overall results
```

## 🔧 Best Practices

### 1. Page Object Pattern
✅ **DO**: Tách locators và logic riêng biệt
```javascript
class MyPage extends BasePage {
  constructor(page) {
    super(page);
    this.btnSubmit = 'button[type="submit"]'; // Locator
  }
  
  async submit() { // Logic
    await this.click(this.btnSubmit);
  }
}
```

❌ **DON'T**: Hard-code selectors trong test
```javascript
test('bad test', async ({ page }) => {
  await page.click('button[type="submit"]'); // Bad!
});
```

### 2. Wait Strategies
✅ **DO**: Sử dụng explicit waits
```javascript
await page.waitForSelector('.data-loaded');
await page.waitForURL('**/dashboard');
```

❌ **DON'T**: Sử dụng arbitrary sleep
```javascript
await page.waitForTimeout(5000); // Avoid!
```

### 3. Test Independence
✅ **DO**: Mỗi test độc lập
```javascript
test.beforeEach(async ({ page }) => {
  // Clean state for each test
  await page.goto('/');
  await clearDatabase();
});
```

❌ **DON'T**: Tests phụ thuộc nhau
```javascript
// Test 2 cần Test 1 chạy trước => Bad!
```

### 4. Assertions
✅ **DO**: Clear và specific assertions
```javascript
expect(await page.title()).toBe('Dashboard');
expect(element).toBeVisible();
```

❌ **DON'T**: Vague assertions
```javascript
expect(data).toBeTruthy(); // Too vague!
```

## 📈 Reports & Artifacts

### HTML Report
- Tổng quan test results
- Screenshots của failed tests
- Video recordings
- Trace viewer
- Test duration
- Flaky tests detection

### Artifacts
- `test-results/` - Screenshots, videos, traces
- `playwright-report/` - HTML report
- `results.json` - JSON results cho CI

## 🐛 Debugging

### Local Debugging
```bash
# Debug mode (opens Inspector)
npm run test:debug

# UI mode (interactive)
npm run test:ui

# Headed mode (see browser)
npm run test:headed

# Codegen (record test)
npm run test:codegen
```

### CI Debugging
1. Download artifacts from GitHub Actions
2. View screenshots in `test-results/`
3. Watch videos of failures
4. Open trace files in Trace Viewer

## 📚 Resources

- [Full README](../playwright/README.md)
- [Quick Start Guide](../playwright/QUICKSTART.md)
- [Playwright Docs](https://playwright.dev/)
- [Page Object Model](https://playwright.dev/docs/pom)

## ✅ Advantages vs Selenium

| Feature | Playwright | Selenium |
|---------|-----------|----------|
| **Speed** | ⚡ Faster | 🐌 Slower |
| **Auto-wait** | ✅ Built-in | ❌ Manual |
| **Multi-browser** | ✅ Modern | ✅ Legacy too |
| **Network interception** | ✅ Yes | ❌ Limited |
| **Screenshots/Videos** | ✅ Built-in | ❌ Manual |
| **Parallel tests** | ✅ Easy | ⚠️ Complex |
| **API testing** | ✅ Built-in | ❌ Need separate tool |
| **TypeScript** | ✅ First-class | ⚠️ Add-on |
| **Mobile emulation** | ✅ Built-in | ⚠️ Appium |
| **Trace viewer** | ✅ Powerful | ❌ None |

## 🎯 Why Playwright?

1. **Modern**: Built for modern web apps
2. **Fast**: Parallel execution by default
3. **Reliable**: Auto-wait, retry mechanisms
4. **Complete**: Browser + API + Mobile testing
5. **Developer-friendly**: Great debugging tools
6. **CI/CD ready**: Docker support, artifacts
7. **Active**: Microsoft-backed, frequent updates

---

**Framework Status**: ✅ Production Ready  
**Test Coverage**: 40+ test cases  
**Last Updated**: November 4, 2025

