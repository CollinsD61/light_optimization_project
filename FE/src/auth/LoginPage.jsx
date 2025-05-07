import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { loginUser } from '../api';

const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
    password: Yup.string().required('Mật khẩu là bắt buộc'),
});

function LoginPage() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const handleGoogleLoginSuccess = async (credentialResponse) => {
        try {
            const response = await axios.post('/api/users/google-login/', {
                token: credentialResponse.credential
            });
            localStorage.setItem('access_token', response.data.token);
            localStorage.setItem('user_email', response.data.email);
            navigate('/mainlayout');
        } catch (error) {
            console.error('Lỗi Google login:', error);
        }
    };

    return (
        <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                    <h2 className="text-2xl font-semibold text-center mb-6">Welcome back</h2>

                    <Formik
                        initialValues={{ email: '', password: '' }}
                        validationSchema={LoginSchema}
                        onSubmit={async (values, { setSubmitting, setErrors }) => {
                            try {
                                const data = await loginUser(values.email, values.password);
                                localStorage.setItem('access_token', data.access);
                                localStorage.setItem('refresh_token', data.refresh);
                                localStorage.setItem('user_email', values.email);
                                navigate('/mainlayout');
                                console.log('Đã chuyển tới mainlayout');

                            } catch (error) {
                                if (error.detail === "No active account found with the given credentials") {
                                    setErrors({ form: 'Email hoặc mật khẩu không đúng' });
                                } else {
                                    setErrors({ form: error.detail || 'Có lỗi xảy ra, vui lòng thử lại.' });
                                }
                            }
                            finally {
                                setSubmitting(false);
                            }
                        }}
                    >
                        {({ isSubmitting }) => (
                            <Form className="space-y-4">
                                <ErrorMessage name="form" component="p" className="text-red-500 text-sm" />

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                                    <Field
                                        type="email"
                                        name="email"
                                        id="email"
                                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                                    />
                                    <ErrorMessage name="email" component="p" className="text-red-500 text-sm" />
                                </div>

                                <div className="relative">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                    <Field
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        id="password"
                                        placeholder="Password"
                                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-9 text-gray-500"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        👁️
                                    </button>
                                    <ErrorMessage name="password" component="p" className="text-red-500 text-sm" />
                                </div>

                                <div
                                    className="text-sm text-right text-emerald-600 hover:underline cursor-pointer"
                                    onClick={() => navigate('/forgot-password')}
                                >
                                    Forgot password?
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-md transition duration-200"
                                >
                                    {isSubmitting ? 'Đang đăng nhập...' : 'Continue'}
                                </button>
                            </Form>
                        )}
                    </Formik>

                    <div className="text-center mt-4 text-sm">
                        Don’t have an account?{' '}
                        <span
                            onClick={() => navigate('/signup')}
                            className="text-emerald-600 hover:underline cursor-pointer"
                        >
                            Sign up
                        </span>
                    </div>

                    <div className="flex items-center my-4">
                        <hr className="flex-grow border-gray-300" />
                        <span className="mx-2 text-gray-400 text-sm">OR</span>
                        <hr className="flex-grow border-gray-300" />
                    </div>

                    <GoogleLogin
                        onSuccess={handleGoogleLoginSuccess}
                        onError={() => console.log('Login Failed')}
                        width="100%"
                    />

                </div>
            </div>
        </GoogleOAuthProvider>
    );
}

export default LoginPage;
