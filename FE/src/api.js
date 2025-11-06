import axios from 'axios';
import { handleRateLimitError, isRateLimited, getRateLimitRemaining, formatRemainingTime } from './utils/rateLimitHandler';

// BASE_URL lấy từ .env, KHÔNG có /api phía sau!
export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.lightoptimization.io.vn';

// Login
export const loginUser = async (email, password) => {
    const endpoint = '/api/users/login/';
    
    // Check if rate limited
    if (isRateLimited(endpoint)) {
        const remaining = getRateLimitRemaining(endpoint);
        throw { 
            detail: `Too many login attempts. Please try again in ${formatRemainingTime(remaining)}.`,
            rateLimited: true 
        };
    }
    
    try {
        const response = await axios.post(`${BASE_URL}${endpoint}`, { email, password });
        return response.data;
    } catch (error) {
        // Handle rate limit error
        const limitInfo = handleRateLimitError(error, endpoint);
        if (limitInfo) {
            throw { 
                detail: `${limitInfo.message}. Try again in ${formatRemainingTime(parseInt(limitInfo.retryAfter))}.`,
                rateLimited: true 
            };
        }
        throw error.response?.data || { detail: 'Đăng nhập thất bại' };
    }
};

// Register
export const registerUser = async (email, password) => {
    const endpoint = '/api/users/register/';
    
    // Check if rate limited
    if (isRateLimited(endpoint)) {
        const remaining = getRateLimitRemaining(endpoint);
        throw { 
            detail: `Too many registration attempts. Please try again in ${formatRemainingTime(remaining)}.`,
            rateLimited: true 
        };
    }
    
    try {
        const response = await axios.post(`${BASE_URL}${endpoint}`, { email, password });
        return response.data;
    } catch (error) {
        // Handle rate limit error
        const limitInfo = handleRateLimitError(error, endpoint);
        if (limitInfo) {
            throw { 
                detail: `${limitInfo.message}. Try again in ${formatRemainingTime(parseInt(limitInfo.retryAfter))}.`,
                rateLimited: true 
            };
        }
        throw error.response?.data || { detail: 'Đăng ký thất bại' };
    }
};

// Request password reset
export const requestPasswordReset = async (email) => {
    const endpoint = '/api/users/forgot-password/';
    
    // Check if rate limited
    if (isRateLimited(endpoint)) {
        const remaining = getRateLimitRemaining(endpoint);
        throw { 
            detail: `Too many password reset attempts. Please try again in ${formatRemainingTime(remaining)}.`,
            rateLimited: true 
        };
    }
    
    try {
        const response = await axios.post(`${BASE_URL}${endpoint}`, { email });
        return response.data;
    } catch (error) {
        // Handle rate limit error
        const limitInfo = handleRateLimitError(error, endpoint);
        if (limitInfo) {
            throw { 
                detail: `${limitInfo.message}. Try again in ${formatRemainingTime(parseInt(limitInfo.retryAfter))}.`,
                rateLimited: true 
            };
        }
        throw error.response?.data || { detail: 'Gửi email reset thất bại' };
    }
};

// Confirm password reset
export const confirmPasswordReset = async (token, newPassword) => {
    const endpoint = '/api/users/reset-password/';
    
    // Check if rate limited
    if (isRateLimited(endpoint)) {
        const remaining = getRateLimitRemaining(endpoint);
        throw { 
            detail: `Too many attempts. Please try again in ${formatRemainingTime(remaining)}.`,
            rateLimited: true 
        };
    }
    
    try {
        const response = await axios.post(`${BASE_URL}${endpoint}`, {
            token,
            password: newPassword,
        });
        return response.data;
    } catch (error) {
        // Handle rate limit error
        const limitInfo = handleRateLimitError(error, endpoint);
        if (limitInfo) {
            throw { 
                detail: `${limitInfo.message}. Try again in ${formatRemainingTime(parseInt(limitInfo.retryAfter))}.`,
                rateLimited: true 
            };
        }
        throw error.response?.data || { detail: 'Đổi mật khẩu thất bại' };
    }
};

// Google login
export const googleLogin = async (credential) => {
    const endpoint = '/api/users/google-login/';
    
    // Check if rate limited
    if (isRateLimited(endpoint)) {
        const remaining = getRateLimitRemaining(endpoint);
        throw { 
            detail: `Too many login attempts. Please try again in ${formatRemainingTime(remaining)}.`,
            rateLimited: true 
        };
    }
    
    try {
        const response = await axios.post(`${BASE_URL}${endpoint}`, { credential });
        return response.data;
    } catch (error) {
        // Handle rate limit error
        const limitInfo = handleRateLimitError(error, endpoint);
        if (limitInfo) {
            throw { 
                detail: `${limitInfo.message}. Try again in ${formatRemainingTime(parseInt(limitInfo.retryAfter))}.`,
                rateLimited: true 
            };
        }
        throw error.response?.data || { detail: 'Đăng nhập Google thất bại' };
    }
};

// Fetch sensor data (có Bearer token)
export const fetchSensorData = () => {
    const token = localStorage.getItem('access_token'); // Lấy access token từ localStorage
    return axios.get(`${BASE_URL}/api/sensor-data/`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
