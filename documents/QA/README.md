# 🧪 QA & Testing Documentation

Documentation về testing framework, CI/CD, E2E tests với Playwright.

## 📚 Available Documents

### 1. [PLAYWRIGHT_FRAMEWORK.md](PLAYWRIGHT_FRAMEWORK.md)
Tổng quan về Playwright testing framework:
- Framework overview
- Page Object Model pattern
- 40+ test cases (TC001-TC040)
- Multi-browser testing
- CI/CD integration
- Best practices
- Playwright vs Selenium comparison

### 2. [PLAYWRIGHT_README.md](PLAYWRIGHT_README.md)
Chi tiết đầy đủ về Playwright setup:
- Installation guide
- Project structure
- Page Objects documentation
- Test specifications
- Running tests
- Debugging
- Reports & artifacts

### 3. [PLAYWRIGHT_QUICKSTART.md](PLAYWRIGHT_QUICKSTART.md)
Quick start guide cho Playwright:
- Prerequisites
- Installation (3 commands)
- Running tests
- Common commands
- Troubleshooting
- Writing new tests

### 4. [CI_CD_WORKFLOWS.md](CI_CD_WORKFLOWS.md)
GitHub Actions CI/CD workflows:
- `update.yml` - Fast deployment workflow
- `test.yml` - Quality & security tests
- Workflow triggers
- Best practices
- Troubleshooting

### 5. [PLAYWRIGHT_PRODUCTION_TESTING.md](PLAYWRIGHT_PRODUCTION_TESTING.md) 🌐
Production testing configuration:
- Test trực tiếp trên `https://lightoptimization.io.vn`
- Benefits của production testing
- Configuration changes
- CI/CD optimization (~50% faster)
- Best practices & warnings
- Rollback instructions

### 6. [PARALLEL_TESTING_WORKFLOW.md](PARALLEL_TESTING_WORKFLOW.md) ⚡
Parallel testing workflow optimization:
- 4 jobs chạy song song (SonarCloud, Snyk, Trivy, Playwright)
- Giảm thời gian test ~70% (từ 15 phút xuống 5 phút)
- Continue-on-error strategy
- Job dependencies & aggregation
- Manual trigger support
- Performance improvements
- Troubleshooting guide

### 7. [IOT_ENDPOINT_VERIFICATION.md](IOT_ENDPOINT_VERIFICATION.md) 🔌
IoT endpoint verification & test results:
- Backend API subdomain: `api.lightoptimization.io.vn`
- Endpoint: `POST /api/receive-data`
- Test results: **33/33 tests passed** ✅
- Django → Node.js migration compatibility
- IoT device integration guide (Python, JavaScript)
- Architecture overview
- Production deployment checklist

---

## 🚀 Quick Start

```bash
# 1. Quick start với Playwright
cat PLAYWRIGHT_QUICKSTART.md

# 2. Hiểu framework
cat PLAYWRIGHT_FRAMEWORK.md

# 3. CI/CD workflows
cat CI_CD_WORKFLOWS.md
```

---

## 📖 For Different Roles

### QA Engineers
1. Framework: [PLAYWRIGHT_FRAMEWORK.md](PLAYWRIGHT_FRAMEWORK.md)
2. Quick start: [PLAYWRIGHT_QUICKSTART.md](PLAYWRIGHT_QUICKSTART.md)
3. Full docs: [PLAYWRIGHT_README.md](PLAYWRIGHT_README.md)

### DevOps Engineers
1. CI/CD: [CI_CD_WORKFLOWS.md](CI_CD_WORKFLOWS.md)
2. Integration: [PLAYWRIGHT_FRAMEWORK.md](PLAYWRIGHT_FRAMEWORK.md)

### Developers
1. Quick start: [PLAYWRIGHT_QUICKSTART.md](PLAYWRIGHT_QUICKSTART.md)
2. Writing tests: [PLAYWRIGHT_README.md](PLAYWRIGHT_README.md)

---

## 🧪 Test Coverage

### Authentication (TC001-TC010)
- Login, Signup, Logout
- Google OAuth
- Session management
- Protected routes

### Dashboard (TC011-TC025)
- Charts display
- Date filters
- Export functionality
- Navigation

### Map (TC026-TC030)
- Map display
- Sensor markers
- Real-time data

### API (TC031-TC040)
- Health check
- Authentication API
- Sensor data API
- IoT endpoints

**Total**: 40+ test cases

---

## 🎭 Playwright Features

- ✅ Page Object Model pattern
- ✅ Multi-browser (Chrome, Firefox, Safari, Mobile)
- ✅ Screenshots & videos on failure
- ✅ Trace viewer for debugging
- ✅ HTML reports
- ✅ CI/CD ready
- ✅ Parallel execution

---

## 🔄 CI/CD Pipeline (Optimized)

```
Push to master
     ↓
update.yml (~2-3 min) ⚡
  • Checkout code
  • Deploy to VPS
     ↓
test.yml (~5-6 min) ⚡ PARALLEL
  ├─ SonarCloud (~3 min)
  ├─ Snyk Security (~5 min)
  ├─ Trivy Security (~5 min)
  └─ Playwright E2E (~3 min)
     ↓
  Test Summary
  • Aggregate results
  • Upload artifacts
```

**Total**: ~7-9 minutes (70% faster than before!)

---

**Path**: `documents/QA/`  
**Docs**: 7 files  
**Topics**: Playwright, CI/CD, Testing, Security, IoT Integration

