const rateLimit = require('express-rate-limit');

// Skip rate limiting for Playwright tests
const skipPlaywright = (req) => {
  const userAgent = req.get('User-Agent') || '';
  return userAgent.includes('Playwright');
};

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per 15 minutes (was 100)
  skip: skipPlaywright, // Skip for Playwright tests
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Strict limiter for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 login attempts per windowMs (was 5)
  skipSuccessfulRequests: true, // Don't count successful requests
  skip: skipPlaywright, // Skip for Playwright tests
  message: {
    error: 'Too many login attempts, please try again after 15 minutes.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limiter for IoT data endpoint
const iotLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // Limit each IP to 60 requests per minute (1 per second average)
  skip: skipPlaywright, // Skip for Playwright tests
  message: {
    error: 'Too many data submissions, please slow down.',
    retryAfter: '1 minute'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limiter for password reset
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 password reset attempts per hour
  skip: skipPlaywright, // Skip for Playwright tests
  message: {
    error: 'Too many password reset attempts, please try again after 1 hour.',
    retryAfter: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limiter for registration
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 registrations per hour
  skip: skipPlaywright, // Skip for Playwright tests
  message: {
    error: 'Too many registration attempts, please try again after 1 hour.',
    retryAfter: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limiter for sensor data read endpoints (more relaxed)
const sensorDataLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // Limit each IP to 30 requests per minute
  skip: skipPlaywright, // Skip for Playwright tests
  message: {
    error: 'Too many requests, please slow down.',
    retryAfter: '1 minute'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  apiLimiter,
  authLimiter,
  iotLimiter,
  passwordResetLimiter,
  registerLimiter,
  sensorDataLimiter
};

