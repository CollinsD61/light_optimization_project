# 🔄 CI/CD Workflows

## Tổng quan

Dự án sử dụng 2 workflows riêng biệt để tối ưu tốc độ deployment:

### 1️⃣ **Deploy to VPS** (`update.yml`)
**Mục đích:** Deploy nhanh lên production  
**Trigger:** Push lên branch `master`  
**Thời gian:** ~5-10 phút

**Các bước:**
1. ✅ Checkout code
2. ✅ Setup Node.js
3. ✅ Install dependencies (FE + BE)
4. ✅ Lint & Build FE
5. ✅ Setup SSH
6. ✅ Rsync code lên VPS
7. ✅ Docker Compose build & deploy
8. ✅ Verify deployment

**Đặc điểm:**
- ⚡ Nhanh - không chạy test
- 🚀 Deploy trực tiếp lên production
- 🔄 Auto-trigger workflow test sau khi hoàn thành

---

### 2️⃣ **Quality & Security Tests** (`test.yml`)
**Mục đích:** Chạy các bước test & security scan  
**Trigger:** 
- Tự động sau khi `update.yml` chạy xong thành công
- Hoặc chạy thủ công qua GitHub Actions UI

**Thời gian:** ~15-30 phút

**Các bước:**

#### **Job 1: Security & Quality (chạy song song)**
1. ✅ SonarCloud Scan - Code quality
2. ✅ Snyk Source Scan - Dependency vulnerabilities (FE + BE)
3. ✅ Snyk Container Scan - Docker image vulnerabilities
4. ✅ Trivy Scan - Docker image security (CRITICAL + HIGH)
5. ✅ Generate & upload reports

#### **Job 2: Selenium Tests (chạy song song)**
1. ✅ Start local FE server
2. ✅ Run Selenium UI tests
3. ✅ Upload screenshots (nếu có lỗi)

#### **Job 3: Test Summary**
1. ✅ Tổng hợp kết quả từ cả 2 jobs
2. ✅ Hiển thị summary

**Đặc điểm:**
- 🧪 Comprehensive testing
- 🔒 Security scanning
- 🎯 Chạy sau deployment (không block release)
- ⚙️ Có thể chạy thủ công bất cứ lúc nào

---

## 🔧 Cách sử dụng

### Deploy lên Production
```bash
git add .
git commit -m "Your changes"
git push origin master
```

→ `update.yml` sẽ tự động:
1. Deploy lên VPS
2. Trigger `test.yml` để chạy tests

### Chạy Tests thủ công
1. Vào GitHub → Actions tab
2. Chọn workflow **"Quality & Security Tests"**
3. Click **"Run workflow"**
4. Chọn branch và click **"Run workflow"**

---

## 📊 Workflow Diagram

```
┌─────────────────┐
│  Push to master │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│   Deploy to VPS         │
│   (update.yml)          │
│   • Build                │
│   • Deploy               │
│   • Verify               │
└────────┬────────────────┘
         │ (on success)
         ▼
┌─────────────────────────┐
│ Quality & Security Tests│
│ (test.yml)              │
│                         │
│  ┌─────────────────┐   │
│  │ Security Scans  │   │
│  │ • SonarCloud    │   │
│  │ • Snyk          │   │
│  │ • Trivy         │   │
│  └─────────────────┘   │
│           │             │
│  ┌─────────────────┐   │
│  │ Selenium Tests  │   │
│  │ • UI Testing    │   │
│  └─────────────────┘   │
│           │             │
│  ┌─────────────────┐   │
│  │ Test Summary    │   │
│  └─────────────────┘   │
└─────────────────────────┘
```

---

## 🎯 Lợi ích của cách tiếp cận này

### ✅ **Fast Deployment**
- Deploy trong 5-10 phút thay vì 30-45 phút
- Không phải chờ test chạy xong
- Production được update nhanh hơn

### ✅ **Comprehensive Testing**
- Vẫn chạy đầy đủ tất cả tests
- Không bỏ sót security scans
- Tests chạy sau deployment (không block)

### ✅ **Better Developer Experience**
- Push code → Deploy ngay
- Xem kết quả test sau
- Có thể hotfix nhanh nếu cần

### ✅ **Flexibility**
- Chạy tests bất cứ lúc nào
- Không phụ thuộc vào deployment
- Có thể debug tests riêng

---

## 🔐 Required Secrets

Cần config các secrets sau trong GitHub Settings:

```yaml
SSH_KEY: Private SSH key để connect tới VPS
SSH_USER: Username SSH (thường là root)
SSH_HOST: IP hoặc domain của VPS
SONAR_TOKEN: Token cho SonarCloud
SNYK_TOKEN: Token cho Snyk
```

### Cách thêm secrets:
1. Vào repo → Settings → Secrets and variables → Actions
2. Click **"New repository secret"**
3. Nhập Name và Value
4. Click **"Add secret"**

---

## 📝 Best Practices

### ✅ DO
- Kiểm tra kết quả test sau mỗi deployment
- Fix security issues khi Snyk/Trivy báo
- Review SonarCloud reports để cải thiện code quality
- Chạy tests thủ công trước khi merge PR lớn

### ❌ DON'T
- Ignore security warnings
- Skip checking test results
- Push trực tiếp lên master mà không test local
- Disable workflows nếu không cần thiết

---

## 🐛 Troubleshooting

### Test workflow không tự động chạy?
**Nguyên nhân:** `update.yml` failed  
**Fix:** Test workflow chỉ chạy khi deployment thành công

### Selenium tests fail?
**Nguyên nhân:** Frontend không start kịp  
**Fix:** Đã tăng timeout lên 45s (15 attempts × 3s)

### Snyk/Trivy báo nhiều vulnerabilities?
**Nguyên nhân:** Dependencies hoặc base images có lỗ hổng  
**Fix:** 
- Update dependencies: `npm update`
- Update base images trong Dockerfile
- Hoặc accept risk nếu không critical

### SonarCloud fail?
**Nguyên nhân:** Code quality không đạt threshold  
**Fix:** 
- Xem report chi tiết trên SonarCloud
- Fix code smells, bugs, vulnerabilities
- Hoặc adjust quality gate settings

---

## 📚 Tài liệu tham khảo

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [SonarCloud](https://sonarcloud.io/)
- [Snyk](https://snyk.io/)
- [Trivy](https://github.com/aquasecurity/trivy)
- [Selenium](https://www.selenium.dev/)

