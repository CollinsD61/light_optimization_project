# 📚 Project Documentation

This directory contains all technical documentation for the project, organized into 3 main modules.

## 📂 Documentation Structure

```
documents/
├── README.md           # This file
├── BE/                 # 🔙 Backend Documentation
├── FE/                 # 🎨 Frontend Documentation
├── QA/                 # 🧪 QA & Testing Documentation
└── Improve/            # 🔧 Code Review & Improvements
```

---

## 🔙 Backend Documentation (BE/)

Documentation about Node.js backend, migration from Django, API, troubleshooting.

### 📖 Files:
- **[MIGRATION_GUIDE.md](BE/MIGRATION_GUIDE.md)** - Step-by-step guide for migrating from Django to Node.js
- **[MIGRATION_COMPLETE.md](BE/MIGRATION_COMPLETE.md)** - Detailed migration completion report
- **[MIGRATION_COMPARISON.md](BE/MIGRATION_COMPARISON.md)** - Django vs Node.js backend comparison
- **[MIGRATION_VERIFICATION.md](BE/MIGRATION_VERIFICATION.md)** - Feature-by-feature migration verification
- **[MIGRATION_SUMMARY.md](BE/MIGRATION_SUMMARY.md)** - Quick migration summary
- **[FINAL_MIGRATION_REPORT.md](BE/FINAL_MIGRATION_REPORT.md)** - Complete migration report with all details
- **[QUICKSTART_NODEJS.md](BE/QUICKSTART_NODEJS.md)** - Quick start guide for Node.js backend
- **[TROUBLESHOOTING.md](BE/TROUBLESHOOTING.md)** - Debug and fix common issues
- **[DJANGO_BACKEND_TECHNICAL_ARCHIVE.md](BE/DJANGO_BACKEND_TECHNICAL_ARCHIVE.md)** - Technical documentation of legacy Django backend (archived)

### 🎯 Quick Start:
```bash
# Read Migration Guide
cat documents/BE/MIGRATION_GUIDE.md

# Quick start with Node.js
cat documents/BE/QUICKSTART_NODEJS.md

# Troubleshooting
cat documents/BE/TROUBLESHOOTING.md
```

### 📚 Topics Covered:
- Django to Node.js migration (100% complete)
- Sequelize ORM setup
- JWT Authentication
- Google OAuth integration
- Rate limiting implementation
- API endpoints structure
- Database schema mapping
- Error handling & debugging

---

## 🎨 Frontend Documentation (FE/)

Documentation about React frontend, API compatibility, IoT integration.

### 📖 Files:
- **[FRONTEND_COMPATIBILITY.md](FE/FRONTEND_COMPATIBILITY.md)** - FE/BE compatibility verification
- **[FRONTEND_FINAL_VERDICT.md](FE/FRONTEND_FINAL_VERDICT.md)** - Final verdict on frontend compatibility
- **[IOT_SENSOR_ENDPOINT.md](FE/IOT_SENSOR_ENDPOINT.md)** - API endpoint for receiving IoT sensor data

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
- Rate limit handling on client side

---

## 🧪 QA & Testing Documentation (QA/)

Documentation about testing framework, CI/CD, Playwright E2E tests.

### 📖 Files:
- **[PLAYWRIGHT_FRAMEWORK.md](QA/PLAYWRIGHT_FRAMEWORK.md)** - Playwright testing framework overview
- **[PLAYWRIGHT_README.md](QA/PLAYWRIGHT_README.md)** - Detailed Playwright setup guide
- **[PLAYWRIGHT_QUICKSTART.md](QA/PLAYWRIGHT_QUICKSTART.md)** - Quick start guide for Playwright
- **[CI_CD_WORKFLOWS.md](QA/CI_CD_WORKFLOWS.md)** - CI/CD workflows documentation
- **[PARALLEL_TESTING_WORKFLOW.md](QA/PARALLEL_TESTING_WORKFLOW.md)** - Parallel testing strategy
- **[IOT_ENDPOINT_VERIFICATION.md](QA/IOT_ENDPOINT_VERIFICATION.md)** - IoT endpoint testing

### 🎯 Quick Start:
```bash
# Quick start with Playwright
cat documents/QA/PLAYWRIGHT_QUICKSTART.md

# Framework understanding
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

## 🔧 Code Review & Improvements (Improve/)

Code review results, security analysis, and improvement recommendations.

### 📖 Files:
- **[Review.md](Improve/Review.md)** - Comprehensive code quality review with security recommendations

### 📚 Topics Covered:
- Architecture review (4/5 stars)
- Security analysis (3/5 stars - needs improvement)
- Code quality assessment (4/5 stars)
- Performance analysis
- Rate limiting recommendations (✅ IMPLEMENTED)
- Security vulnerabilities and fixes
- Best practices and improvements

---

## 🚀 Quick Navigation

### For Backend Developers
1. 🏁 Start here → [BE/QUICKSTART_NODEJS.md](BE/QUICKSTART_NODEJS.md)
2. 🔄 Migration guide → [BE/MIGRATION_GUIDE.md](BE/MIGRATION_GUIDE.md)
3. 📊 Migration report → [BE/FINAL_MIGRATION_REPORT.md](BE/FINAL_MIGRATION_REPORT.md)
4. 🐛 Debug issues → [BE/TROUBLESHOOTING.md](BE/TROUBLESHOOTING.md)
5. 📚 Django archive → [BE/DJANGO_BACKEND_TECHNICAL_ARCHIVE.md](BE/DJANGO_BACKEND_TECHNICAL_ARCHIVE.md)

### For Frontend Developers
1. ✅ Check compatibility → [FE/FRONTEND_COMPATIBILITY.md](FE/FRONTEND_COMPATIBILITY.md)
2. 🔌 IoT endpoints → [FE/IOT_SENSOR_ENDPOINT.md](FE/IOT_SENSOR_ENDPOINT.md)

### For QA Engineers
1. 🧪 Testing framework → [QA/PLAYWRIGHT_FRAMEWORK.md](QA/PLAYWRIGHT_FRAMEWORK.md)
2. 🏁 Quick start → [QA/PLAYWRIGHT_QUICKSTART.md](QA/PLAYWRIGHT_QUICKSTART.md)
3. 🔄 CI/CD → [QA/CI_CD_WORKFLOWS.md](QA/CI_CD_WORKFLOWS.md)
4. 🔌 IoT verification → [QA/IOT_ENDPOINT_VERIFICATION.md](QA/IOT_ENDPOINT_VERIFICATION.md)

### For DevOps
1. 🔄 CI/CD workflows → [QA/CI_CD_WORKFLOWS.md](QA/CI_CD_WORKFLOWS.md)
2. 🐛 Troubleshooting → [BE/TROUBLESHOOTING.md](BE/TROUBLESHOOTING.md)
3. 📊 Migration status → [BE/MIGRATION_SUMMARY.md](BE/MIGRATION_SUMMARY.md)

### For Security/Code Review
1. 🔍 Code review → [Improve/Review.md](Improve/Review.md)
2. 🛡️ Security improvements → Check Review.md for recommendations

### For IoT Devices
1. 📡 API endpoint → [FE/IOT_SENSOR_ENDPOINT.md](FE/IOT_SENSOR_ENDPOINT.md)
2. 🧪 Endpoint testing → [QA/IOT_ENDPOINT_VERIFICATION.md](QA/IOT_ENDPOINT_VERIFICATION.md)

---

## 📝 Document Management

### Adding New Documentation

1. **Identify category** (BE/FE/QA/Improve)
2. **Create file in corresponding folder**:
   ```bash
   # Backend doc
   touch documents/BE/NEW_FEATURE.md
   
   # Frontend doc
   touch documents/FE/NEW_COMPONENT.md
   
   # QA doc
   touch documents/QA/NEW_TESTS.md
   
   # Code review/improvement doc
   touch documents/Improve/NEW_REVIEW.md
   ```
3. **Update this README**
4. **Commit**:
   ```bash
   git add documents/
   git commit -m "docs: Add NEW_FEATURE documentation"
   ```

### Document Naming Convention

- Backend: `BE/*.md` - UPPERCASE_SNAKE_CASE
- Frontend: `FE/*.md` - UPPERCASE_SNAKE_CASE
- QA: `QA/*.md` - UPPERCASE_SNAKE_CASE
- Improvements: `Improve/*.md` - PascalCase

Examples:
- `BE/API_AUTHENTICATION.md`
- `FE/COMPONENT_LIBRARY.md`
- `QA/TEST_COVERAGE.md`
- `Improve/Review.md`

---

## 🔍 Search Documentation

### Windows (PowerShell):
```powershell
# Search in all docs
Get-ChildItem documents\ -Recurse -Filter "*.md" | Select-String "keyword"

# Search in Backend docs
Get-ChildItem documents\BE\*.md | Select-String "keyword"

# Search in QA docs
Get-ChildItem documents\QA\*.md | Select-String "keyword"
```

### Linux/Mac:
```bash
# Search in all docs
grep -r "keyword" documents/

# Search in specific folder
grep -r "keyword" documents/BE/
grep -r "keyword" documents/FE/
grep -r "keyword" documents/QA/
grep -r "keyword" documents/Improve/
```

---

## 📊 Documentation Coverage

### Backend (9 docs)
- ✅ Migration guides (6 files)
- ✅ Quick start guide
- ✅ Troubleshooting
- ✅ Django archive (technical reference)

### Frontend (3 docs)
- ✅ Compatibility checks
- ✅ IoT API documentation
- ✅ Final verdicts

### QA (6 docs)
- ✅ Playwright framework overview
- ✅ Detailed setup guide
- ✅ Quick start guide
- ✅ CI/CD workflows
- ✅ Parallel testing strategy
- ✅ IoT endpoint verification

### Code Review & Improvements (1 doc)
- ✅ Comprehensive code quality review
- ✅ Security analysis and recommendations
- ✅ Implementation status tracking

**Total: 19 documentation files**

---

## 🌐 External Resources

### Project Files
- **Project README**: `../README.md`
- **Backend README**: `../BE_nodejs/README.md`
- **Frontend README**: `../FE/README.md`
- **Playwright Tests**: `../playwright/`
- **Docker Compose (Local)**: `../docker-compose.local.yml`
- **Docker Compose (Production)**: `../docker-compose.yml`

### Live Documentation
- **Playwright Tests**: `../playwright/README.md`
- **CI/CD Workflows**: `../.github/workflows/`
- **GitHub Actions**: `.github/workflows/update.yml`

---

## 📞 Support

If you need more information or have questions:

1. 📖 Check documentation in corresponding folder
2. 🔍 Search in docs (commands above)
3. 🐛 Check troubleshooting guide
4. 💬 Ask team lead
5. 🔍 Review code review document for known issues

---

## 🎯 Recent Updates

### November 6, 2025
- ✅ Implemented rate limiting (BE + FE)
- ✅ Fixed Google OAuth login bug
- ✅ Created Django backend archive
- ✅ Added docker-compose.local.yml for local development
- ✅ Updated all documentation to English
- ✅ Added comprehensive code review documentation

---

**Last updated**: November 6, 2025  
**Total docs**: 19 files  
**Structure**: 4 categories (BE/FE/QA/Improve)  
**Status**: ✅ All documentation up-to-date

