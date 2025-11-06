# Playwright Test Suite Organization

## 📋 Test Categories

Our tests are organized into 4 main categories using tags:

### 🔥 Smoke Tests (`@smoke`)
- **Purpose**: Quick sanity checks for critical functionality
- **Duration**: ~1-2 minutes
- **When to run**: Before every deployment, after every commit
- **Includes**:
  - API health checks
  - Login functionality
  - Basic authentication
  - Critical user flows

### 🔌 API Tests (`@api`)
- **Purpose**: Backend API endpoint validation
- **Duration**: ~30 seconds
- **When to run**: After API changes, in CI/CD pipeline
- **Includes**:
  - All `/api/*` endpoints
  - Authentication endpoints
  - Sensor data endpoints
  - CORS and security headers

### 🌐 E2E Tests (`@e2e`)
- **Purpose**: End-to-end user journeys
- **Duration**: ~3-5 minutes
- **When to run**: Before major releases, nightly builds
- **Includes**:
  - Full authentication flows
  - Dashboard interactions
  - Navigation between pages
  - User session management

### 🔄 Regression Tests (`@regression`)
- **Purpose**: Comprehensive test coverage
- **Duration**: ~5-10 minutes
- **When to run**: Before production deployment, weekly
- **Includes**:
  - All smoke, API, and E2E tests
  - Edge cases
  - Data filtering and export
  - Complex user interactions

---

## 🚀 Running Tests

### Run All Tests (Default)
```bash
npx playwright test
# or
npx playwright test --project=chromium
```

### Run Specific Test Categories

#### Smoke Tests (Fastest)
```bash
npx playwright test --project=smoke
```

#### API Tests Only
```bash
npx playwright test --project=api
```

#### E2E Tests Only
```bash
npx playwright test --project=e2e
```

#### Regression Tests (Full Suite)
```bash
npx playwright test --project=regression
```

### Run Tests with UI Mode
```bash
npx playwright test --ui
```

### Run Tests in Debug Mode
```bash
npx playwright test --debug
```

### Run Tests with Headed Browser
```bash
npx playwright test --headed
```

---

## 📊 Test Structure

```
playwright/
├── tests/
│   ├── api.spec.js          # @api, @smoke, @regression
│   ├── auth.spec.js         # @e2e, @smoke, @regression
│   └── dashboard.spec.js    # @e2e, @regression
├── pages/
│   ├── BasePage.js
│   ├── LoginPage.js
│   ├── DashboardPage.js
│   └── SignUpPage.js
├── utils/
│   └── apiHelpers.js
├── playwright.config.js
└── README.md
```

---

## 🏷️ Test Tags Reference

| Tag | Tests Included | Execution Time | Use Case |
|-----|---------------|----------------|----------|
| `@smoke` | API + Auth (critical) | ~1-2 min | Quick validation |
| `@api` | All API tests | ~30 sec | Backend changes |
| `@e2e` | Auth + Dashboard | ~3-5 min | User flows |
| `@regression` | All tests | ~5-10 min | Full validation |

---

## 🔧 Configuration

### Environment Variables

```bash
# Backend API URL
API_URL=https://api.lightoptimization.io.vn

# Frontend Base URL
BASE_URL=https://lightoptimization.io.vn
```

### Timeouts

- **Local**: 30s per test
- **CI/CD**: 60s per test (slower environment)
- **Action Timeout**: 10s (local), 15s (CI)
- **Navigation Timeout**: 15s (local), 30s (CI)

### Execution Mode

- **Workers**: 1 (sequential execution)
- **Retries**: 0 (local), 2 (CI)
- **Screenshot**: On failure
- **Video**: On failure

---

## 📈 CI/CD Integration

### GitHub Actions Workflow

Tests run automatically in CI/CD:

1. **On Pull Request**: Smoke tests
2. **On Merge to Main**: Regression tests
3. **Scheduled (Nightly)**: Full regression suite

### Run Specific Test Suite in CI

Modify `.github/workflows/test.yml`:

```yaml
- name: Run Playwright Tests
  run: npx playwright test --project=smoke  # Change project here
```

---

## 🎯 Test Coverage

### Current Test Count

- **API Tests**: 10 tests
- **Auth Tests**: 10 tests
- **Dashboard Tests**: 15 tests
- **Total**: 35 tests (33 active, 2 skipped)

### Coverage by Category

| Category | Tests | Status |
|----------|-------|--------|
| Smoke | 20 tests | ✅ 100% passing |
| API | 10 tests | ✅ 100% passing |
| E2E | 25 tests | ✅ 100% passing |
| Regression | 33 tests | ✅ 100% passing |

---

## 🐛 Debugging Failed Tests

### View Test Report
```bash
npx playwright show-report
```

### View Trace (Interactive Timeline)
```bash
npx playwright show-trace test-results/[test-name]/trace.zip
```

### Screenshots and Videos
Failed tests automatically save:
- Screenshots: `test-results/*/test-failed-*.png`
- Videos: `test-results/*/video.webm`

---

## 📝 Writing New Tests

### Add Tags to Test Suite

```javascript
test.describe('My Feature Tests', { 
  tag: ['@e2e', '@regression']  // Add appropriate tags
}, () => {
  // Your tests here
});
```

### Tag Guidelines

- **Every test** should have at least one tag
- **Critical tests** should include `@smoke`
- **API tests** should include `@api`
- **UI tests** should include `@e2e`
- **All tests** should include `@regression`

---

## 🔗 Useful Commands

```bash
# List all projects
npx playwright test --list

# Run specific test file
npx playwright test tests/api.spec.js

# Run tests matching pattern
npx playwright test --grep "@smoke"

# Run tests with specific browser
npx playwright test --project=chromium

# Update snapshots
npx playwright test --update-snapshots

# Install browsers
npx playwright install
```

---

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev)
- [Test Organization Best Practices](https://playwright.dev/docs/test-annotations)
- [CI/CD Setup Guide](../documents/CI-CD/)

---

**Last Updated**: 2025-01-06  
**Maintained by**: QA Team
