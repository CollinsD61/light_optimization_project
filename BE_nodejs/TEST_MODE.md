# Test Mode for IoT Endpoint

## 📋 Overview

The `/api/receive-data` endpoint now supports **TEST MODE** - allowing you to test IoT data submission **WITHOUT writing to the database**.

This is useful for:
- ✅ Playwright E2E tests
- ✅ Load testing
- ✅ Integration testing
- ✅ Development debugging
- ✅ QA validation

---

## 🚀 Usage

### Normal Mode (Write to Database)

```bash
POST /api/receive-data
Content-Type: application/json

{
  "sensor_name": "my-sensor",
  "light_value": 500,
  "temperature": 25.5,
  "humidity": 60,
  "timestamp": "2025-11-21T10:30:00Z"
}
```

**Response:**
```json
{
  "message": "Dữ liệu đã được ghi thành công.",
  "test_mode": false,
  "data": {
    "id": 123,
    "sensorId": 1,
    "lightValue": 500,
    "temperature": 25.5,
    "humidity": 60,
    "timestamp": "2025-11-21T10:30:00Z"
  }
}
```

### Test Mode (NO Database Write)

Simply add `"test_mode": true` to the request:

```bash
POST /api/receive-data
Content-Type: application/json

{
  "sensor_name": "test-sensor",
  "light_value": 500,
  "temperature": 25.5,
  "humidity": 60,
  "timestamp": "2025-11-21T10:30:00Z",
  "test_mode": true  ⬅️ This is the key!
}
```

**Response:**
```json
{
  "message": "TEST MODE: Dữ liệu đã được nhận nhưng KHÔNG ghi vào database.",
  "test_mode": true,
  "data": {
    "id": "test-1732180200000",
    "sensorId": "test-sensor-id",
    "sensor_name": "test-sensor",
    "lightValue": 500,
    "temperature": 25.5,
    "humidity": 60,
    "timestamp": "2025-11-21T10:30:00Z",
    "test_mode": true
  }
}
```

---

## 🧪 Playwright Test Example

```javascript
test('Send sensor data in TEST MODE', async ({ request }) => {
  const response = await request.post(`${BASE_URL}/api/receive-data`, {
    headers: { 'Content-Type': 'application/json' },
    data: {
      sensor_name: 'test-sensor-playwright',
      light_value: 500,
      temperature: 25.5,
      humidity: 60,
      timestamp: new Date().toISOString(),
      test_mode: true  // Won't write to DB
    }
  });
  
  expect(response.status()).toBe(201);
  const data = await response.json();
  expect(data.test_mode).toBe(true);
});
```

---

## 🔍 How It Works

1. **Backend checks for `test_mode` parameter**
2. **If `test_mode === true`:**
   - ✅ Validates data format
   - ✅ Returns success response with mock data
   - ❌ Does NOT write to database
   - ❌ Does NOT create sensor if it doesn't exist

3. **If `test_mode === false` or not provided:**
   - ✅ Normal behavior
   - ✅ Creates sensor if not exists
   - ✅ Writes to database

---

## 💡 Benefits

### For Testing:
- No database pollution from test data
- Faster test execution (no DB write overhead)
- Can run tests in parallel without conflicts
- Easy cleanup (no cleanup needed!)

### For Development:
- Test API integration without affecting real data
- Debug request/response format
- Validate sensor data structure

### For Load Testing:
- Simulate high-volume IoT traffic
- Measure API performance without DB bottleneck
- Test rate limiting behavior

---

## 📊 Console Logs

When `test_mode` is enabled, you'll see:

```
ReceiveSensorDataAPI được gọi.
Request data: { sensor_name: 'test-sensor', test_mode: true, ... }
🧪 TEST MODE: Data được nhận nhưng KHÔNG ghi vào database
```

When `test_mode` is disabled (normal):

```
ReceiveSensorDataAPI được gọi.
Request data: { sensor_name: 'my-sensor', ... }
Dữ liệu đã được ghi thành công: 123
```

---

## ⚠️ Important Notes

1. **Test mode only affects `/api/receive-data` endpoint**
2. **Other endpoints work normally**
3. **Test mode does not require authentication** (same as normal mode)
4. **Response format is identical in both modes**
5. **Use `test_mode: true` for all automated tests**

---

## 📝 Updated Test Cases

- **TC036** - Send sensor data (TEST MODE) ✅
- **TC036.1** - Send sensor data (NORMAL MODE) ✅

Both test cases are now in `playwright/tests/api.spec.js`

---

## 🎯 Recommendations

### ✅ DO:
- Use test mode for all Playwright tests
- Use test mode for load testing
- Use test mode when developing new IoT integrations

### ❌ DON'T:
- Use test mode in production IoT devices
- Rely on test mode for actual data storage
- Mix test and real data in same test suite

---

## 🔄 Migration Guide

### Before:
```javascript
// Test would write to database
await request.post('/api/receive-data', {
  data: { sensor_name: 'test', ... }
});
```

### After:
```javascript
// Test does NOT write to database
await request.post('/api/receive-data', {
  data: { 
    sensor_name: 'test', 
    test_mode: true  // Add this!
  }
});
```

---

**Happy Testing!** 🎉

