import React, { useState, useEffect } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { fetchSensorDataWithBattery } from '../api';

const Alarms = () => {
    const [alarms, setAlarms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [sensorData, setSensorData] = useState(null);
    const [batteryLevel, setBatteryLevel] = useState(100);
    const [newAlarm, setNewAlarm] = useState({
        name: '',
        device: '',
        condition: 'above',
        value: '',
        priority: 'medium',
        enabled: true
    });

    // Fetch dữ liệu cảnh báo từ sensor thực
    useEffect(() => {
        loadSensorData();
        const interval = setInterval(loadSensorData, 10000); // Refresh mỗi 10s
        return () => clearInterval(interval);
    }, []);

    const loadSensorData = async () => {
        try {
            // ✅ GỌI API MỚI: Backend trả cả sensor data + battery
            const response = await fetchSensorDataWithBattery();
            const { data, battery } = response.data;
            
            if (data && data.length > 0) {
                const latest = data[0];
                setSensorData(latest);
                
                // Generate alarms based on real sensor data
                const generatedAlarms = [];
                
                // Temperature alarm
                if (latest.temperature > 30) {
                    generatedAlarms.push({
                        id: 1,
                        name: 'Nhiệt độ cao',
                        device: 'Cảm biến độ ẩm Phan Thiết',
                        condition: 'above',
                        value: 30,
                        currentValue: latest.temperature,
                        unit: '°C',
                        priority: 'high',
                        status: 'triggered',
                        lastTriggered: latest.timestamp,
                        enabled: true
                    });
                }
                
                // Humidity alarm
                if (latest.humidity < 30) {
                    generatedAlarms.push({
                        id: 2,
                        name: 'Độ ẩm thấp',
                        device: 'Cảm biến độ ẩm Phan Thiết',
                        condition: 'below',
                        value: 30,
                        currentValue: latest.humidity,
                        unit: '%',
                        priority: 'medium',
                        status: 'triggered',
                        lastTriggered: latest.timestamp,
                        enabled: true
                    });
                } else if (latest.humidity > 80) {
                    generatedAlarms.push({
                        id: 3,
                        name: 'Độ ẩm cao',
                        device: 'Cảm biến độ ẩm Phan Thiết',
                        condition: 'above',
                        value: 80,
                        currentValue: latest.humidity,
                        unit: '%',
                        priority: 'high',
                        status: 'triggered',
                        lastTriggered: latest.timestamp,
                        enabled: true
                    });
                }
                
                // Light alarm
                if (latest.light_value < 100) {
                    generatedAlarms.push({
                        id: 4,
                        name: 'Ánh sáng yếu',
                        device: 'Cảm biến độ ẩm Phan Thiết',
                        condition: 'below',
                        value: 100,
                        currentValue: latest.light_value,
                        unit: 'lux',
                        priority: 'low',
                        status: 'triggered',
                        lastTriggered: latest.timestamp,
                        enabled: true
                    });
                }
                
                // ✅ Battery alarm - LẤY TỪ BACKEND (đã tính toán sẵn)
                if (battery && battery.level !== undefined) {
                    const currentBattery = battery.level;
                    setBatteryLevel(currentBattery);
                    
                    if (currentBattery < 20) {
                        generatedAlarms.push({
                            id: 5,
                            name: 'Pin yếu',
                            device: 'Cảm biến độ ẩm Phan Thiết',
                            condition: 'below',
                            value: 20,
                            currentValue: currentBattery,
                            unit: '%',
                            priority: 'critical',
                            status: 'triggered',
                            lastTriggered: new Date().toISOString(),
                            enabled: true
                        });
                    }
                }
                
                setAlarms(generatedAlarms);
            }
        } catch (error) {
            console.error('Error loading sensor data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Các hàm xử lý
    const handleTabChange = (tab) => {
        setSelectedTab(tab);
    };

    const handleAlarmToggle = (id) => {
        setAlarms(alarms.map(alarm => 
            alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm
        ));
    };

    const handleDeleteAlarm = (id) => {
        if (window.confirm('Bạn có chắc muốn xóa cảnh báo này?')) {
            setAlarms(alarms.filter(alarm => alarm.id !== id));
        }
    };

    const handleClearTriggered = () => {
        setAlarms(alarms.map(alarm => 
            alarm.status === 'triggered' ? { ...alarm, status: 'normal' } : alarm
        ));
    };

    const handleAddAlarm = () => {
        const id = alarms.length > 0 ? Math.max(...alarms.map(a => a.id)) + 1 : 1;
        
        const alarmToAdd = {
            ...newAlarm,
            id,
            status: 'normal',
            lastTriggered: null,
            unit: getUnitForDevice(newAlarm.device)
        };
        
        setAlarms([...alarms, alarmToAdd]);
        setShowAddModal(false);
        resetNewAlarmForm();
    };

    const resetNewAlarmForm = () => {
        setNewAlarm({
            name: '',
            device: '',
            condition: 'above',
            value: '',
            priority: 'medium',
            enabled: true
        });
    };

    // Helper function để lấy đơn vị tương ứng với thiết bị
    const getUnitForDevice = (device) => {
        if (device.toLowerCase().includes('nhiệt độ')) return '°C';
        if (device.toLowerCase().includes('độ ẩm')) return '%';
        if (device.toLowerCase().includes('ánh sáng')) return 'lux';
        if (device.toLowerCase().includes('điện')) return 'V';
        return '';
    };

    // Filter alarms based on selected tab and search query
    const filteredAlarms = alarms.filter(alarm => {
        const matchesSearch = alarm.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             alarm.device.toLowerCase().includes(searchQuery.toLowerCase());
        
        if (selectedTab === 'all') return matchesSearch;
        if (selectedTab === 'active') return alarm.enabled && matchesSearch;
        if (selectedTab === 'triggered') return alarm.status === 'triggered' && matchesSearch;
        if (selectedTab === 'critical') return alarm.priority === 'critical' && matchesSearch;
        
        return false;
    });

    // Render condition in Vietnamese
    const renderCondition = (condition, value, unit) => {
        switch (condition) {
            case 'above': return `> ${value}${unit}`;
            case 'below': return `< ${value}${unit}`;
            case 'equals': return `= ${value}${unit}`;
            default: return `${value}${unit}`;
        }
    };

    // Render priority badge
    const renderPriorityBadge = (priority) => {
        switch (priority) {
            case 'critical':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Nghiêm trọng</span>;
            case 'high':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">Cao</span>;
            case 'medium':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Trung bình</span>;
            case 'low':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Thấp</span>;
            default:
                return null;
        }
    };

    // Render status badge
    const renderStatusBadge = (status) => {
        switch (status) {
            case 'triggered':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Đang cảnh báo</span>;
            case 'normal':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Bình thường</span>;
            default:
                return null;
        }
    };

    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quản lý cảnh báo</h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                    Quản lý và cấu hình các cảnh báo cho hệ thống
                </p>
            </div>

            {/* Control Panel */}
            <div className="mb-6 flex flex-wrap justify-between items-center gap-4">
                <div className="flex space-x-2">
                    <button
                        onClick={() => handleTabChange('all')}
                        className={`px-4 py-2 rounded-lg font-medium ${
                            selectedTab === 'all'
                            ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                    >
                        Tất cả
                    </button>
                    <button
                        onClick={() => handleTabChange('active')}
                        className={`px-4 py-2 rounded-lg font-medium ${
                            selectedTab === 'active'
                            ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                    >
                        Đang kích hoạt
                    </button>
                    <button
                        onClick={() => handleTabChange('triggered')}
                        className={`px-4 py-2 rounded-lg font-medium ${
                            selectedTab === 'triggered'
                            ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                    >
                        Đang cảnh báo
                    </button>
                    <button
                        onClick={() => handleTabChange('critical')}
                        className={`px-4 py-2 rounded-lg font-medium ${
                            selectedTab === 'critical'
                            ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                    >
                        Nghiêm trọng
                    </button>
                </div>

                <div className="flex space-x-2">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Tìm kiếm cảnh báo..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="px-4 py-2 pl-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-gray-900 dark:text-white"
                        />
                        <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </div>
                    
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition duration-200 flex items-center"
                    >
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                        Thêm cảnh báo
                    </button>
                    
                    {alarms.some(alarm => alarm.status === 'triggered') && (
                        <button
                            onClick={handleClearTriggered}
                            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition duration-200 flex items-center"
                        >
                            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            Xóa cảnh báo
                        </button>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-1 mb-6">
                {isLoading ? (
                    <div className="flex items-center justify-center py-10">
                        <svg className="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                ) : filteredAlarms.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10">
                        <svg className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                        </svg>
                        <p className="text-gray-600 dark:text-gray-400">Không tìm thấy cảnh báo nào</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-900">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Trạng thái
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Tên cảnh báo
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Thiết bị
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Điều kiện
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Ưu tiên
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Lần cuối kích hoạt
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Hành động
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredAlarms.map((alarm) => (
                                    <tr key={alarm.id} className={`${alarm.status === 'triggered' ? 'bg-red-50 dark:bg-red-900/20' : ''}`}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <label className="inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        className="sr-only"
                                                        checked={alarm.enabled}
                                                        onChange={() => handleAlarmToggle(alarm.id)}
                                                    />
                                                    <div className={`relative w-11 h-6 bg-gray-200 rounded-full transition-colors ${alarm.enabled ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'}`}>
                                                        <div className={`absolute left-0.5 top-0.5 bg-white dark:bg-gray-800 w-5 h-5 rounded-full transition-transform transform ${alarm.enabled ? 'translate-x-5' : ''}`}></div>
                                                    </div>
                                                </label>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {alarm.status === 'triggered' && (
                                                    <span className="inline-block w-2 h-2 bg-red-600 rounded-full mr-2 animate-pulse"></span>
                                                )}
                                                <div className="font-medium text-gray-900 dark:text-white">
                                                    {alarm.name}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-700 dark:text-gray-300">{alarm.device}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-700 dark:text-gray-300">
                                                {renderCondition(alarm.condition, alarm.value, alarm.unit)}
                                                {alarm.currentValue !== undefined && (
                                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                        Hiện tại: <span className="font-semibold text-red-600 dark:text-red-400">{alarm.currentValue}{alarm.unit}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {renderPriorityBadge(alarm.priority)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-700 dark:text-gray-300">
                                                {alarm.lastTriggered 
                                                    ? new Date(alarm.lastTriggered).toLocaleString('vi-VN')
                                                    : 'Chưa có'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Menu as="div" className="relative inline-block text-left">
                                                <div>
                                                    <Menu.Button className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                                                        </svg>
                                                    </Menu.Button>
                                                </div>
                                                <Transition
                                                    as={Fragment}
                                                    enter="transition ease-out duration-100"
                                                    enterFrom="transform opacity-0 scale-95"
                                                    enterTo="transform opacity-100 scale-100"
                                                    leave="transition ease-in duration-75"
                                                    leaveFrom="transform opacity-100 scale-100"
                                                    leaveTo="transform opacity-0 scale-95"
                                                >
                                                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 dark:divide-gray-700 focus:outline-none z-10">
                                                        <div className="py-1">
                                                            <Menu.Item>
                                                                {({ active }) => (
                                                                    <button
                                                                        className={`${
                                                                            active ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                                                                        } group flex items-center px-4 py-2 text-sm w-full text-left`}
                                                                        onClick={() => alert(`Chỉnh sửa cảnh báo ${alarm.name}`)}
                                                                    >
                                                                        <svg className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                                                        </svg>
                                                                        Chỉnh sửa
                                                                    </button>
                                                                )}
                                                            </Menu.Item>
                                                            {alarm.status === 'triggered' && (
                                                                <Menu.Item>
                                                                    {({ active }) => (
                                                                        <button
                                                                            className={`${
                                                                                active ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                                                                            } group flex items-center px-4 py-2 text-sm w-full text-left`}
                                                                            onClick={() => {
                                                                                setAlarms(alarms.map(a => 
                                                                                    a.id === alarm.id ? { ...a, status: 'normal' } : a
                                                                                ));
                                                                            }}
                                                                        >
                                                                            <svg className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                                            </svg>
                                                                            Xác nhận
                                                                        </button>
                                                                    )}
                                                                </Menu.Item>
                                                            )}
                                                            <Menu.Item>
                                                                {({ active }) => (
                                                                    <button
                                                                        className={`${
                                                                            active ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300' : 'text-red-600 dark:text-red-400'
                                                                        } group flex items-center px-4 py-2 text-sm w-full text-left`}
                                                                        onClick={() => handleDeleteAlarm(alarm.id)}
                                                                    >
                                                                        <svg className="mr-3 h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                                        </svg>
                                                                        Xóa
                                                                    </button>
                                                                )}
                                                            </Menu.Item>
                                                        </div>
                                                    </Menu.Items>
                                                </Transition>
                                            </Menu>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {/* Total Alarms */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                    <div className="flex items-center">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mr-4">
                            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tổng số cảnh báo</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{alarms.length}</p>
                        </div>
                    </div>
                </div>

                {/* Active Alarms */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                    <div className="flex items-center">
                        <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full mr-4">
                            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Kích hoạt</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {alarms.filter(a => a.enabled).length}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Triggered Alarms */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                    <div className="flex items-center">
                        <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full mr-4">
                            <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Đang cảnh báo</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {alarms.filter(a => a.status === 'triggered').length}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Critical Alarms */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                    <div className="flex items-center">
                        <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full mr-4">
                            <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Nghiêm trọng</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {alarms.filter(a => a.priority === 'critical').length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Alarm Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
                        </div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900 sm:mx-0 sm:h-10 sm:w-10">
                                        <svg className="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                                        </svg>
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                                            Thêm cảnh báo mới
                                        </h3>
                                        <div className="mt-4 space-y-4">
                                            <div>
                                                <label htmlFor="alarm-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Tên cảnh báo
                                                </label>
                                                <input
                                                    type="text"
                                                    id="alarm-name"
                                                    value={newAlarm.name}
                                                    onChange={(e) => setNewAlarm({...newAlarm, name: e.target.value})}
                                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                    placeholder="Nhập tên cảnh báo"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="device-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Thiết bị
                                                </label>
                                                <select
                                                    id="device-name"
                                                    value={newAlarm.device}
                                                    onChange={(e) => setNewAlarm({...newAlarm, device: e.target.value})}
                                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                >
                                                    <option value="">Chọn thiết bị</option>
                                                    <option value="Cảm biến nhiệt độ A1">Cảm biến nhiệt độ A1</option>
                                                    <option value="Cảm biến độ ẩm B2">Cảm biến độ ẩm B2</option>
                                                    <option value="Cảm biến ánh sáng C3">Cảm biến ánh sáng C3</option>
                                                    <option value="Sensor điện D4">Sensor điện D4</option>
                                                    <option value="Gateway E5">Gateway E5</option>
                                                </select>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="condition" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Điều kiện
                                                    </label>
                                                    <select
                                                        id="condition"
                                                        value={newAlarm.condition}
                                                        onChange={(e) => setNewAlarm({...newAlarm, condition: e.target.value})}
                                                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                    >
                                                        <option value="above">Lớn hơn</option>
                                                        <option value="below">Nhỏ hơn</option>
                                                        <option value="equals">Bằng</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label htmlFor="threshold-value" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Ngưỡng
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="threshold-value"
                                                        value={newAlarm.value}
                                                        onChange={(e) => setNewAlarm({...newAlarm, value: e.target.value})}
                                                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                        placeholder="Giá trị"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Ưu tiên
                                                </label>
                                                <select
                                                    id="priority"
                                                    value={newAlarm.priority}
                                                    onChange={(e) => setNewAlarm({...newAlarm, priority: e.target.value})}
                                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                >
                                                    <option value="low">Thấp</option>
                                                    <option value="medium">Trung bình</option>
                                                    <option value="high">Cao</option>
                                                    <option value="critical">Nghiêm trọng</option>
                                                </select>
                                            </div>
                                            <div className="flex items-center">
                                                <input
                                                    id="enabled"
                                                    type="checkbox"
                                                    checked={newAlarm.enabled}
                                                    onChange={(e) => setNewAlarm({...newAlarm, enabled: e.target.checked})}
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                />
                                                <label htmlFor="enabled" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                                    Kích hoạt ngay
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={handleAddAlarm}
                                >
                                    Thêm
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={() => {
                                        setShowAddModal(false);
                                        resetNewAlarmForm();
                                    }}
                                >
                                    Hủy
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Alarms;