/**
 * API Test Helpers
 * Common utilities for API testing with Playwright
 */

// Playwright User-Agent to skip rate limiting
const PLAYWRIGHT_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Playwright/1.40.0';

/**
 * Get default headers for API requests
 * Includes Playwright User-Agent for rate limiting bypass
 */
function getDefaultHeaders(additionalHeaders = {}) {
  return {
    'User-Agent': PLAYWRIGHT_USER_AGENT,
    'Content-Type': 'application/json',
    ...additionalHeaders
  };
}

/**
 * Make authenticated API request
 * @param {import('@playwright/test').APIRequestContext} request 
 * @param {string} token - JWT access token
 */
function getAuthHeaders(token) {
  return getDefaultHeaders({
    'Authorization': `Bearer ${token}`
  });
}

module.exports = {
  PLAYWRIGHT_USER_AGENT,
  getDefaultHeaders,
  getAuthHeaders
};

