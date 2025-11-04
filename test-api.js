// Quick script to test API responses
const axios = require('axios');

const BASE_URL = 'http://localhost:8000';

async function testAPI() {
  try {
    console.log('🧪 Testing Node.js Backend API...\n');

    // Test 1: Health check
    console.log('1️⃣ Testing health endpoint...');
    const health = await axios.get(`${BASE_URL}/api/health`);
    console.log('✅ Health:', health.data);
    console.log('');

    // Test 2: Login
    console.log('2️⃣ Testing login...');
    const login = await axios.post(`${BASE_URL}/api/users/login/`, {
      email: 'test@example.com',
      password: 'test123'
    });
    const token = login.data.access;
    console.log('✅ Login successful, token:', token.substring(0, 20) + '...');
    console.log('');

    // Test 3: Fetch sensor data
    console.log('3️⃣ Testing sensor data endpoint...');
    const sensorData = await axios.get(`${BASE_URL}/api/sensor-data/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Response type:', Array.isArray(sensorData.data) ? 'Array ✓' : 'Object ✗');
    console.log('✅ Data count:', sensorData.data.length);
    
    if (sensorData.data.length > 0) {
      console.log('✅ First item:', JSON.stringify(sensorData.data[0], null, 2));
      
      // Check if light_value exists
      if (sensorData.data[0].light_value !== undefined) {
        console.log('✅ light_value field exists! Value:', sensorData.data[0].light_value);
      } else if (sensorData.data[0].lightValue !== undefined) {
        console.log('⚠️ Only lightValue exists (camelCase), frontend needs light_value (snake_case)');
      }
    } else {
      console.log('⚠️ No data found in database');
    }

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testAPI();

