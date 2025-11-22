import { NavLink } from 'react-router-dom';
import { Home, Bell, LayoutDashboard, Settings, Menu, Map, Bug } from 'lucide-react';
import { useState } from 'react';

const Sidebar = ({ collapsed, setCollapsed }) => {
    return (
        <div className={`h-screen bg-gray-800 text-white fixed flex flex-col transition-all duration-300 ease-in-out ${collapsed ? 'w-16' : 'w-64'}`}>
            <div className="flex items-center justify-between p-4">
                {!collapsed && <div className="text-2xl font-bold">L.O</div>}
                <button
                    className="text-white focus:outline-none transform transition duration-300"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    <Menu size={24} className={`transition-transform duration-300 ${collapsed ? 'rotate-90' : ''}`} />
                </button>
            </div>
            <nav className="flex flex-col gap-2 px-2">
                <NavLink to="/mainlayout/home" className={({ isActive }) => isActive ? 'bg-gray-700 rounded px-4 py-2 flex items-center gap-2' : 'px-4 py-2 flex items-center gap-2 hover:bg-blue-700 rounded'}>
                    <Home size={18} /> {!collapsed && 'Home'}
                </NavLink>
                <NavLink to="/mainlayout/Dashboard" className={({ isActive }) => isActive ? 'bg-gray-700 rounded px-4 py-2 flex items-center gap-2' : 'px-4 py-2 flex items-center gap-2 hover:bg-blue-700 rounded'}>
                    <LayoutDashboard size={18} /> {!collapsed && 'Dashboard'}
                </NavLink>
                <NavLink to="/mainlayout/map" className={({ isActive }) => isActive ? 'bg-gray-700 rounded px-4 py-2 flex items-center gap-2' : 'px-4 py-2 flex items-center gap-2 hover:bg-blue-700 rounded'}>
                    <Map size={18} /> {!collapsed && 'Bản đồ'}
                </NavLink>
                <NavLink to="/mainlayout/alarms" className={({ isActive }) => isActive ? 'bg-gray-700 rounded px-4 py-2 flex items-center gap-2' : 'px-4 py-2 flex items-center gap-2 hover:bg-blue-700 rounded'}>
                    <Bell size={18} /> {!collapsed && 'Alarms'}
                </NavLink>
                <NavLink to="/mainlayout/settings" className={({ isActive }) => isActive ? 'bg-gray-700 rounded px-4 py-2 flex items-center gap-2' : 'px-4 py-2 flex items-center gap-2 hover:bg-blue-700 rounded'}>
                    <Settings size={18} /> {!collapsed && 'Settings'}
                </NavLink>
                <NavLink to="/mainlayout/debug" className={({ isActive }) => isActive ? 'bg-purple-700 rounded px-4 py-2 flex items-center gap-2' : 'px-4 py-2 flex items-center gap-2 hover:bg-purple-700 rounded'}>
                    <Bug size={18} /> {!collapsed && 'Debug'}
                </NavLink>
            </nav>
        </div>
    );
};

export default Sidebar;
