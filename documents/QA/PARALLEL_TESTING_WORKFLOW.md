# ⚡ Parallel Testing Workflow

## 📋 Overview

Updated CI/CD workflow để chạy tests **song song** (parallel), giảm thời gian test từ **~15 phút xuống ~5 phút**.

## 🏗️ Architecture

```
Deploy (update.yml)
    ↓
    ├─→ SonarCloud (riêng biệt, không block)
    ├─→ Snyk Security (song song)
    ├─→ Trivy Security (song song)
    └─→ Playwright E2E (song song)
    ↓
Test Summary (aggregate results)
```

## 🎯 Jobs

### 1. **SonarCloud** (Job riêng)
- **Mục đích**: Code quality analysis
- **Chạy**: Song song, độc lập
- **Fail strategy**: `continue-on-error: true` (không block workflow)
- **Note**: Có thể fail nếu chưa config SonarCloud project

**Bước:**
1. Checkout code với full history (`fetch-depth: 0`)
2. Run SonarCloud scan

### 2. **Snyk Security** (Job riêng)
- **Mục đích**: Security vulnerability scanning
- **Chạy**: Song song với SonarCloud, Trivy, Playwright
- **Scan targets**:
  - Frontend source code
  - Backend source code
  - Frontend Docker image
  - Backend Docker image

**Bước:**
1. Checkout code
2. Setup Node.js
3. Install FE & BE dependencies
4. Install Snyk CLI
5. Snyk test source code (FE + BE)
6. Build Docker images
7. Snyk container scan (FE + BE images)

**Continue-on-error**: Yes (từng step riêng lẻ)

### 3. **Trivy Security** (Job riêng)
- **Mục đích**: Container security scanning
- **Chạy**: Song song với Snyk, SonarCloud, Playwright
- **Scan targets**:
  - Frontend Docker image
  - Backend Docker image

**Bước:**
1. Checkout code
2. Build Docker images (FE + BE)
3. Install Trivy
4. Trivy scan images
5. Generate JSON reports
6. Upload artifacts

**Continue-on-error**: Yes (upload artifacts)

### 4. **Playwright E2E Tests** (Job riêng)
- **Mục đích**: End-to-end testing trên production
- **Chạy**: Song song với security scans
- **Target**: `https://lightoptimization.io.vn`

**Bước:**
1. Checkout code
2. Setup Node.js
3. Install Playwright dependencies
4. Install Chromium browser
5. Run E2E tests
6. Upload test results
7. Upload HTML report

**Continue-on-error**: Yes (for uploads)

### 5. **Test Summary** (Aggregation)
- **Mục đích**: Tổng hợp kết quả tất cả jobs
- **Depends on**: All 4 jobs above
- **Always runs**: `if: always()`

**Output:**
```
🧪 Test Results Summary

### SonarCloud Analysis
Status: success/failure/skipped

### Snyk Security Scans
Status: success/failure/skipped

### Trivy Security Scans
Status: success/failure/skipped

### Playwright E2E Tests
Status: success/failure/skipped

✅ X/4 test suites passed
```

## ⚡ Performance Improvements

### Before (Sequential):
```
Setup → Install FE → Install BE → SonarCloud → Snyk Source → 
Snyk Container → Trivy → Playwright → Upload
Total: ~15-20 minutes
```

### After (Parallel):
```
┌─ SonarCloud (~3 min)
├─ Snyk (~5 min)
├─ Trivy (~5 min)
└─ Playwright (~3 min)
Total: ~5-6 minutes (longest job)
```

**Improvement**: ~70% faster ⚡

## 🔧 Configuration

### Continue-on-Error Strategy

**SonarCloud**: Job-level
```yaml
continue-on-error: true  # Toàn bộ job
```

**Snyk & Trivy**: Step-level
```yaml
continue-on-error: true  # Từng step riêng
```

**Why?**
- Cho phép workflow hoàn thành ngay cả khi có failures
- Vẫn collect artifacts và reports
- Deployment không bị block bởi security scans

### Trigger Options

**1. Automatic** (sau khi deploy)
```yaml
on:
  workflow_run:
    workflows: ["Deploy to VPS"]
    types:
      - completed
```

**2. Manual** (chạy thủ công)
```yaml
on:
  workflow_dispatch:
```

Chạy manual: **Actions tab → Quality & Security Tests → Run workflow**

## 📊 Artifacts

### Generated Artifacts:
1. **Trivy Reports**: `trivy-fe-report.json`, `trivy-be-report.json`
2. **Playwright Results**: `playwright/test-results/`
3. **Playwright HTML Report**: `playwright/playwright-report/`

### Retention: 30 days

## 🚨 Troubleshooting

### Job failed nhưng không ảnh hưởng workflow?
✅ **Expected behavior** - jobs có `continue-on-error: true`

### SonarCloud fails với "Project not found"?
1. Create project trên SonarCloud dashboard
2. Add `sonar-project.properties` file
3. Hoặc skip SonarCloud bằng cách comment job

### Snyk fails với token issues?
1. Verify `SNYK_TOKEN` secret exists
2. Check token permissions
3. Fallback: `|| true` ensures step passes

### Playwright fails vì không access được production?
1. Check production site is up: `https://lightoptimization.io.vn`
2. Verify no firewall blocking GitHub IPs
3. Check test credentials if needed

## 📝 Best Practices

1. **Review all artifacts** ngay cả khi workflow passes
2. **Check summary** để xem job nào failed
3. **Fix critical issues** từ Snyk/Trivy reports
4. **Update tests** khi Playwright fails
5. **Monitor trends** - are failures increasing?

## 🔄 Future Improvements

- [ ] Add Lighthouse performance tests
- [ ] Add accessibility (a11y) tests
- [ ] Cache Docker layers để build nhanh hơn
- [ ] Parallel matrix testing (multiple browsers)
- [ ] Scheduled security scans (weekly)
- [ ] Integration với Slack notifications

## 📚 Related Docs

- [Playwright Production Testing](./PLAYWRIGHT_PRODUCTION_TESTING.md)
- [Playwright Framework](./PLAYWRIGHT_FRAMEWORK.md)
- [Debug & Exploration](../../playwright/debug/README.md)

