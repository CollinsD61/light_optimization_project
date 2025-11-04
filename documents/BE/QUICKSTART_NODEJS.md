# 🚀 Quick Start - Node.js Backend

## Chạy ngay trong 3 bước!

### Bước 1: Stop Django backend (nếu đang chạy)
```bash
docker-compose down
```

### Bước 2: Build và start Node.js backend
```bash
docker-compose up --build
```

### Bước 3: Test API
Mở browser và truy cập:
- http://localhost:8000/ - Root
- http://localhost:8000/api/health - Health check

---

## 🧪 Test với PowerShell (Windows)

```powershell
cd BE_nodejs
.\test-api.ps1
```

---

## 📝 Test Manual

### 1. Health Check
```powershell
Invoke-RestMethod -Uri "http://localhost:8000/api/health"
```

### 2. Register User
```powershell
$body = @{
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8000/api/users/register" `
    -Method Post `
    -ContentType "application/json" `
    -Body $body
```

### 3. Login
```powershell
$body = @{
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:8000/api/users/login" `
    -Method Post `
    -ContentType "application/json" `
    -Body $body

$token = $response.access
Write-Host "Token: $token"
```

### 4. Send Sensor Data (Public - No Auth)
```powershell
$body = @{
    sensor_name = "DHT22_Living_Room"
    temperature = 25.5
    humidity = 60.2
    light_value = 450
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8000/api/receive-data" `
    -Method Post `
    -ContentType "application/json" `
    -Body $body
```

### 5. Get Sensor Data (Authenticated)
```powershell
$headers = @{
    Authorization = "Bearer $token"
}

Invoke-RestMethod -Uri "http://localhost:8000/api/sensor-data/" `
    -Method Get `
    -Headers $headers
```

---

## 🔍 Check Logs

### Backend logs
```bash
docker-compose logs backend -f
```

### Database logs
```bash
docker-compose logs db -f
```

### All logs
```bash
docker-compose logs -f
```

---

## 🛑 Stop Services

```bash
docker-compose down
```

### Stop và xóa volumes (reset database)
```bash
docker-compose down -v
```

---

## ✅ Verify Everything Works

1. ✅ Backend running on http://localhost:8000
2. ✅ Frontend running on http://localhost:5173
3. ✅ Database running (PostgreSQL)
4. ✅ Can register/login users
5. ✅ Can receive sensor data
6. ✅ Can query sensor data

---

## 📊 Service URLs

| Service | URL |
|---------|-----|
| API Root | http://localhost:8000 |
| API Health | http://localhost:8000/api/health |
| Register | http://localhost:8000/api/users/register |
| Login | http://localhost:8000/api/users/login |
| Sensor Data | http://localhost:8000/api/sensor-data/ |
| Receive Data | http://localhost:8000/api/receive-data |
| Frontend | http://localhost:5173 |

---

## 🐛 Common Issues

### Port 8000 already in use
```powershell
# Find process
netstat -ano | findstr :8000

# Kill process (replace PID)
taskkill /PID <PID> /F
```

### Database connection error
```bash
# Check if db service is running
docker-compose ps

# Restart db
docker-compose restart db
```

### CORS error from frontend
- Check `CORS_ORIGINS` in docker-compose.yml
- Should include your frontend URL

---

## 🎯 What's Next?

1. Test với frontend React
2. Connect IoT devices
3. Check tất cả features hoạt động
4. Deploy to production

---

## 📚 Full Documentation

Xem thêm:
- `BE_nodejs/README.md` - Full documentation
- `BE_nodejs/MIGRATION_GUIDE.md` - Migration details
- `docker-compose.yml` - Service configuration

---

**Status: ✅ READY TO USE!**

Node.js backend đã được setup đầy đủ và sẵn sàng chạy!

