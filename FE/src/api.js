import axios from 'axios';

// Lưu ý: BASE_URL chỉ nên đến https://api.lightoptimization.io.vn/api
export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.lightoptimization.io.vn/api';

// Login
export const loginUser = async (email, password) => {
    try {
        console.log("GỬI LOGIN:", email, password);
        const response = await axios.post(`${BASE_URL}/users/login/`, { email, password });
        console.log("PHẢN HỒI LOGIN:", response.data);
        return response.data;
    } catch (error) {
        console.error("LỖI LOGIN:", error.response?.status, error.response?.data);
        throw error.response?.data || { detail: 'Đăng nhập thất bại' };
    }
};

// Register
export const registerUser = async (email, password) => {
    try {
        const response = await axios.post(`${BASE_URL}/users/register/`, { email, password });
        return response.data;
    } catch (error) {
        throw error.response?.data || { detail: 'Đăng ký thất bại' };
    }
};

// Request password reset
export const requestPasswordReset = async (email) => {
    try {
        const response = await axios.post(`${BASE_URL}/users/forgot-password/`, { email });
        return response.data;
    } catch (error) {
        throw error.response?.data || { detail: 'Gửi email reset thất bại' };
    }
};

// Confirm password reset
export const confirmPasswordReset = async (token, newPassword) => {
    try {
        const response = await axios.post(`${BASE_URL}/users/reset-password/`, {
            token,
            password: newPassword,
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { detail: 'Đổi mật khẩu thất bại' };
    }
};

// Fetch sensor data (có Bearer token)
export const fetchSensorData = () => {
    const token = localStorage.getItem('access_token'); // Lấy access token từ localStorage
    console.log("Token:", token);  // Xem token trong console
    return axios.get(`${BASE_URL}/sensor-data/`, {
        headers: {
            Authorization: `Bearer ${token}`, // Thêm header Authorization với token
        },
    });
};
