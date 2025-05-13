import Sidebar from './Sidebar';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { jwtDecode } from "jwt-decode";
import { MoreVertical, User, LogOut } from "lucide-react";

const MainLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();
    const [userEmail, setUserEmail] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();

    // Lấy đoạn cuối của pathname làm tiêu đề
    const getPageTitle = () => {
        const segments = location.pathname.split('/').filter(Boolean);
        const page = segments[segments.length - 1] || 'home';
        return page.charAt(0).toUpperCase() + page.slice(1);
    };

    useEffect(() => {
        const email = localStorage.getItem('user_email');
        if (email) {
            setUserEmail(email);
        }

        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_email');
        navigate('/login');
    };

    return (
        <div className="flex">
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
            <div className={`${collapsed ? 'ml-16' : 'ml-60'} w-full min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white transition-all duration-300`}>

                <div className="flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-800 shadow-sm">
                    <h1 className="text-xl font-semibold">{getPageTitle()}</h1>
                    <div className="relative flex items-center gap-2" ref={menuRef}>
                        <div className="bg-gray-300 text-sm rounded-full w-8 h-8 flex items-center justify-center">
                            {userEmail ? userEmail[0].toUpperCase() : 'U'}
                        </div>
                        <span className="text-sm">{userEmail || 'Guest'}</span>

                        <button onClick={() => setMenuOpen(!menuOpen)} className="p-1 hover:bg-gray-200 rounded-full">
                            <MoreVertical size={18} />
                        </button>

                        {menuOpen && (
                            <div className="absolute right-0 top-10 mt-2 w-40 bg-white border rounded-lg shadow-lg z-50">
                                <button className="flex items-center w-full px-4 py-2 hover:bg-gray-100 text-sm gap-2">
                                    <User size={16} /> Account
                                </button>
                                <button
                                    className="flex items-center w-full px-4 py-2 hover:bg-gray-100 text-sm gap-2"
                                    onClick={handleLogout}
                                >
                                    <LogOut size={16} /> Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Nội dung động sẽ được hiển thị tại đây */}
                <div className="p-6">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default MainLayout;
