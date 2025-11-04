# 🔄 Migration Guide: Django → Node.js Backend

## ✅ Migration Complete!

Backend đã được migrate hoàn toàn từ Django sang Node.js với đầy đủ tính năng.

---

## 🚀 Cách Chạy

### Option 1: Chạy với Docker Compose (Recommended)

```bash
# Từ thư mục root của project
docker-compose down -v  # Stop và xóa containers cũ
docker-compose up --build  # Build và start
```

### Option 2: Chạy Local (Development)

```bash
cd BE_nodejs

# Install dependencies
npm install

# Copy và edit .env file
cp env.example .env
# Edit .env với thông tin database của bạn

# Chạy development server
npm run dev

# Hoặc production
npm start
```

---

## 🔍 Verify API đang chạy

### 1. Health Check
```bash
curl http://localhost:8000/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "API is running"
}
```

### 2. Root Endpoint
```bash
curl http://localhost:8000/
```

### 3. Test Register
```bash
curl -X POST http://localhost:8000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 4. Test Login
```bash
curl -X POST http://localhost:8000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 5. Test Receive Sensor Data (Public endpoint)
```bash
curl -X POST http://localhost:8000/api/receive-data \
  -H "Content-Type: application/json" \
  -d '{
    "sensor_name": "DHT22_Living_Room",
    "temperature": 25.5,
    "humidity": 60.2,
    "light_value": 450
  }'
```

---

## 📊 So Sánh Django vs Node.js

| Feature | Django | Node.js |
|---------|--------|---------|
| Framework | Django REST Framework | Express.js |
| ORM | Django ORM | Sequelize |
| Port | 8000 | 8000 |
| Auth | djangorestframework-simplejwt | jsonwebtoken |
| Email | Django email backend | nodemailer |
| Validation | Django serializers | express-validator |
| CORS | django-cors-headers | cors |

---

## 🗄️ Database Schema

Sử dụng lại schema từ Django (không cần migrate lại):

```
users_customuser           -> User accounts
users_passwordresettoken   -> Password reset tokens
sensors_sensor             -> Sensor info
sensor_data_sensordata     -> Sensor readings
```

**QUAN TRỌNG**: Database schema từ Django được giữ nguyên 100%. Node.js backend tương thích hoàn toàn!

---

## 🔐 API Endpoints (Giống y chang Django)

### Authentication
- `POST /api/users/register`
- `POST /api/users/login`
- `POST /api/users/google-login`
- `POST /api/users/forgot-password`
- `POST /api/users/reset-password`

### Token Management
- `POST /api/token/refresh`

### Sensors
- `GET /api/sensors/`
- `POST /api/sensors/`
- `GET /api/sensors/:id/`
- `PUT /api/sensors/:id/`
- `DELETE /api/sensors/:id/`

### Sensor Data
- `GET /api/sensor-data/`
- `POST /api/sensor-data/`
- `GET /api/sensor-data/:id/`
- `PUT /api/sensor-data/:id/`
- `DELETE /api/sensor-data/:id/`
- `POST /api/receive-data/` ← Public endpoint cho IoT devices

---

## 🔧 Environment Variables

Cần config trong `.env`:

```env
NODE_ENV=production
PORT=8000
DATABASE_HOST=db
DATABASE_NAME=sensors
DATABASE_USER=postgres
DATABASE_PASSWORD=dohoang
JWT_SECRET=your_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
FRONTEND_URL=https://lightoptimization.io.vn
CORS_ORIGINS=https://lightoptimization.io.vn,http://localhost:5173
```

---

## 🐛 Troubleshooting

### 1. Database connection failed
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Check logs
docker-compose logs db
```

### 2. Port 8000 already in use
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9  # Mac/Linux
netstat -ano | findstr :8000    # Windows
```

### 3. CORS errors
Kiểm tra `CORS_ORIGINS` trong `.env` có chứa frontend URL không.

### 4. JWT errors
Đảm bảo `JWT_SECRET` được set trong `.env`.

---

## ✨ Features Implemented

✅ User Registration & Login  
✅ JWT Access & Refresh Tokens  
✅ Google OAuth 2.0  
✅ Password Reset via Email  
✅ Sensor CRUD operations  
✅ Sensor Data CRUD with pagination  
✅ Filtering & Ordering  
✅ Public IoT endpoint  
✅ CORS configuration  
✅ Error handling  
✅ Input validation  
✅ Docker support  
✅ Health checks  

---

## 📝 Testing với Frontend

Frontend không cần thay đổi gì! Tất cả API endpoints giữ nguyên format.

Chỉ cần đảm bảo:
- Backend chạy trên port 8000
- CORS được config đúng
- JWT token format giống nhau

---

## 🎯 Next Steps

1. ✅ Test tất cả endpoints
2. ✅ Test với frontend React
3. ✅ Test IoT device connection
4. 🔄 Monitor logs để debug
5. 🔄 Setup production secrets
6. 🔄 Configure email properly

---

## 💡 Notes

- Node.js backend **sử dụng lại database** từ Django
- Không cần chạy migrations (dữ liệu cũ vẫn hoạt động)
- Frontend **không cần sửa code**
- API endpoints **100% compatible**

---

## 📞 Support

Nếu gặp vấn đề:
1. Check logs: `docker-compose logs backend`
2. Check database: `docker-compose logs db`
3. Verify environment variables
4. Test với curl commands ở trên

---

**Migration Status: ✅ COMPLETED & READY TO RUN!**

