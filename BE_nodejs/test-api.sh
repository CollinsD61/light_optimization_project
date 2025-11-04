#!/bin/bash

# Test API Script
# Run this after starting the server

BASE_URL="http://localhost:8000"

echo "================================"
echo "🧪 Testing Node.js Backend API"
echo "================================"
echo ""

# Test 1: Health Check
echo "1️⃣ Health Check..."
curl -s "$BASE_URL/api/health" | jq .
echo ""

# Test 2: Root endpoint
echo "2️⃣ Root endpoint..."
curl -s "$BASE_URL/" | jq .
echo ""

# Test 3: Register user
echo "3️⃣ Register new user..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/users/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "password123"
  }')
echo $REGISTER_RESPONSE | jq .
echo ""

# Test 4: Login
echo "4️⃣ Login user..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/users/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "password123"
  }')
echo $LOGIN_RESPONSE | jq .

# Extract access token
ACCESS_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.access')
echo "Access Token: $ACCESS_TOKEN"
echo ""

# Test 5: Receive sensor data (public)
echo "5️⃣ Send sensor data (public endpoint)..."
curl -s -X POST "$BASE_URL/api/receive-data" \
  -H "Content-Type: application/json" \
  -d '{
    "sensor_name": "DHT22_Test",
    "temperature": 25.5,
    "humidity": 60.2,
    "light_value": 450
  }' | jq .
echo ""

# Test 6: Get sensor data (authenticated)
echo "6️⃣ Get sensor data (authenticated)..."
curl -s -X GET "$BASE_URL/api/sensor-data/" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq .
echo ""

# Test 7: Get sensors (authenticated)
echo "7️⃣ Get sensors (authenticated)..."
curl -s -X GET "$BASE_URL/api/sensors/" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq .
echo ""

echo "================================"
echo "✅ Test completed!"
echo "================================"

