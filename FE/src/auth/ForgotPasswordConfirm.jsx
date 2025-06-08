import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function ForgotPasswordConfirm() {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || '[Unknown Email]';

    const handleContinue = (e) => {
        e.preventDefault();
        // Hiển thị thành công thay vì dùng alert
        const successElement = document.getElementById('success-message');
        successElement.classList.remove('hidden');
        
        // Tự động chuyển về trang đăng nhập sau 3 giây
        setTimeout(() => {
            navigate('/login');
        }, 3000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
                <div className="flex justify-center mb-6">
                    <div className="bg-cyan-500 rounded-full p-3">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                </div>
                
                <h2 className="text-2xl font-bold text-center text-gray-900">Đặt lại mật khẩu</h2>
                <p className="text-gray-600 text-center mt-4 mb-6">
                    Nhấn nút <strong>"Tiếp tục"</strong> để gửi email đặt lại mật khẩu cho:<br />
                    <span className="font-medium text-gray-800 mt-1 block">{email}</span>
                </p>
                
                {/* Thông báo thành công (ẩn mặc định) */}
                <div id="success-message" className="hidden mb-6 bg-green-50 text-green-600 p-3 rounded-lg text-sm flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Email hướng dẫn đã được gửi thành công! Đang chuyển hướng...
                </div>

                <form onSubmit={handleContinue} className="mt-6">
                    <button
                        type="submit"
                        className="w-full py-3 px-4 bg-cyan-500 text-white rounded-lg font-medium hover:bg-cyan-600 transition duration-200 shadow-sm flex items-center justify-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                        Tiếp tục
                    </button>
                </form>

                <div className="text-center mt-6">
                    <button
                        onClick={() => navigate('/login')}
                        className="text-cyan-600 hover:text-cyan-700 font-medium transition duration-150"
                    >
                        Quay lại trang đăng nhập
                    </button>
                </div>
                
                <div className="mt-8 border-t border-gray-200 pt-6">
                    <p className="text-sm text-gray-500 text-center">
                        Không nhận được email? Kiểm tra thư mục spam hoặc{' '}
                        <span className="text-cyan-600 hover:text-cyan-700 cursor-pointer">thử lại với email khác</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ForgotPasswordConfirm;
