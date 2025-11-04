# PowerShell Test Script for Windows
# Run this after starting the server

$BASE_URL = "http://localhost:8000"

Write-Host "================================" -ForegroundColor Green
Write-Host "🧪 Testing Node.js Backend API" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""

# Test 1: Health Check
Write-Host "1️⃣ Health Check..." -ForegroundColor Yellow
$response = Invoke-RestMethod -Uri "$BASE_URL/api/health" -Method Get
$response | ConvertTo-Json
Write-Host ""

# Test 2: Root endpoint
Write-Host "2️⃣ Root endpoint..." -ForegroundColor Yellow
$response = Invoke-RestMethod -Uri "$BASE_URL/" -Method Get
$response | ConvertTo-Json
Write-Host ""

# Test 3: Register user
Write-Host "3️⃣ Register new user..." -ForegroundColor Yellow
try {
    $body = @{
        email = "testuser@example.com"
        password = "password123"
    } | ConvertTo-Json

    $registerResponse = Invoke-RestMethod -Uri "$BASE_URL/api/users/register" `
        -Method Post `
        -ContentType "application/json" `
        -Body $body
    
    $registerResponse | ConvertTo-Json
} catch {
    Write-Host "User might already exist or registration failed" -ForegroundColor Red
}
Write-Host ""

# Test 4: Login
Write-Host "4️⃣ Login user..." -ForegroundColor Yellow
$body = @{
    email = "testuser@example.com"
    password = "password123"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "$BASE_URL/api/users/login" `
    -Method Post `
    -ContentType "application/json" `
    -Body $body

$loginResponse | ConvertTo-Json
$accessToken = $loginResponse.access
Write-Host "Access Token: $accessToken" -ForegroundColor Cyan
Write-Host ""

# Test 5: Receive sensor data (public)
Write-Host "5️⃣ Send sensor data (public endpoint)..." -ForegroundColor Yellow
$body = @{
    sensor_name = "DHT22_Test"
    temperature = 25.5
    humidity = 60.2
    light_value = 450
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "$BASE_URL/api/receive-data" `
    -Method Post `
    -ContentType "application/json" `
    -Body $body

$response | ConvertTo-Json
Write-Host ""

# Test 6: Get sensor data (authenticated)
Write-Host "6️⃣ Get sensor data (authenticated)..." -ForegroundColor Yellow
$headers = @{
    Authorization = "Bearer $accessToken"
}

$response = Invoke-RestMethod -Uri "$BASE_URL/api/sensor-data/" `
    -Method Get `
    -Headers $headers

$response | ConvertTo-Json
Write-Host ""

# Test 7: Get sensors (authenticated)
Write-Host "7️⃣ Get sensors (authenticated)..." -ForegroundColor Yellow
$response = Invoke-RestMethod -Uri "$BASE_URL/api/sensors/" `
    -Method Get `
    -Headers $headers

$response | ConvertTo-Json
Write-Host ""

Write-Host "================================" -ForegroundColor Green
Write-Host "✅ Test completed!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

