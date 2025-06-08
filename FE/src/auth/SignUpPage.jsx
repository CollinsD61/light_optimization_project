import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { registerUser } from '../api';

const SignUpSchema = Yup.object().shape({
    email: Yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
    password: Yup.string().min(6, 'Mật khẩu ít nhất 6 ký tự').required('Mật khẩu là bắt buộc'),
});

function SignUpPage() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [registerError, setRegisterError] = useState(null);

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
            {/* Banner bên trái - Giống với trang login */}
            <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-cyan-500 to-sky-600 text-white p-12 flex-col justify-between">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-6">Light Optimization</h1>
                    <p className="text-lg opacity-90 mb-8">
                        Tạo tài khoản để truy cập hệ thống tối ưu hóa ánh sáng thông minh cho cây thanh long
                    </p>
                    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                        <div className="flex items-center mb-4">
                            <div className="bg-white text-sky-500 rounded-full p-2 mr-4">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold">Bảo mật dữ liệu</h3>
                                <p className="text-sm opacity-80">Dữ liệu người dùng được bảo mật và mã hóa</p>
                            </div>
                        </div>
                        <div className="flex items-center mb-4">
                            <div className="bg-white text-sky-500 rounded-full p-2 mr-4">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold">Trải nghiệm cá nhân hóa</h3>
                                <p className="text-sm opacity-80">Tùy chỉnh giao diện và thiết lập theo nhu cầu</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div className="bg-white text-sky-500 rounded-full p-2 mr-4">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold">Đăng ký miễn phí</h3>
                                <p className="text-sm opacity-80">Tạo tài khoản và trải nghiệm ngay hôm nay</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-auto">
                    <p className="text-sm opacity-75">© 2025 UIT - Dragon Fruit Light Optimization Project</p>
                </div>
            </div>

            {/* Form đăng ký bên phải */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-10">
                <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                    {/* Logo cho mobile */}
                    <div className="md:hidden flex items-center justify-center mb-6">
                        <div className="bg-cyan-500 rounded-full p-3">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">Đăng ký tài khoản</h2>
                    <p className="text-gray-500 text-center mb-8">Tạo tài khoản để sử dụng hệ thống</p>

                    {registerError && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {registerError}
                        </div>
                    )}

                    <Formik
                        initialValues={{ email: '', password: '' }}
                        validationSchema={SignUpSchema}
                        onSubmit={async (values, { setSubmitting }) => {
                            try {
                                setRegisterError(null);
                                await registerUser(values.email, values.password);
                                
                                // Hiển thị thông báo đăng ký thành công
                                const successDiv = document.createElement('div');
                                successDiv.className = 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50';
                                successDiv.innerHTML = `
                                    <div class="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full">
                                        <div class="flex justify-center mb-6">
                                            <div class="bg-green-100 rounded-full p-3">
                                                <svg class="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                                </svg>
                                            </div>
                                        </div>
                                        <h3 class="text-xl font-bold text-center text-gray-800">Đăng ký thành công!</h3>
                                        <p class="text-gray-600 text-center mt-2 mb-6">Tài khoản của bạn đã được tạo. Vui lòng đăng nhập để tiếp tục.</p>
                                        <button class="w-full bg-cyan-500 text-white py-2 rounded-lg hover:bg-cyan-600">Đến trang đăng nhập</button>
                                    </div>
                                `;
                                document.body.appendChild(successDiv);
                                
                                // Chuyển hướng sau khi hiển thị thông báo
                                successDiv.querySelector('button').addEventListener('click', () => {
                                    navigate('/login');
                                });
                                
                                setTimeout(() => {
                                    navigate('/login');
                                }, 3000);
                                
                            } catch (error) {
                                console.error('Lỗi đăng ký:', error);
                                setRegisterError(error.detail || 'Email đã được sử dụng hoặc lỗi hệ thống.');
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
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                        Mật khẩu
                                    </label>
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
                                            placeholder="Mật khẩu ít nhất 6 ký tự"
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

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-lg transition duration-200 disabled:opacity-70 font-medium flex items-center justify-center"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span>Đang tạo tài khoản...</span>
                                            </>
                                        ) : (
                                            'Đăng ký tài khoản'
                                        )}
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>

                    <div className="flex items-center my-6">
                        <hr className="flex-grow border-gray-200" />
                        <span className="mx-3 text-gray-500 text-sm font-medium">HOẶC</span>
                        <hr className="flex-grow border-gray-200" />
                    </div>

                    <div className="text-center text-base">
                        Đã có tài khoản?{' '}
                        <span onClick={() => navigate('/login')} className="text-cyan-600 hover:text-cyan-700 font-medium cursor-pointer transition duration-150">
                            Đăng nhập ngay
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUpPage;
