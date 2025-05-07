import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { registerUser } from '../api';


const SignUpSchema = Yup.object().shape({
    name: Yup.string().required('Tên không được để trống'),
    email: Yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
    password: Yup.string().min(6, 'Mật khẩu ít nhất 6 ký tự').required('Mật khẩu là bắt buộc'),
});

function SignUpPage() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center mb-6">Create your account</h2>

                <Formik
                    initialValues={{ name: '', email: '', password: '' }}
                    validationSchema={SignUpSchema}
                    onSubmit={async (values, { setSubmitting, setErrors }) => {
                        try {
                            await registerUser(values.email, values.password);
                            navigate('/login');
                        } catch (error) {
                            setErrors({ form: error.detail || 'Lỗi server hoặc email đã được sử dụng.' });
                        } finally {
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

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-md transition duration-200"
                            >
                                {isSubmitting ? 'Đang tạo tài khoản...' : 'Create account'}
                            </button>
                        </Form>
                    )}
                </Formik>

                <div className="text-center mt-4 text-sm">
                    Already have an account?{' '}
                    <span
                        onClick={() => navigate('/login')}
                        className="text-emerald-600 hover:underline cursor-pointer"
                    >
                        Log in
                    </span>
                </div>
            </div>
        </div>
    );
}

export default SignUpPage;
