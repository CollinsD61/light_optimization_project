import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { loginUser, BASE_URL } from '../api';

const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
    password: Yup.string().required('Mật khẩu là bắt buộc'),
});

function LoginPage() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loginError, setLoginError] = useState(null);

    const handleGoogleLoginSuccess = async (credentialResponse) => {
        try {
            setLoginError(null);
            // Hiển thị trạng thái đang đăng nhập
            document.getElementById('google-login-status').classList.remove('hidden');
            
            const response = await axios.post(`${BASE_URL}/api/users/google-login/`, {
                token: credentialResponse.credential
            });

            const decodedGoogleToken = jwtDecode(credentialResponse.credential);
            const userEmail = decodedGoogleToken.email;

            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            localStorage.setItem('user_email', userEmail);

            // Hiệu ứng thành công trước khi chuyển hướng
            document.getElementById('google-login-status').innerHTML = 
                '<div class="flex items-center text-green-600"><svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>Đăng nhập thành công!</div>';
            
            setTimeout(() => navigate('/mainlayout/home'), 800);
        } catch (error) {
            console.error('Lỗi Google login:', error.response?.data || error.message);
            setLoginError('Đăng nhập bằng Google thất bại. Vui lòng thử lại.');
            document.getElementById('google-login-status').classList.add('hidden');
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Banner bên trái - Chỉ hiển thị trên màn hình trung bình trở lên */}
            <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-cyan-500 to-sky-600 text-white p-12 flex-col justify-between">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-6">Light Optimization</h1>
                    <p className="text-lg opacity-90 mb-8">
                        Đăng nhập để truy cập hệ thống tối ưu hóa ánh sáng thông minh cho cây thanh long
                    </p>
                    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                        <div className="flex items-center mb-4">
                            <div className="bg-white text-sky-500 rounded-full p-2 mr-4">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold">Giám sát thời gian thực</h3>
                                <p className="text-sm opacity-80">Theo dõi các thông số môi trường trên dashboard</p>
                            </div>
                        </div>
                        <div className="flex items-center mb-4">
                            <div className="bg-white text-sky-500 rounded-full p-2 mr-4">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold">Kiểm soát ánh sáng</h3>
                                <p className="text-sm opacity-80">Điều chỉnh các tham số ánh sáng cho cây trồng</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div className="bg-white text-sky-500 rounded-full p-2 mr-4">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold">Phân tích dữ liệu</h3>
                                <p className="text-sm opacity-80">Xem báo cáo phân tích dữ liệu và xu hướng</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-auto">
                    <p className="text-sm opacity-75">© 2025 UIT - Dragon Fruit Light Optimization Project</p>
                </div>
            </div>
            
            {/* Form đăng nhập bên phải */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-10 bg-gray-50">
                <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                    {/* Logo cho mobile */}
                    <div className="md:hidden flex items-center justify-center mb-6">
                        <div className="bg-cyan-500 rounded-full p-3">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                    </div>
                    
                    <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">Đăng nhập</h2>
                    <p className="text-gray-500 text-center mb-8">Chào mừng trở lại! Đăng nhập vào hệ thống</p>
                    
                    {loginError && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {loginError}
                        </div>
                    )}
                    
                    <Formik
                        initialValues={{ email: '', password: '' }}
                        validationSchema={LoginSchema}
                        onSubmit={async (values, { setSubmitting, setErrors }) => {
                            try {
                                setLoginError(null);
                                const data = await loginUser(values.email, values.password);
                                localStorage.setItem('access_token', data.access);
                                localStorage.setItem('refresh_token', data.refresh);
                                localStorage.setItem('user_email', values.email);
                                navigate('/mainlayout/home');
                            } catch (error) {
                                setLoginError(error.detail || 'Email hoặc mật khẩu không đúng.');
                            } finally {
                                setSubmitting(false);
                            }
                        }}
                    >
                        {({ isSubmitting }) => (
                            <Form className="space-y-5">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                            </svg>
                                        </div>
                                        <Field 
                                            type="email" 
                                            name="email" 
                                            id="email" 
                                            placeholder="you@example.com"
                                            className="block w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:ring-cyan-400 focus:border-cyan-400 transition duration-150" 
                                        />
                                    </div>
                                    <ErrorMessage name="email" component="p" className="mt-1 text-red-500 text-sm" />
                                </div>
                                
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                            Mật khẩu
                                        </label>
                                        <div 
                                            className="text-sm text-cyan-600 hover:text-cyan-700 font-medium cursor-pointer transition duration-150" 
                                            onClick={() => navigate('/forgot-password')}
                                        >
                                            Quên mật khẩu?
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                        <Field 
                                            type={showPassword ? 'text' : 'password'} 
                                            name="password" 
                                            id="password" 
                                            placeholder="••••••••"
                                            className="block w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:ring-cyan-400 focus:border-cyan-400 transition duration-150" 
                                        />
                                        <button 
                                            type="button" 
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 transition duration-150" 
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7-1.274 4.057-5.065 7-9.543 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                    <ErrorMessage name="password" component="p" className="mt-1 text-red-500 text-sm" />
                                </div>
                                
                                <button 
                                    type="submit" 
                                    disabled={isSubmitting} 
                                    className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-lg transition duration-200 disabled:opacity-70 font-medium flex items-center justify-center space-x-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>Đang đăng nhập...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Đăng nhập</span>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </>
                                    )}
                                </button>
                            </Form>
                        )}
                    </Formik>
                    
                    <div className="flex items-center my-6">
                        <hr className="flex-grow border-gray-200" />
                        <span className="mx-3 text-gray-500 text-sm font-medium">HOẶC</span>
                        <hr className="flex-grow border-gray-200" />
                    </div>
                    
                    <div className="mb-4">
                        <GoogleLogin 
                            onSuccess={handleGoogleLoginSuccess} 
                            onError={() => {
                                console.log('Login Failed');
                                setLoginError('Đăng nhập với Google thất bại');
                            }} 
                            width="100%" 
                            theme="outline" 
                            size="large" 
                            shape="rectangular"
                            text="signin_with"
                            logo_alignment="center"
                        />
                    </div>
                    
                    <div id="google-login-status" className="text-center text-sm py-2 hidden"></div>
                    
                    <div className="text-center mt-6 text-base">
                        Chưa có tài khoản?{' '}
                        <span onClick={() => navigate('/signup')} className="text-cyan-600 hover:text-cyan-700 font-medium cursor-pointer transition duration-150">
                            Đăng ký ngay
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;