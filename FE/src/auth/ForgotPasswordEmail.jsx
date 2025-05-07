import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ForgotPasswordEmail() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');

    const handleContinue = (e) => {
        e.preventDefault();

        // Bạn có thể gửi email đến server tại đây nếu muốn
        navigate('/forgot-password/confirm', { state: { email } });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-center text-gray-900">Forgot password</h2>
                <p className="text-gray-600 text-center mt-2">
                    Enter your email address and we’ll send you a link to reset your password.
                </p>

                <form onSubmit={handleContinue} className="mt-6 space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>

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

export default ForgotPasswordEmail;
