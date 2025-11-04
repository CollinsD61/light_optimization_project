# 🔧 Troubleshooting Guide - Node.js Backend

## Vấn đề: Không thấy dữ liệu sau khi đăng nhập

### ✅ Đã fix

**Nguyên nhân:** Backend trả về object `{ count, results, next, previous }` nhưng frontend expect array trực tiếp.

**Giải pháp:** Updated `BE_nodejs/src/controllers/sensorDataController.js` để trả về array trực tiếp thay vì object.

```javascript
// Trước:
res.json({
  count,
  results: rows,
  next: page * limit < count ? page + 1 : null,
  previous: page > 1 ? page - 1 : null
});

// Sau:
res.json(rows); // Trả về array trực tiếp
```

---

## 📝 Các bước kiểm tra khi deploy lên VPS

### 1. Kiểm tra containers đang chạy

```bash
ssh root@your-vps "cd /root/web_project && docker compose ps"
```

Kết quả mong đợi:
```
NAME                  STATUS
web_project-backend   Up
web_project-db        Up (healthy)
web_project-frontend  Up
```

### 2. Kiểm tra logs của backend

```bash
ssh root@your-vps "cd /root/web_project && docker compose logs backend --tail=50"
```

Tìm dòng:
- ✅ `Server running on port 8000`
- ✅ `Database connected successfully`
- ❌ `Error:` (nếu có lỗi)

### 3. Kiểm tra database có data không

```bash
ssh root@your-vps "cd /root/web_project && docker compose exec db psql -U postgres -d sensors -c 'SELECT COUNT(*) FROM sensor_sensordata;'"
```

Nếu count = 0 → Không có dữ liệu trong DB

### 4. Test API endpoint trực tiếp

```bash
# Login và lấy token
TOKEN=$(curl -s -X POST https://api.lightoptimization.io.vn/api/users/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"yourpass"}' | jq -r '.access')

# Lấy sensor data
curl -H "Authorization: Bearer $TOKEN" \
  https://api.lightoptimization.io.vn/api/sensor-data/
```

### 5. Kiểm tra CORS

Nếu frontend không nhận được data, có thể do CORS:

```bash
curl -H "Origin: https://lightoptimization.io.vn" \
     -H "Authorization: Bearer $TOKEN" \
     -v https://api.lightoptimization.io.vn/api/sensor-data/
```

Kiểm tra response header có:
```
Access-Control-Allow-Origin: https://lightoptimization.io.vn
```

---

## 🐛 Các lỗi phổ biến

### Lỗi 1: "column users_customuser.name does not exist"

**Nguyên nhân:** Model User có field `name` nhưng DB không có column này

**Fix:** Đã comment out field `name` trong `BE_nodejs/src/models/User.js`

### Lỗi 2: Frontend nhận `lightValue` thay vì `light_value`

**Nguyên nhân:** Sequelize trả về camelCase, frontend expect snake_case

**Fix:** Đã thêm virtual field `light_value` trong `BE_nodejs/src/models/SensorData.js`

```javascript
light_value: {
  type: DataTypes.VIRTUAL,
  get() {
    return this.getDataValue('lightValue');
  }
}
```

### Lỗi 3: "No data found"

**Nguyên nhân:** Database trống hoặc sensor chưa gửi data

**Fix:**
1. Gửi test data:
```bash
curl -X POST https://api.lightoptimization.io.vn/api/receive-data/ \
  -H "Content-Type: application/json" \
  -d '{
    "sensor_name": "test-sensor",
    "light_value": 500,
    "temperature": 25.5,
    "humidity": 60
  }'
```

2. Kiểm tra trong DB:
```bash
docker compose exec db psql -U postgres -d sensors -c \
  "SELECT * FROM sensor_sensordata ORDER BY timestamp DESC LIMIT 5;"
```

---

## 🚀 Deploy mới sau khi fix

1. **Commit changes:**
```bash
git add .
git commit -m "Fix: API response format for frontend compatibility"
git push origin master
```

2. **GitHub Actions sẽ tự động:**
   - Build Docker images
   - Deploy lên VPS
   - Restart containers

3. **Hoặc deploy thủ công:**
```bash
ssh root@your-vps "cd /root/web_project && docker compose down && docker compose up -d --build"
```

---

## 📊 Test local trước khi deploy

```bash
# Start containers
docker compose up -d

# Wait for backend to be ready
sleep 10

# Run test script
node test-api.js
```

Expected output:
```
🧪 Testing Node.js Backend API...
1️⃣ Testing health endpoint...
✅ Health: { status: 'OK', message: 'API is running' }

2️⃣ Testing login...
✅ Login successful, token: eyJhbGciOiJIUzI1NiIs...

3️⃣ Testing sensor data endpoint...
✅ Response type: Array ✓
✅ Data count: 42
✅ light_value field exists! Value: 523.5
```

---

## 🔍 Debug trong container

```bash
# Vào container backend
docker compose exec backend sh

# Check environment variables
env | grep DATABASE

# Check if Sequelize can connect
node -e "const db = require('./src/models'); db.sequelize.authenticate().then(() => console.log('✅ Connected')).catch(err => console.error('❌', err));"
```

---

## ℹ️ URLs sau khi deploy

- **Frontend:** https://lightoptimization.io.vn
- **Backend API:** https://api.lightoptimization.io.vn
- **Health check:** https://api.lightoptimization.io.vn/api/health
- **IoT endpoint:** https://api.lightoptimization.io.vn/api/receive-data/

---

## 📞 Cần thêm help?

Check logs:
```bash
# Backend logs
docker compose logs backend -f

# Frontend logs  
docker compose logs frontend -f

# Database logs
docker compose logs db -f

# All logs
docker compose logs -f
```

