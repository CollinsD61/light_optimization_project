import React, { useState } from 'react';
import { Switch } from '@headlessui/react';

const SettingsPage = () => {
    // Lấy darkMode từ localStorage
    const [darkMode, setDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode ? JSON.parse(savedMode) : false;
    });

    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [emailAlerts, setEmailAlerts] = useState(false);
    const [dataRefreshInterval, setDataRefreshInterval] = useState('5');
    const [temperatureUnit, setTemperatureUnit] = useState('celsius');
    const [apiKey, setApiKey] = useState('');
    const [endpoint, setEndpoint] = useState('https://api.yourserver.com/v1/');
    const [savedSettings, setSavedSettings] = useState(false);

    // Toggle dark mode
    const handleDarkModeToggle = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        document.documentElement.classList.toggle('dark', newMode);
        localStorage.setItem('darkMode', JSON.stringify(newMode));
    };

    // Lưu settings
    const handleSaveSettings = () => {
        localStorage.setItem('settings', JSON.stringify({
            notificationsEnabled,
            emailAlerts,
            dataRefreshInterval,
            temperatureUnit,
            apiKey,
            endpoint,
        }));

        setSavedSettings(true);
        setTimeout(() => setSavedSettings(false), 3000);
    };

    // Sao chép API Key
    const handleCopyApiKey = () => {
        if (apiKey) {
            navigator.clipboard.writeText(apiKey);
            alert('Đã sao chép!');
        }
    };

    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Cài đặt hệ thống</h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                    Quản lý tùy chọn và cấu hình cho hệ thống của bạn
                </p>
            </div>

            {/* Thông báo đã lưu */}
            {savedSettings && (
                <div className="mb-6 p-4 bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-100 rounded-lg flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    Đã lưu cài đặt thành công!
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main settings */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Cài đặt chung
                        </h2>

                        {/* Dark mode */}
                        <div className="py-4 border-b border-gray-100 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-md font-medium text-gray-800 dark:text-white">Chế độ tối</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">Thay đổi giao diện sang chế độ tối</p>
                                </div>
                                <Switch
                                    checked={darkMode}
                                    onChange={handleDarkModeToggle}
                                    className={`${darkMode ? 'bg-indigo-600' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                                >
                                    <span className="sr-only">Bật chế độ tối</span>
                                    <span
                                        className={`${darkMode 
                                            ? 'translate-x-6 bg-white' 
                                            : 'translate-x-1 bg-gray-800'} 
                                            inline-block w-4 h-4 transform rounded-full transition-transform transition-colors duration-200`}
                                    />
                                </Switch>
                            </div>
                        </div>

                        {/* Notifications */}
                        <div className="py-4 border-b border-gray-100 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-md font-medium text-gray-800 dark:text-white">Thông báo trong ứng dụng</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">Nhận thông báo về cảnh báo và sự kiện</p>
                                </div>
                                <Switch
                                    checked={notificationsEnabled}
                                    onChange={setNotificationsEnabled}
                                    className={`${notificationsEnabled ? 'bg-indigo-600' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                                >
                                    <span className="sr-only">Bật thông báo</span>
                                    <span
                                        className={`${notificationsEnabled 
                                            ? 'translate-x-6 bg-white' 
                                            : 'translate-x-1 bg-gray-800'} 
                                            inline-block w-4 h-4 transform rounded-full transition-transform transition-colors duration-200`}
                                    />
                                </Switch>
                            </div>
                        </div>

                        {/* Email alerts */}
                        <div className="py-4 border-b border-gray-100 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-md font-medium text-gray-800 dark:text-white">Cảnh báo qua Email</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">Nhận email khi có cảnh báo quan trọng</p>
                                </div>
                                <Switch
                                    checked={emailAlerts}
                                    onChange={setEmailAlerts}
                                    className={`${emailAlerts ? 'bg-indigo-600' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                                >
                                    <span className="sr-only">Bật email cảnh báo</span>
                                    <span
                                        className={`${emailAlerts 
                                            ? 'translate-x-6 bg-white' 
                                            : 'translate-x-1 bg-gray-800'} 
                                            inline-block w-4 h-4 transform rounded-full transition-transform transition-colors duration-200`}
                                    />
                                </Switch>
                            </div>
                        </div>

                        {/* Temperature unit */}
                        <div className="py-4 border-b border-gray-100 dark:border-gray-700">
                            <h3 className="text-md font-medium text-gray-800 dark:text-white mb-2">Đơn vị nhiệt độ</h3>
                            <div className="flex space-x-2">
                                <button
                                    className={`px-3 py-1.5 rounded-md ${temperatureUnit === 'celsius'
                                        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                    onClick={() => setTemperatureUnit('celsius')}
                                >
                                    Celsius (°C)
                                </button>
                                <button
                                    className={`px-3 py-1.5 rounded-md ${temperatureUnit === 'fahrenheit'
                                        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                    onClick={() => setTemperatureUnit('fahrenheit')}
                                >
                                    Fahrenheit (°F)
                                </button>
                            </div>
                        </div>

                        {/* Data refresh interval */}
                        <div className="py-4">
                            <h3 className="text-md font-medium text-gray-800 dark:text-white mb-2">Tần suất làm mới dữ liệu</h3>
                            <select
                                value={dataRefreshInterval}
                                onChange={(e) => setDataRefreshInterval(e.target.value)}
                                className="block w-full mt-1 rounded-md border border-gray-300 dark:border-gray-600 shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                <option value="5">5 giây</option>
                                <option value="10">10 giây</option>
                                <option value="30">30 giây</option>
                                <option value="60">1 phút</option>
                                <option value="300">5 phút</option>
                            </select>
                        </div>
                    </div>

                    {/* API settings */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                            Cấu hình API
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">API Key</label>
                                <div className="flex">
                                    <input
                                        type="password"
                                        value={apiKey}
                                        onChange={(e) => setApiKey(e.target.value)}
                                        className="flex-1 rounded-l-md border border-gray-300 dark:border-gray-600 shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="API Key"
                                        autoComplete="off"
                                    />
                                    <button
                                        type="button"
                                        className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-r-md hover:bg-gray-200 dark:hover:bg-gray-500"
                                        onClick={handleCopyApiKey}
                                    >
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Endpoint</label>
                                <input
                                    type="text"
                                    value={endpoint}
                                    onChange={(e) => setEndpoint(e.target.value)}
                                    className="block w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition duration-200"
                                    onClick={() => alert('API đã được cập nhật')}
                                >
                                    Cập nhật API
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* System info */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Thông tin hệ thống
                        </h2>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Phiên bản</span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">v1.2.5</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Lần cập nhật cuối</span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">04/06/2025</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Thiết bị kết nối</span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">15</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Trạng thái</span>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                    Hoạt động
                                </span>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                            <button
                                className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium rounded-lg transition duration-200"
                                onClick={() => alert('Kiểm tra cập nhật...')}
                            >
                                Kiểm tra cập nhật
                            </button>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Hành động
                        </h2>
                        <div className="space-y-3">
                            <button
                                onClick={handleSaveSettings}
                                className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                Lưu tất cả cài đặt
                            </button>
                            <button
                                className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center"
                                onClick={() => window.confirm('Bạn có chắc muốn khởi động lại hệ thống?')}
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Khởi động lại hệ thống
                            </button>
                            <button
                                className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center"
                                onClick={() => window.confirm('Bạn có chắc muốn đặt lại về cài đặt gốc? Hành động này không thể hoàn tác.')}
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Đặt lại cài đặt
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
