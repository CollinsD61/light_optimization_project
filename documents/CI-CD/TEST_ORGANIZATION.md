# Test Organization & CI/CD Integration

## 📚 Overview

This document explains how our test suite is organized and how to run different test types in both **local development** and **CI/CD pipeline**.

---

## 🏷️ Test Categories

Our Playwright tests are organized into **4 main categories** using tags:

| Category | Tag | Description | Tests Count | Duration | When to Run |
|----------|-----|-------------|-------------|----------|-------------|
| **Smoke** | `@smoke` | Critical functionality checks | 20 | ~1-2 min | Every commit, before deployment |
| **API** | `@api` | Backend API endpoint validation | 10 | ~30 sec | After API changes |
| **E2E** | `@e2e` | End-to-end user journeys | 25 | ~3-5 min | Before releases |
| **Regression** | `@regression` | Full comprehensive suite | 33 | ~5-10 min | Before production, weekly |

---

## 🚀 Running Tests Locally

### Prerequisites

```bash
cd playwright
npm install
npx playwright install --with-deps chromium
```

### Run Different Test Suites

```bash
# Run all tests (default)
npx playwright test --project=chromium

# Run smoke tests only (fastest)
npx playwright test --project=smoke

# Run API tests only
npx playwright test --project=api

# Run E2E tests only
npx playwright test --project=e2e

# Run regression tests (all tests)
npx playwright test --project=regression
```

### Advanced Options

```bash
# Run with UI mode
npx playwright test --ui

# Run in debug mode
npx playwright test --debug

# Run with headed browser
npx playwright test --headed

# Run specific test file
npx playwright test tests/api.spec.js

# Run tests matching pattern
npx playwright test --grep "@smoke"
```

---

## 🤖 CI/CD Integration

### Automatic Triggers

| Trigger | Test Suite | Purpose |
|---------|-----------|---------|
| After Deployment | **Regression** | Full validation of deployed code |
| Scheduled (Nightly) | **Regression** | Catch overnight issues |
| Pull Request | **Smoke** | Quick validation before merge |

### Manual Triggers

You can manually trigger the test pipeline with different test suites:

#### Step 1: Go to Actions Tab
Navigate to: `https://github.com/YOUR_REPO/actions`

#### Step 2: Select "Quality & Security Tests" Workflow
Click on the workflow from the left sidebar.

#### Step 3: Click "Run workflow"
A dropdown will appear.

#### Step 4: Select Test Suite
Choose from the dropdown:
- **smoke** - Quick sanity checks (~1-2 min)
- **api** - API tests only (~30 sec)
- **e2e** - End-to-end flows (~3-5 min)
- **regression** - Full test suite (~5-10 min)
- **chromium** - All tests on Chromium browser

#### Step 5: Click "Run workflow" Button
The pipeline will start with your selected test suite.

---

## 📊 Test Coverage by Category

### Smoke Tests (@smoke)
**Purpose**: Quick validation of critical paths

**Includes**:
- ✅ API health checks
- ✅ User authentication (login/logout)
- ✅ Basic dashboard navigation
- ✅ Session management
- ✅ Protected routes

**Files**: `api.spec.js` (10 tests), `auth.spec.js` (10 tests)

### API Tests (@api)
**Purpose**: Backend API validation

**Includes**:
- ✅ All `/api/*` endpoints
- ✅ Authentication endpoints
- ✅ Sensor data endpoints
- ✅ CORS and security headers
- ✅ Error handling

**Files**: `api.spec.js` (10 tests)

### E2E Tests (@e2e)
**Purpose**: Full user journey validation

**Includes**:
- ✅ Complete authentication flows
- ✅ Dashboard interactions
- ✅ Data filtering and export
- ✅ Navigation between pages
- ✅ Form submissions

**Files**: `auth.spec.js` (10 tests), `dashboard.spec.js` (15 tests)

### Regression Tests (@regression)
**Purpose**: Comprehensive test coverage

**Includes**:
- ✅ All smoke tests
- ✅ All API tests
- ✅ All E2E tests
- ✅ Edge cases
- ✅ Complex scenarios

**Files**: All test files (33 tests)

---

## 🔧 Configuration

### Environment Variables

Tests use different URLs based on environment:

#### Local Testing
```bash
BASE_URL=http://localhost:5173
API_URL=http://localhost:8000
```

#### Production Testing (CI/CD)
```bash
BASE_URL=https://lightoptimization.io.vn
API_URL=https://api.lightoptimization.io.vn
```

### Timeout Settings

| Setting | Local | CI/CD | Reason |
|---------|-------|-------|--------|
| Test Timeout | 30s | 60s | CI runners are slower |
| Action Timeout | 10s | 15s | Network latency |
| Navigation Timeout | 15s | 30s | Page load times |

### Execution Mode

| Setting | Value | Reason |
|---------|-------|--------|
| Workers | 1 | Sequential execution for stability |
| Retries (Local) | 0 | Fail fast for debugging |
| Retries (CI) | 2 | Account for network issues |
| Screenshot | On failure | Debug failed tests |
| Video | On failure | Replay failed scenarios |

---

## 📈 CI/CD Pipeline Flow

```
┌─────────────────────────────────────────────────────────────┐
│  Deploy to VPS (update.yml)                                 │
│  ✅ Code deployed successfully                              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  Quality & Security Tests (test.yml)                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ SonarCloud   │  │ Snyk         │  │ Trivy        │     │
│  │ Analysis     │  │ Security     │  │ Container    │     │
│  │              │  │              │  │ Scan         │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Playwright Tests                                    │   │
│  │                                                     │   │
│  │  Auto: Regression Suite (33 tests, ~5-10 min)     │   │
│  │  Manual: User-selected suite                       │   │
│  │                                                     │   │
│  │  • @smoke    → 20 tests (~1-2 min)                │   │
│  │  • @api      → 10 tests (~30 sec)                 │   │
│  │  • @e2e      → 25 tests (~3-5 min)                │   │
│  │  • @regression → 33 tests (~5-10 min)             │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  Test Summary & Discord Notification                        │
│                                                             │
│  ✅ All Tests Passed → Green notification                   │
│  ⚠️  Some Failed → Yellow notification                      │
│  ❌ Multiple Failures → Red notification                    │
│                                                             │
│  Includes:                                                  │
│  • Success rate (X/4 test suites)                          │
│  • Test suite type (smoke/api/e2e/regression)              │
│  • Individual test results                                 │
│  • Commit info & duration                                  │
│  • Quick links to reports                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Discord Notifications

Discord notifications now include:

### Rich Embed Information
- ✅ **Overall status** with colored indicator (Green/Yellow/Red)
- ✅ **Test suite type** - Shows which suite was run (smoke/api/e2e/regression)
- ✅ **Success rate** - X/4 test suites passed with percentage
- ✅ **Individual results** - Status for each test category
- ✅ **Commit information** - Author, message, and SHA
- ✅ **Duration** - Approximate execution time
- ✅ **Quick links** - Direct links to GitHub Actions, HTML report, and repository

### Example Notification

```
🤖 CI/CD Pipeline
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎉 Quality & Security Test Pipeline

🎉 ALL TESTS PASSED

Automated quality, security, and E2E test results
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔍 SonarCloud Analysis
✅ Passed
Code quality checks passed

🛡️ Snyk Security Scan
✅ Passed
No vulnerabilities found

🔒 Trivy Container Scan
✅ Passed
Container security OK

🎭 Playwright E2E Tests
✅ Passed
All regression tests successful

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Success Rate: 4/4 test suites passed (100%)
🎯 Test Suite: regression
⏱️ Duration: ~7 minutes
🌿 Branch: master
👤 Triggered by: ChuHai
💬 Commit: "Implement test organization" (a1b2c3d)

🔗 View Run | 📊 HTML Report | 📁 Repository
```

---

## 📝 Writing New Tests

### Add Tags to Test Suite

When creating new tests, always add appropriate tags:

```javascript
test.describe('My Feature Tests', { 
  tag: ['@e2e', '@regression']  // Add appropriate tags
}, () => {
  
  test('TC050 - My test case', async ({ page }) => {
    // Test implementation
  });
  
});
```

### Tag Guidelines

| Tag | When to Use |
|-----|-------------|
| `@smoke` | Critical functionality that must work |
| `@api` | Backend API validation |
| `@e2e` | UI interaction and user flows |
| `@regression` | All tests (comprehensive) |

**Rules**:
- ✅ Every test should have at least one tag
- ✅ Critical tests should include `@smoke`
- ✅ API tests should include `@api`
- ✅ UI tests should include `@e2e`
- ✅ All tests should include `@regression`

---

## 🐛 Debugging Failed Tests

### View Test Results

#### 1. GitHub Actions UI
```
Actions → Quality & Security Tests → Latest Run → playwright-tests
```

#### 2. HTML Report (Artifact)
Download `playwright-html-report` artifact and open `index.html`

#### 3. Test Traces
Download traces from failed tests and view:
```bash
npx playwright show-trace test-results/[test-name]/trace.zip
```

### Failed Test Artifacts

Automatically saved for failed tests:
- **Screenshots**: `test-results/*/test-failed-*.png`
- **Videos**: `test-results/*/video.webm`
- **Traces**: `test-results/*/trace.zip`
- **HTML Report**: `playwright-report/index.html`

---

## 📊 Success Metrics

### Current Performance

| Metric | Value | Status |
|--------|-------|--------|
| Total Tests | 33 active, 2 skipped | ✅ |
| Pass Rate (Local) | 100% | ✅ |
| Pass Rate (CI) | 100% | ✅ |
| Average Duration (Local) | 1.6 min | ✅ |
| Average Duration (CI) | ~7-10 min | ✅ |

### Test Stability

- **Flakiness**: 0% (no flaky tests)
- **Retries Needed**: 0-1 on CI
- **Timeout Issues**: Resolved with increased timeouts

---

## 🔗 Related Documentation

- [Playwright Test Suite README](../../playwright/README.md)
- [Discord Notification Setup](./QUICK_START_DISCORD.md)
- [CI/CD Pipeline Configuration](../../.github/workflows/test.yml)
- [Playwright Configuration](../../playwright/playwright.config.js)

---

**Last Updated**: 2025-01-06  
**Maintained by**: QA & DevOps Team

