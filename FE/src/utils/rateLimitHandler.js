/**
 * Rate Limit Handler Utility
 * Handles 429 (Too Many Requests) errors from backend
 */

// Store for tracking rate limit status per endpoint
const rateLimitStore = new Map();

/**
 * Check if an endpoint is currently rate limited
 * @param {string} endpoint - The API endpoint
 * @returns {boolean} - True if rate limited
 */
export const isRateLimited = (endpoint) => {
  const limitInfo = rateLimitStore.get(endpoint);
  if (!limitInfo) return false;
  
  const now = Date.now();
  if (now < limitInfo.resetTime) {
    return true;
  }
  
  // Clear expired rate limit
  rateLimitStore.delete(endpoint);
  return false;
};

/**
 * Get remaining time for rate limit
 * @param {string} endpoint - The API endpoint
 * @returns {number} - Seconds remaining, or 0 if not limited
 */
export const getRateLimitRemaining = (endpoint) => {
  const limitInfo = rateLimitStore.get(endpoint);
  if (!limitInfo) return 0;
  
  const now = Date.now();
  const remaining = Math.ceil((limitInfo.resetTime - now) / 1000);
  return remaining > 0 ? remaining : 0;
};

/**
 * Handle rate limit error from API response
 * @param {object} error - Axios error object
 * @param {string} endpoint - The API endpoint
 * @returns {object} - Rate limit info
 */
export const handleRateLimitError = (error, endpoint) => {
  if (error.response && error.response.status === 429) {
    // Extract rate limit headers
    const headers = error.response.headers;
    const retryAfter = headers['retry-after']; // In seconds
    const rateLimitReset = headers['ratelimit-reset']; // Unix timestamp
    
    // Calculate reset time
    let resetTime;
    if (rateLimitReset) {
      resetTime = parseInt(rateLimitReset) * 1000; // Convert to milliseconds
    } else if (retryAfter) {
      resetTime = Date.now() + (parseInt(retryAfter) * 1000);
    } else {
      // Default to 15 minutes if no header provided
      resetTime = Date.now() + (15 * 60 * 1000);
    }
    
    // Store rate limit info
    const limitInfo = {
      resetTime,
      retryAfter: retryAfter || '900', // Default 15 minutes in seconds
      message: error.response.data?.error || 'Too many requests',
    };
    
    rateLimitStore.set(endpoint, limitInfo);
    
    return limitInfo;
  }
  
  return null;
};

/**
 * Format remaining time as human readable string
 * @param {number} seconds - Seconds remaining
 * @returns {string} - Formatted string
 */
export const formatRemainingTime = (seconds) => {
  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? 's' : ''}`;
  }
  
  const minutes = Math.ceil(seconds / 60);
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
  
  const hours = Math.ceil(minutes / 60);
  return `${hours} hour${hours !== 1 ? 's' : ''}`;
};

/**
 * Clear rate limit for an endpoint
 * @param {string} endpoint - The API endpoint
 */
export const clearRateLimit = (endpoint) => {
  rateLimitStore.delete(endpoint);
};

/**
 * Clear all rate limits
 */
export const clearAllRateLimits = () => {
  rateLimitStore.clear();
};

/**
 * Get all active rate limits
 * @returns {Array} - Array of {endpoint, resetTime, retryAfter}
 */
export const getAllRateLimits = () => {
  const now = Date.now();
  const limits = [];
  
  rateLimitStore.forEach((value, key) => {
    if (now < value.resetTime) {
      limits.push({
        endpoint: key,
        resetTime: value.resetTime,
        retryAfter: value.retryAfter,
        message: value.message,
        remainingSeconds: getRateLimitRemaining(key)
      });
    }
  });
  
  return limits;
};

export default {
  isRateLimited,
  getRateLimitRemaining,
  handleRateLimitError,
  formatRemainingTime,
  clearRateLimit,
  clearAllRateLimits,
  getAllRateLimits
};

