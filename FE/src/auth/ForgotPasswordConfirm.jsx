import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function ForgotPasswordConfirm() {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || '[Unknown Email]';

    const handleContinue = (e) => {
        e.preventDefault();
        alert("Email reset password đã được gửi tới " + email);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-center text-gray-900">Reset password</h2>
                <p className="text-gray-600 text-center mt-2">
                    Click <strong>“Continue”</strong> to reset your password for <br />
                    <span className="font-medium text-gray-800">{email}</span>
                </p>

                <form onSubmit={handleContinue} className="mt-6">
                    <button
                        type="submit"
                        className="w-full py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition"
                    >
                        Continue
                    </button>
                </form>

                <div className="text-center mt-6">
                    <button
                        onClick={() => navigate('/login')}
                        className="text-sm text-gray-700 hover:underline"
                    >
                        Back to login
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ForgotPasswordConfirm;
