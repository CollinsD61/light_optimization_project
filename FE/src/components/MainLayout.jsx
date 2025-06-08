import Sidebar from './Sidebar';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Bell, Search, Moon, Sun, User, Settings, LogOut, HelpCircle } from "lucide-react";

const MainLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();
    const [userEmail, setUserEmail] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode ? JSON.parse(savedMode) : false;
    });
    const menuRef = useRef(null);
    const notificationsRef = useRef(null);
    const searchRef = useRef(null);
    const navigate = useNavigate();
    
    // Sample notifications for demo
    const notifications = [
        { 
            id: 1, 
            title: 'Nhiệt độ cao', 
            message: 'Cảm biến nhiệt độ A1 đã vượt ngưỡng 30°C',
            time: '10 phút trước',
            read: false,
            type: 'warning'
        },
        { 
            id: 2, 
            title: 'Hệ thống đã cập nhật', 
            message: 'Phiên bản mới v1.2.5 đã được cài đặt',
            time: '2 giờ trước',
            read: true, 
            type: 'info'
        },
        { 
            id: 3, 
            title: 'Mất kết nối Gateway', 
            message: 'Gateway E5 đã mất kết nối',
            time: 'Hôm qua',
            read: true, 
            type: 'error'
        }
    ];

    // Lấy tiêu đề trang hiện tại với tên đầy đủ và thân thiện hơn
    const getPageTitle = () => {
        const path = location.pathname;
        
        if (path.includes('/dashboard')) return 'Dashboard';
        if (path.includes('/alarms')) return 'Quản lý cảnh báo';
        if (path.includes('/settings')) return 'Cài đặt hệ thống';
        if (path.includes('/devices')) return 'Quản lý thiết bị';
        if (path.includes('/reports')) return 'Báo cáo & Thống kê';
        if (path.includes('/users')) return 'Quản lý người dùng';
        
        return 'Trang chủ'; // Default
    };

    // Toggle dark mode
    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        localStorage.setItem('darkMode', JSON.stringify(newMode));
        document.documentElement.classList.toggle('dark', newMode);
    };

    useEffect(() => {
        // Initialize dark mode
        document.documentElement.classList.toggle('dark', darkMode);
        
        // Get email from localStorage
        const email = localStorage.getItem('user_email');
        if (email) {
            setUserEmail(email);
        }

        // Close menus when clicking outside
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
            if (notificationsRef.current && !notificationsRef.current.contains(e.target)) {
                setNotificationsOpen(false);
            }
            if (searchRef.current && !searchRef.current.contains(e.target) && !e.target.closest('.search-button')) {
                setSearchOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [darkMode]);

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_email');
        navigate('/login');
    };

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
            {/* Sidebar */}
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
            
            {/* Main Content */}
            <div className={`${collapsed ? 'lg:ml-20' : 'lg:ml-64'} w-full transition-all duration-300 flex flex-col`}>
                {/* Header */}
                <header className="z-10 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                    <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
                        {/* Left side: Page title */}
                        <div className="flex items-center flex-shrink-0">
                            <h1 className="text-xl font-bold text-gray-800 dark:text-white">{getPageTitle()}</h1>
                        </div>

                        {/* Right side: Actions & User menu */}
                        <div className="flex items-center space-x-4">
                            {/* Search */}
                            <div className="relative hidden sm:block" ref={searchRef}>
                                <button 
                                    onClick={() => setSearchOpen(!searchOpen)} 
                                    className="search-button p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                                >
                                    <span className="sr-only">Tìm kiếm</span>
                                    <Search size={20} />
                                </button>
                                {searchOpen && (
                                    <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                                        <div className="p-2">
                                            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 px-3 py-2">
                                                <Search size={16} className="text-gray-400 dark:text-gray-500" />
                                                <input
                                                    type="text"
                                                    placeholder="Tìm kiếm..."
                                                    className="ml-2 flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-gray-900 dark:text-white text-sm"
                                                    autoFocus
                                                />
                                            </div>
                                        </div>
                                        <div className="px-2 py-2 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
                                            Nhấn <kbd className="px-1 bg-gray-100 dark:bg-gray-700 rounded">Enter</kbd> để tìm kiếm
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Theme toggle */}
                            <button
                                onClick={toggleDarkMode}
                                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                            >
                                <span className="sr-only">Chuyển giao diện</span>
                                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                            </button>

                            {/* Notifications */}
                            <div className="relative" ref={notificationsRef}>
                                <button
                                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                                    className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                                >
                                    <span className="sr-only">Thông báo</span>
                                    <div className="relative">
                                        <Bell size={20} />
                                        {notifications.some(n => !n.read) && (
                                            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800"></span>
                                        )}
                                    </div>
                                </button>
                                
                                {/* Notifications dropdown */}
                                {notificationsOpen && (
                                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                            <div className="flex items-center justify-between">
                                                <h2 className="text-sm font-medium text-gray-900 dark:text-white">Thông báo</h2>
                                                <span className="text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full">
                                                    {notifications.filter(n => !n.read).length} mới
                                                </span>
                                            </div>
                                        </div>
                                        <div className="max-h-80 overflow-y-auto">
                                            {notifications.length > 0 ? (
                                                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                                    {notifications.map(notification => (
                                                        <div key={notification.id} className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                                                            <div className="flex">
                                                                <div className={`flex-shrink-0 rounded-full p-2 ${
                                                                    notification.type === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' :
                                                                    notification.type === 'error' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                                                                    'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                                                }`}>
                                                                    <Bell size={16} />
                                                                </div>
                                                                <div className="ml-3 w-0 flex-1">
                                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{notification.title}</p>
                                                                    <p className="text-sm text-gray-500 dark:text-gray-400">{notification.message}</p>
                                                                    <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{notification.time}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                                                    Không có thông báo
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                                            <button 
                                                onClick={() => navigate('/notifications')}
                                                className="w-full px-4 py-2 text-sm text-center text-indigo-600 dark:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                                            >
                                                Xem tất cả thông báo
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* User menu */}
                            <div className="relative" ref={menuRef}>
                                <button
                                    onClick={() => setMenuOpen(!menuOpen)}
                                    className="flex items-center space-x-2 focus:outline-none"
                                >
                                    <div className="relative flex-shrink-0">
                                        <div className="h-9 w-9 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm border border-indigo-200 dark:border-indigo-800">
                                            {userEmail ? userEmail.charAt(0).toUpperCase() : 'U'}
                                        </div>
                                        <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white dark:ring-gray-800"></span>
                                    </div>
                                    <div className="hidden sm:block text-left">
                                        <p className="text-sm font-medium text-gray-800 dark:text-white">{userEmail || 'Người dùng'}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Online</p>
                                    </div>
                                </button>

                                {/* User dropdown */}
                                {menuOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{userEmail || 'Người dùng'}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Administrator</p>
                                        </div>
                                        <div className="py-2">
                                            <button
                                                onClick={() => navigate('/profile')}
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                                            >
                                                <User size={16} className="mr-3 text-gray-500 dark:text-gray-400" />
                                                Thông tin tài khoản
                                            </button>
                                            <button
                                                onClick={() => navigate('/mainlayout/settings')} // Thay vì '/settings'
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                                            >
                                                <Settings size={16} className="mr-3 text-gray-500 dark:text-gray-400" />
                                                Cài đặt
                                            </button>
                                            <button
                                                onClick={() => window.open('https://docs.example.com', '_blank')}
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                                            >
                                                <HelpCircle size={16} className="mr-3 text-gray-500 dark:text-gray-400" />
                                                Trợ giúp
                                            </button>
                                        </div>
                                        <div className="py-2 border-t border-gray-200 dark:border-gray-700">
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center"
                                            >
                                                <LogOut size={16} className="mr-3" />
                                                Đăng xuất
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main content area */}
                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>

                {/* Footer - Optional */}
                <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 px-6">
                    <div className="flex flex-col sm:flex-row justify-between items-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            © 2025 IoT Dashboard. Phiên bản 1.2.5
                        </p>
                        <div className="flex space-x-4 mt-2 sm:mt-0">
                            <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                                Điều khoản
                            </a>
                            <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                                Chính sách riêng tư
                            </a>
                            <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                                Liên hệ
                            </a>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default MainLayout;
