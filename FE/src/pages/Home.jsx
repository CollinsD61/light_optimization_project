import React, { useState, useEffect } from 'react';

const Home = () => {
    // Dark mode
    const [darkMode, setDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return savedMode !== null ? JSON.parse(savedMode) : prefersDark;
    });

    // Language
    const [language, setLanguage] = useState(() => {
        const savedLanguage = localStorage.getItem('language');
        return savedLanguage || 'vi';
    });
    const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
    }, [darkMode]);

    useEffect(() => {
        localStorage.setItem('language', language);
        // Có thể gắn i18n ở đây nếu có
    }, [language]);

    const toggleDarkMode = () => setDarkMode(prev => !prev);
    const changeLanguage = (lang) => {
        setLanguage(lang);
        setLanguageDropdownOpen(false);
    };

    const languages = [
        { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'zh', name: '中文', flag: '🇨🇳' },
        { code: 'ja', name: '日本語', flag: '🇯🇵' },
    ];
    const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

    // Dữ liệu mẫu
    const devicesOnline = 5;
    const devicesTotal = 8;
    const warnings = [
        { label: "Nhiệt độ cao", time: "1 giờ trước", type: "danger" },
        { label: "Ánh sáng yếu", time: "3 giờ trước", type: "normal" },
        { label: "Độ ẩm thấp", time: "12 giờ trước", type: "normal" }
    ];

    return (
        <div className="p-6 transition-colors duration-200 bg-gray-50 dark:bg-gray-900 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Bảng điều khiển</h1>
                <div className="flex items-center space-x-3">
                    {/* Language Dropdown */}
                    <div className="relative">
                        <button 
                            onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                            className="flex items-center px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                        >
                            <span className="mr-2">{currentLanguage.flag}</span>
                            <span>{currentLanguage.name}</span>
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={languageDropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                            </svg>
                        </button>
                        {languageDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                                <ul className="py-1">
                                    {languages.map((lang) => (
                                        <li key={lang.code}>
                                            <button
                                                onClick={() => changeLanguage(lang.code)}
                                                className={`flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${
                                                    language === lang.code ? 'bg-gray-100 dark:bg-gray-700 text-cyan-600 dark:text-cyan-400 font-medium' : 'text-gray-700 dark:text-gray-300'
                                                }`}
                                            >
                                                <span className="mr-3">{lang.flag}</span>
                                                {lang.name}
                                                {language === lang.code && (
                                                    <svg className="w-4 h-4 ml-auto text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    {/* Dark mode toggle */}
                    <button 
                        onClick={toggleDarkMode}
                        className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white transition-colors duration-200"
                        aria-label="Toggle dark mode"
                    >
                        {darkMode ? (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Dashboard summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Tổng thiết bị */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-200 hover:shadow-lg border-l-4 border-cyan-500">
                    <div className="flex items-center">
                        <div className="bg-cyan-100 dark:bg-cyan-900 p-3 rounded-full">
                            <svg className="w-6 h-6 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <h2 className="text-sm font-medium text-gray-600 dark:text-gray-300">Tổng thiết bị</h2>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{devicesTotal}</p>
                        </div>
                    </div>
                    <div className="mt-3 flex justify-between items-center">
                        <span className="text-sm text-green-500 font-medium flex items-center">
                            <span>{devicesOnline} hoạt động</span>
                        </span>
                        <span className="text-sm text-red-500 font-medium flex items-center">
                            <span>{devicesTotal-devicesOnline} không hoạt động</span>
                        </span>
                    </div>
                </div>

                {/* Cảnh báo */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-200 hover:shadow-lg border-l-4 border-yellow-500">
                    <div className="flex items-center">
                        <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-full">
                            <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <h2 className="text-sm font-medium text-gray-600 dark:text-gray-300">Cảnh báo</h2>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{warnings.length}</p>
                        </div>
                    </div>
                    <div className="mt-3 flex justify-between items-center">
                        <span className="text-sm text-red-500 font-medium flex items-center">
                            <span>1 nghiêm trọng</span>
                        </span>
                        <span className="text-sm text-blue-500 font-medium flex items-center">
                            <span>3 đã xử lý</span>
                        </span>
                    </div>
                </div>

                {/* Bảng điều khiển */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-200 hover:shadow-lg border-l-4 border-indigo-500">
                    <div className="flex items-center">
                        <div className="bg-indigo-100 dark:bg-indigo-900 p-3 rounded-full">
                            <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <h2 className="text-sm font-medium text-gray-600 dark:text-gray-300">Bảng điều khiển</h2>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">1</p>
                        </div>
                    </div>
                    <div className="mt-3">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Bảng điều khiển mặc định</span>
                    </div>
                </div>

                {/* Hoạt động */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-200 hover:shadow-lg border-l-4 border-green-500">
                    <div className="flex items-center">
                        <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <h2 className="text-sm font-medium text-gray-600 dark:text-gray-300">Hoạt động</h2>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">30</p>
                        </div>
                    </div>
                    <div className="mt-3">
                        <span className="text-sm text-gray-600 dark:text-gray-300">30 ngày qua</span>
                    </div>
                </div>
            </div>

            {/* Danh sách chức năng chính */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
                {/* Thiết bị */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-200 hover:shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
                            <svg className="w-5 h-5 mr-2 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Thiết bị
                        </h2>
                        <span className="text-sm px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full">{devicesOnline} online</span>
                    </div>
                    <div className="mb-4">
                        <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Trạng thái</span>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{(devicesOnline/devicesTotal*100).toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${(devicesOnline/devicesTotal*100).toFixed(1)}%` }}></div>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <button className="flex-1 flex items-center justify-center px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition duration-200 text-sm font-medium">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Thêm thiết bị
                        </button>
                        <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition duration-200 text-sm font-medium">
                            Chi tiết
                        </button>
                    </div>
                </div>
                {/* Cảnh báo */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-200 hover:shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
                            <svg className="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            Cảnh báo
                        </h2>
                        <span className="text-sm px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full">{warnings.length} cảnh báo</span>
                    </div>
                    <div className="mb-4 space-y-2">
                        {warnings.map((warn, i) => (
                            <div key={i} className={`flex items-center justify-between p-2 rounded-lg ${warn.type === "danger" ? "bg-red-50 dark:bg-red-900/30" : "bg-gray-50 dark:bg-gray-700/30"}`}>
                                <span className={`text-sm font-medium ${warn.type === "danger" ? "text-red-700 dark:text-red-300" : "text-gray-700 dark:text-gray-300"}`}>{warn.label}</span>
                                <span className={`text-xs ${warn.type === "danger" ? "text-red-600 dark:text-red-400" : "text-gray-500 dark:text-gray-400"}`}>{warn.time}</span>
                            </div>
                        ))}
                    </div>
                    <button className="w-full flex items-center justify-center px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition duration-200 text-sm font-medium">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Xem cảnh báo
                    </button>
                </div>
                {/* Bảng điều khiển */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-200 hover:shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
                            <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                            </svg>
                            Bảng điều khiển
                        </h2>
                    </div>
                    <div className="mt-3">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Bảng điều khiển mặc định</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
