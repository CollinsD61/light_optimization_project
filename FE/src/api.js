import axios from 'axios';

const BASE_URL = 'http://222.255.238.187:8000'; // đúng IP máy đang chạy BE
//const BASE_URL = 'http://10.45.153.76:8000';

export const loginUser = async (email, password) => {
    try {
        console.log("GỬI LOGIN:", email, password);
        const response = await axios.post(`${BASE_URL}/api/users/login/`, { email, password });
        console.log("PHẢN HỒI LOGIN:", response.data);
        return response.data;
    } catch (error) {
        console.error("LỖI LOGIN:", error.response?.status, error.response?.data);
        throw error.response?.data || { detail: 'Đăng nhập thất bại' };
    }
};

export const registerUser = async (email, password) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/users/register/`, {
            email,
            password,
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { detail: 'Đăng ký thất bại' };
    }
};

export const requestPasswordReset = async (email) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/users/forgot-password/`, { email });
        return response.data;
    } catch (error) {
        throw error.response?.data || { detail: 'Gửi email reset thất bại' };
    }
};

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


export const fetchSensorData = () => {
    const token = localStorage.getItem('access_token'); // Lấy access token từ localStorage
    console.log("Token:", token);  // Xem token trong console
    return axios.get(`${BASE_URL}/api/sensor-data/`, {
        headers: {
            Authorization: `Bearer ${token}`, // Thêm header Authorization với token
        },
    });
};