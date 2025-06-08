import axios from 'axios';

// BASE_URL lấy từ .env, KHÔNG có /api phía sau!
export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.lightoptimization.io.vn';

// Login
export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/users/login/`, { email, password });
        return response.data;
    } catch (error) {
        throw error.response?.data || { detail: 'Đăng nhập thất bại' };
    }
};

// Register
export const registerUser = async (email, password) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/users/register/`, { email, password });
        return response.data;
    } catch (error) {
        throw error.response?.data || { detail: 'Đăng ký thất bại' };
    }
};

// Request password reset
export const requestPasswordReset = async (email) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/users/forgot-password/`, { email });
        return response.data;
    } catch (error) {
        throw error.response?.data || { detail: 'Gửi email reset thất bại' };
    }
};

// Confirm password reset
export const confirmPasswordReset = async (token, newPassword) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/users/reset-password/`, {
            token,
            password: newPassword,
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { detail: 'Đổi mật khẩu thất bại' };
    }
};

// Google login
export const googleLogin = async (credential) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/users/google-login/`, { credential });
        return response.data;
    } catch (error) {
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
