# 📚 Project Documentation

Thư mục này chứa tất cả các tài liệu kỹ thuật của dự án, được tổ chức theo 3 modules chính.

## 📂 Cấu trúc Documents

```
documents/
├── README.md           # File này
├── BE/                 # 🔙 Backend Documentation
├── FE/                 # 🎨 Frontend Documentation
└── QA/                 # 🧪 QA & Testing Documentation
```

---

## 🔙 Backend Documentation (BE/)

Tài liệu về Node.js backend, migration, API, troubleshooting.

### 📖 Files:
- **[MIGRATION_GUIDE.md](BE/MIGRATION_GUIDE.md)** - Hướng dẫn migrate từ Django sang Node.js
- **[MIGRATION_COMPLETE.md](BE/MIGRATION_COMPLETE.md)** - Chi tiết về quá trình migration đã hoàn thành
- **[MIGRATION_COMPARISON.md](BE/MIGRATION_COMPARISON.md)** - So sánh Django vs Node.js backend
- **[QUICKSTART_NODEJS.md](BE/QUICKSTART_NODEJS.md)** - Quick start guide cho Node.js backend
- **[TROUBLESHOOTING.md](BE/TROUBLESHOOTING.md)** - Hướng dẫn debug và fix các vấn đề phổ biến

### 🎯 Quick Start:
```bash
# Đọc Migration Guide
cat documents/BE/MIGRATION_GUIDE.md

# Quick start với Node.js
cat documents/BE/QUICKSTART_NODEJS.md

# Troubleshooting
cat documents/BE/TROUBLESHOOTING.md
```

### 📚 Topics Covered:
- Django to Node.js migration
- Sequelize ORM setup
- JWT Authentication
- Google OAuth integration
- API endpoints structure
- Database schema mapping
- Error handling & debugging

---

## 🎨 Frontend Documentation (FE/)

Tài liệu về React frontend, API compatibility, IoT integration.

### 📖 Files:
- **[FRONTEND_COMPATIBILITY.md](FE/FRONTEND_COMPATIBILITY.md)** - Kiểm tra compatibility giữa FE và BE
- **[FRONTEND_FINAL_VERDICT.md](FE/FRONTEND_FINAL_VERDICT.md)** - Kết luận cuối cùng về frontend compatibility
- **[IOT_SENSOR_ENDPOINT.md](FE/IOT_SENSOR_ENDPOINT.md)** - API endpoint để nhận dữ liệu từ IoT sensors

### 🎯 Quick Start:
```bash
# Check FE/BE compatibility
cat documents/FE/FRONTEND_COMPATIBILITY.md

# IoT sensor API
cat documents/FE/IOT_SENSOR_ENDPOINT.md
```

### 📚 Topics Covered:
- Frontend/Backend API compatibility
- Snake_case vs camelCase handling
- IoT sensor data reception
- Public endpoints for devices
- API response formats
- Error handling in frontend

---

## 🧪 QA & Testing Documentation (QA/)

Tài liệu về testing framework, CI/CD, Playwright E2E tests.

### 📖 Files:
- **[PLAYWRIGHT_FRAMEWORK.md](QA/PLAYWRIGHT_FRAMEWORK.md)** - Tổng quan về Playwright testing framework
- **[PLAYWRIGHT_README.md](QA/PLAYWRIGHT_README.md)** - Chi tiết đầy đủ về Playwright setup
- **[PLAYWRIGHT_QUICKSTART.md](QA/PLAYWRIGHT_QUICKSTART.md)** - Quick start guide cho Playwright
- **[CI_CD_WORKFLOWS.md](QA/CI_CD_WORKFLOWS.md)** - CI/CD workflows documentation

### 🎯 Quick Start:
```bash
# Quick start với Playwright
cat documents/QA/PLAYWRIGHT_QUICKSTART.md

# Hiểu về framework
cat documents/QA/PLAYWRIGHT_FRAMEWORK.md

# CI/CD workflows
cat documents/QA/CI_CD_WORKFLOWS.md
```

### 📚 Topics Covered:
- Playwright E2E testing
- Page Object Model pattern
- 40+ test cases (TC001-TC040)
- CI/CD pipeline integration
- Multi-browser testing
- Test reports & artifacts
- GitHub Actions workflows

---

## 🚀 Quick Navigation

### For Backend Developers
1. 🏁 Start here → [BE/QUICKSTART_NODEJS.md](BE/QUICKSTART_NODEJS.md)
2. 🔄 Migration guide → [BE/MIGRATION_GUIDE.md](BE/MIGRATION_GUIDE.md)
3. 🐛 Debug issues → [BE/TROUBLESHOOTING.md](BE/TROUBLESHOOTING.md)

### For Frontend Developers
1. ✅ Check compatibility → [FE/FRONTEND_COMPATIBILITY.md](FE/FRONTEND_COMPATIBILITY.md)
2. 🔌 IoT endpoints → [FE/IOT_SENSOR_ENDPOINT.md](FE/IOT_SENSOR_ENDPOINT.md)

### For QA Engineers
1. 🧪 Testing framework → [QA/PLAYWRIGHT_FRAMEWORK.md](QA/PLAYWRIGHT_FRAMEWORK.md)
2. 🏁 Quick start → [QA/PLAYWRIGHT_QUICKSTART.md](QA/PLAYWRIGHT_QUICKSTART.md)
3. 🔄 CI/CD → [QA/CI_CD_WORKFLOWS.md](QA/CI_CD_WORKFLOWS.md)

### For DevOps
1. 🔄 CI/CD workflows → [QA/CI_CD_WORKFLOWS.md](QA/CI_CD_WORKFLOWS.md)
2. 🐛 Troubleshooting → [BE/TROUBLESHOOTING.md](BE/TROUBLESHOOTING.md)

### For IoT Devices
1. 📡 API endpoint → [FE/IOT_SENSOR_ENDPOINT.md](FE/IOT_SENSOR_ENDPOINT.md)

---

## 📝 Document Management

### Adding New Documentation

1. **Xác định category** (BE/FE/QA)
2. **Tạo file trong folder tương ứng**:
   ```bash
   # Backend doc
   touch documents/BE/NEW_FEATURE.md
   
   # Frontend doc
   touch documents/FE/NEW_COMPONENT.md
   
   # QA doc
   touch documents/QA/NEW_TESTS.md
   ```
3. **Update README này**
4. **Commit**:
   ```bash
   git add documents/
   git commit -m "docs: Add NEW_FEATURE documentation"
   ```

### Document Naming Convention

- Backend: `BE/*.md` - UPPERCASE_SNAKE_CASE
- Frontend: `FE/*.md` - UPPERCASE_SNAKE_CASE
- QA: `QA/*.md` - UPPERCASE_SNAKE_CASE

Example:
- `BE/API_AUTHENTICATION.md`
- `FE/COMPONENT_LIBRARY.md`
- `QA/TEST_COVERAGE.md`

---

## 🔍 Search Documentation

### Windows (PowerShell):
```powershell
# Search trong tất cả docs
Get-ChildItem documents\ -Recurse -Filter "*.md" | Select-String "keyword"

# Search trong Backend docs
Get-ChildItem documents\BE\*.md | Select-String "keyword"

# Search trong QA docs
Get-ChildItem documents\QA\*.md | Select-String "keyword"
```

### Linux/Mac:
```bash
# Search trong tất cả docs
grep -r "keyword" documents/

# Search trong specific folder
grep -r "keyword" documents/BE/
grep -r "keyword" documents/FE/
grep -r "keyword" documents/QA/
```

---

## 📊 Documentation Coverage

### Backend (5 docs)
- ✅ Migration guides (3 files)
- ✅ Quick start guide
- ✅ Troubleshooting

### Frontend (3 docs)
- ✅ Compatibility checks
- ✅ IoT API documentation
- ✅ Final verdicts

### QA (4 docs)
- ✅ Playwright framework overview
- ✅ Detailed setup guide
- ✅ Quick start guide
- ✅ CI/CD workflows

**Total: 12 documentation files**

---

## 🌐 External Resources

### Project Files
- **Project README**: `../README.md`
- **Backend README**: `../BE_nodejs/README.md`
- **Frontend README**: `../FE/README.md`
- **Playwright Tests**: `../playwright/`

### Live Documentation
- **Playwright Tests**: `../playwright/README.md`
- **CI/CD Workflows**: `../.github/workflows/`

---

## 📞 Support

Nếu cần thêm thông tin hoặc có câu hỏi:

1. 📖 Check documentation trong folder tương ứng
2. 🔍 Search trong docs (commands ở trên)
3. 🐛 Check troubleshooting guide
4. 💬 Hỏi team lead

---

**Last updated**: November 4, 2025  
**Total docs**: 12 files  
**Structure**: 3 categories (BE/FE/QA)

