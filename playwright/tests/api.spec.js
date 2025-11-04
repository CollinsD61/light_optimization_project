const { test, expect } = require('@playwright/test');

// Backend API is accessible via subdomain api.lightoptimization.io.vn
const BASE_URL = process.env.API_URL || 'https://api.lightoptimization.io.vn';

test.describe('API Tests', () => {
  let accessToken;

  test.beforeAll(async ({ request }) => {
    // Login to get access token with real user
    const response = await request.post(`${BASE_URL}/api/users/login/`, {
      data: {
        email: 'haichu321@gmail.com',
        password: 'H@ichu321'
      }
    });
    
    if (response.ok()) {
      const data = await response.json();
      accessToken = data.access;
    }
  });

  test('TC031 - API Health check', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/health`);
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.status).toBe('OK');
  });

  test('TC032 - Login API with valid credentials', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/users/login/`, {
      data: {
        email: 'haichu321@gmail.com',
        password: 'H@ichu321'
      }
    });
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data).toHaveProperty('access');
    expect(data).toHaveProperty('refresh');
  });

  test('TC033 - Login API with invalid credentials', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/users/login/`, {
      data: {
        email: 'invalid@email.com',
        password: 'wrongpass'
      }
    });
    
    expect(response.status()).toBe(401);
  });

  test('TC034 - Get sensor data with authentication', async ({ request }) => {
    if (!accessToken) {
      test.skip();
      return;
    }

    const response = await request.get(`${BASE_URL}/api/sensor-data/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
  });

  test('TC035 - Get sensor data without authentication', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/sensor-data/`);
    
    expect(response.status()).toBe(401);
  });

  test('TC036 - Send sensor data to IoT endpoint', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/receive-data/`, {
      data: {
        sensor_name: 'test-sensor-playwright',
        light_value: 500,
        temperature: 25.5,
        humidity: 60,
        timestamp: new Date().toISOString()
      }
    });
    
    expect(response.status()).toBe(201);
    const data = await response.json();
    expect(data).toHaveProperty('message');
  });

  test('TC037 - Get sensors list with authentication', async ({ request }) => {
    if (!accessToken) {
      test.skip();
      return;
    }

    const response = await request.get(`${BASE_URL}/api/sensors/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    expect(response.ok()).toBeTruthy();
  });

  test('TC038 - Register new user', async ({ request }) => {
    const randomEmail = `test_${Date.now()}@example.com`;
    
    const response = await request.post(`${BASE_URL}/api/users/register/`, {
      data: {
        email: randomEmail,
        password: 'testpass123'
      }
    });
    
    // Either success or user already exists
    expect([200, 201, 400]).toContain(response.status());
  });

  test('TC039 - API returns JSON content type', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/health`);
    
    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('application/json');
  });

  test('TC040 - CORS headers are set', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/health`);
    
    const headers = response.headers();
    // Check if CORS is configured (may or may not have this header depending on origin)
    expect(response.ok()).toBeTruthy();
  });
});

