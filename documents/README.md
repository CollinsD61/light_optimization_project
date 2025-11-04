# 📚 Project Documentation

Thư mục này chứa tất cả các tài liệu kỹ thuật của dự án.

## 📖 Table of Contents

### 🚀 Migration & Setup
- **[MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)** - Hướng dẫn migrate từ Django sang Node.js
- **[MIGRATION_COMPLETE.md](MIGRATION_COMPLETE.md)** - Chi tiết về quá trình migration đã hoàn thành
- **[MIGRATION_COMPARISON.md](MIGRATION_COMPARISON.md)** - So sánh Django vs Node.js backend
- **[QUICKSTART_NODEJS.md](QUICKSTART_NODEJS.md)** - Quick start guide cho Node.js backend

### 🔌 API & Integration
- **[IOT_SENSOR_ENDPOINT.md](IOT_SENSOR_ENDPOINT.md)** - API endpoint để nhận dữ liệu từ IoT sensors
- **[FRONTEND_COMPATIBILITY.md](FRONTEND_COMPATIBILITY.md)** - Kiểm tra compatibility giữa FE và BE
- **[FRONTEND_FINAL_VERDICT.md](FRONTEND_FINAL_VERDICT.md)** - Kết luận cuối cùng về frontend compatibility

### 🔧 Troubleshooting
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Hướng dẫn debug và fix các vấn đề phổ biến

---

## 📂 Document Organization

```
documents/
├── README.md                      # File này
├── MIGRATION_GUIDE.md             # Migration guide
├── MIGRATION_COMPLETE.md          # Migration details
├── MIGRATION_COMPARISON.md        # Django vs Node.js
├── QUICKSTART_NODEJS.md           # Quick start
├── IOT_SENSOR_ENDPOINT.md         # IoT API docs
├── FRONTEND_COMPATIBILITY.md      # FE/BE compatibility
├── FRONTEND_FINAL_VERDICT.md      # FE verdict
└── TROUBLESHOOTING.md             # Debug guide
```

---

## 🎯 Quick Links

### For Developers
1. Bắt đầu với Node.js backend → [QUICKSTART_NODEJS.md](QUICKSTART_NODEJS.md)
2. Hiểu về migration → [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)
3. Debug issues → [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

### For IoT Devices
- API endpoint documentation → [IOT_SENSOR_ENDPOINT.md](IOT_SENSOR_ENDPOINT.md)

### For Frontend Developers
- Backend compatibility → [FRONTEND_COMPATIBILITY.md](FRONTEND_COMPATIBILITY.md)

---

## 📝 Document Updates

Khi cập nhật hoặc thêm document mới:
1. Đặt file `.md` vào folder này
2. Update file `README.md` này
3. Commit với message rõ ràng

Example:
```bash
git add documents/NEW_DOC.md documents/README.md
git commit -m "docs: Add NEW_DOC for feature X"
```

---

## 🔍 Search Documentation

Để tìm kiếm nhanh trong tất cả docs:

**Windows (PowerShell):**
```powershell
Get-ChildItem documents\*.md | Select-String "keyword"
```

**Linux/Mac:**
```bash
grep -r "keyword" documents/
```

---

## ℹ️ Other Documentation

- **Project README**: `../README.md` (root của project)
- **Backend README**: `../BE_nodejs/README.md`
- **Frontend README**: `../FE/README.md`
- **CI/CD Workflows**: `../.github/workflows/README.md`

---

Last updated: November 4, 2025

