import { NavLink } from 'react-router-dom';
import { Home, Bell, LayoutDashboard, Settings } from 'lucide-react';
import { useState } from 'react';

const Sidebar = ({ collapsed, setCollapsed }) => {

    return (
        <div className={`h-screen bg-gray-500 text-white fixed flex flex-col transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
            <div className="flex items-center justify-between p-4">
                {!collapsed && <div className="text-2xl font-bold">L.O</div>}
                <button
                    className="text-white focus:outline-none"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    {collapsed ? '»' : '«'}
                </button>
            </div>
            <nav className="flex flex-col gap-2 px-2">
                <NavLink to="/mainlayout/home" className={({ isActive }) => isActive ? 'bg-gray-700 rounded px-4 py-2 flex items-center gap-2' : 'px-4 py-2 flex items-center gap-2 hover:bg-blue-700 rounded'}>
                    <Home size={18} /> {!collapsed && 'Home'}
                </NavLink>
                <NavLink to="/mainlayout/Dashboard" className={({ isActive }) => isActive ? 'bg-gray-700 rounded px-4 py-2 flex items-center gap-2' : 'px-4 py-2 flex items-center gap-2 hover:bg-blue-700 rounded'}>
                    <LayoutDashboard size={18} /> {!collapsed && 'Dashboard'}
                </NavLink>
                <NavLink to="/mainlayout/alarms" className={({ isActive }) => isActive ? 'bg-gray-700 rounded px-4 py-2 flex items-center gap-2' : 'px-4 py-2 flex items-center gap-2 hover:bg-blue-700 rounded'}>
                    <Bell size={18} /> {!collapsed && 'Alarms'}
                </NavLink>

                <NavLink to="/mainlayout/settings" className={({ isActive }) => isActive ? 'bg-gray-700 rounded px-4 py-2 flex items-center gap-2' : 'px-4 py-2 flex items-center gap-2 hover:bg-blue-700 rounded'}>
                    <Settings size={18} /> {!collapsed && 'Settings'}
                </NavLink>
            </nav>
        </div>
    );
};

export default Sidebar;
