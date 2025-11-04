# 🌐 Playwright Production Testing Setup

## 📋 Tổng quan

Playwright framework đã được cấu hình để test **trực tiếp trên production website** `https://lightoptimization.io.vn` thay vì test trên localhost.

## ✅ Lợi ích của Production Testing

### 1. **Test đúng môi trường thực tế**
- ✅ Test trên infrastructure thật (server, database, network)
- ✅ Phát hiện issues chỉ xuất hiện trên production
- ✅ Validate real user experience

### 2. **CI/CD Pipeline nhanh hơn**
- ✅ Không cần build frontend trên runner (tiết kiệm ~2-3 phút)
- ✅ Không cần start dev server
- ✅ Không cần wait for server ready
- ✅ Chỉ cần install Playwright và run tests

### 3. **Đơn giản hóa workflow**
- ✅ Ít bước hơn trong pipeline
- ✅ Ít dependency hơn
- ✅ Ít lỗi potential hơn

## 🔧 Các thay đổi đã thực hiện

### 1. `playwright/playwright.config.js`
```javascript
// Before
baseURL: process.env.BASE_URL || 'http://localhost:5173'

// After
baseURL: process.env.BASE_URL || 'https://lightoptimization.io.vn'
```

### 2. `.github/workflows/test.yml`

**Removed steps:**
- ❌ Install FE dependencies
- ❌ Start FE server
- ❌ Wait for FE server ready

**Updated environment variables:**
```yaml
env:
  BASE_URL: https://lightoptimization.io.vn
  API_URL: https://lightoptimization.io.vn/api
```

### 3. `playwright/README.md`
- Updated documentation để reflect production testing as default

## 🚀 Cách sử dụng

### Test trên Production (Default)
```bash
cd playwright
npm test
```

### Test trên Local Development
```bash
# 1. Set environment variable
export BASE_URL=http://localhost:5173
export API_URL=http://localhost:8000

# 2. Run tests
npm test
```

Hoặc tạo `.env` file:
```env
BASE_URL=http://localhost:5173
API_URL=http://localhost:8000
```

## 📊 CI/CD Pipeline Flow

### Before (Localhost Testing)
```
1. Checkout code
2. Setup Node.js
3. Install FE dependencies (~1-2 min)
4. Start FE server
5. Wait for server ready (~30s)
6. Install Playwright
7. Run tests
8. Upload reports
```
**Total: ~5-7 minutes**

### After (Production Testing)
```
1. Checkout code
2. Setup Node.js
3. Install Playwright (~1 min)
4. Run tests (~2-3 min)
5. Upload reports
```
**Total: ~3-4 minutes** ⚡

## ⚠️ Lưu ý quan trọng

### 1. **Production data**
Tests sẽ interact với production database. Ensure:
- ✅ Test accounts không ảnh hưởng production users
- ✅ Test data được cleanup sau khi test
- ✅ Không modify critical data

### 2. **Rate limiting**
Production server có thể có rate limiting:
- ✅ Use `retries: 2` trong config
- ✅ Use proper waits thay vì hardcoded sleeps
- ✅ Consider running tests during low-traffic hours

### 3. **Authentication**
- ✅ Use dedicated test accounts
- ✅ Store credentials securely (GitHub Secrets)
- ✅ Rotate credentials regularly

### 4. **Network issues**
Production testing phụ thuộc vào network:
- ✅ Configure proper timeouts
- ✅ Handle network errors gracefully
- ✅ Use `continue-on-error: true` trong CI

## 🔍 Monitoring & Debugging

### View test results
```bash
# Open HTML report
npx playwright show-report
```

### CI/CD artifacts
Test reports được upload tự động:
- `playwright-report/` - Raw test results
- `playwright-html-report/` - HTML report
- Screenshots & videos của failed tests

### Check production logs
Nếu tests fail, check:
1. GitHub Actions artifacts
2. Production server logs
3. Browser console logs (trong Playwright report)

## 🎯 Best Practices

### 1. **Idempotent tests**
Tests nên có thể chạy nhiều lần không ảnh hưởng lẫn nhau:
```javascript
// Good: Create unique test data
const email = `test_${Date.now()}@example.com`;

// Bad: Hardcoded data có thể conflict
const email = 'test@example.com';
```

### 2. **Proper cleanup**
```javascript
test.afterEach(async ({ page }) => {
  // Cleanup test data
  await page.evaluate(() => localStorage.clear());
});
```

### 3. **Robust selectors**
```javascript
// Good: Data attributes
await page.click('[data-testid="login-button"]');

// Good: Accessible roles
await page.click('button:has-text("Login")');

// Bad: Fragile CSS selectors
await page.click('.btn-primary.mt-4.px-6');
```

### 4. **Meaningful assertions**
```javascript
// Good: Descriptive message
await expect(page.locator('[data-testid="user-name"]'))
  .toHaveText('John Doe', { message: 'User name should be displayed after login' });

// Bad: No context
await expect(page.locator('.name')).toHaveText('John Doe');
```

## 📚 Tài liệu liên quan

- [Playwright Framework Overview](./PLAYWRIGHT_FRAMEWORK.md)
- [Playwright Quick Start](./PLAYWRIGHT_QUICKSTART.md)
- [Playwright Full README](./PLAYWRIGHT_README.md)
- [CI/CD Workflows](./CI_CD_WORKFLOWS.md)

## 🤝 Rollback to Localhost Testing

Nếu cần rollback về localhost testing:

1. Update `playwright.config.js`:
```javascript
baseURL: process.env.BASE_URL || 'http://localhost:5173'
```

2. Update `.github/workflows/test.yml` - add back FE build steps

3. Commit và push changes

## 📞 Support

Nếu có issues với production testing:
1. Check GitHub Actions logs
2. Review Playwright reports
3. Verify production website accessibility
4. Check network/firewall settings

---

**Last updated:** November 4, 2025  
**Configuration:** Production Testing Enabled ✅

