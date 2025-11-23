// src/pages/DebugData.jsx
import { useEffect, useState } from 'react';
import { fetchSensorData } from '../api';
import { BatteryService } from '../services/batteryService';

const DebugData = () => {
    const [rawData, setRawData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [autoRefresh, setAutoRefresh] = useState(false);
    const [filter, setFilter] = useState('all'); // all, light, temperature, humidity
    const [limit, setLimit] = useState(50);
    const [searchTerm, setSearchTerm] = useState('');
    const [batteryLevel, setBatteryLevel] = useState(100);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const response = await fetchSensorData();
            setRawData(response.data);
            
            // Fetch battery level từ Firebase
            const batteryData = await BatteryService.getBattery('hcm-device-01');
            if (batteryData && batteryData.level !== undefined) {
                const calculatedBattery = BatteryService.calculateBatteryLevel(
                    batteryData.timestamp, 
                    batteryData.level
                );
                setBatteryLevel(calculatedBattery);
            }
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // Auto refresh every 5 seconds
    useEffect(() => {
        if (autoRefresh) {
            const interval = setInterval(loadData, 5000);
            return () => clearInterval(interval);
        }
    }, [autoRefresh]);

    // Filter data
    const filteredData = rawData
        .filter(item => {
            if (filter === 'all') return true;
            if (filter === 'light') return item.light_value !== null;
            if (filter === 'temperature') return item.temperature !== null;
            if (filter === 'humidity') return item.humidity !== null;
            return true;
        })
        .filter(item => {
            if (!searchTerm) return true;
            const searchLower = searchTerm.toLowerCase();
            return (
                item.id.toString().includes(searchLower) ||
                item.timestamp.toLowerCase().includes(searchLower) ||
                (item.light_value && item.light_value.toString().includes(searchLower)) ||
                (item.temperature && item.temperature.toString().includes(searchLower)) ||
                (item.humidity && item.humidity.toString().includes(searchLower))
            );
        })
        .slice(0, limit);

    const getStatusBadge = (value, type) => {
        if (value === null || value === undefined) {
            return <span className="px-2 py-1 text-xs rounded-full bg-gray-600/50 text-gray-300">N/A</span>;
        }

        if (type === 'light') {
            if (value > 1000) return <span className="px-2 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">Sáng</span>;
            return <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">Tối</span>;
        }

        if (type === 'temperature') {
            if (value > 30) return <span className="px-2 py-1 text-xs rounded-full bg-red-500/20 text-red-300 border border-red-500/30">Nóng</span>;
            if (value > 20) return <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-300 border border-green-500/30">Ấm</span>;
            return <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">Lạnh</span>;
        }

        if (type === 'humidity') {
            if (value > 70) return <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">Ẩm</span>;
            return <span className="px-2 py-1 text-xs rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">Khô</span>;
        }

        return null;
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return {
            date: date.toLocaleDateString('vi-VN'),
            time: date.toLocaleTimeString('vi-VN'),
            relative: getRelativeTime(date)
        };
    };

    const getRelativeTime = (date) => {
        const now = new Date();
        const diff = Math.floor((now - date) / 1000); // seconds

        if (diff < 60) return `${diff} giây trước`;
        if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
        return `${Math.floor(diff / 86400)} ngày trước`;
    };

    const exportJSON = () => {
        const dataStr = JSON.stringify(filteredData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `sensor_debug_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    };

    return (
        <div className="p-6 bg-gradient-to-br from-gray-800 to-gray-900 min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-600/20 border border-purple-500/30 rounded-xl">
                            <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Debug Console</h1>
                            <p className="text-gray-300">Xem dữ liệu thô từ cảm biến IoT</p>
                        </div>
                    </div>
                    
                    {/* Stats */}
                    <div className="flex gap-4">
                        <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl px-4 py-2">
                            <div className="text-sm text-gray-400">Tổng dữ liệu</div>
                            <div className="text-2xl font-bold text-white">{rawData.length}</div>
                        </div>
                        <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl px-4 py-2">
                            <div className="text-sm text-gray-400">Đang hiển thị</div>
                            <div className="text-2xl font-bold text-purple-400">{filteredData.length}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    {/* Search */}
                    <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Tìm kiếm</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="ID, timestamp, giá trị..."
                                className="w-full px-4 py-2 bg-gray-700/60 border border-gray-600/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                            />
                            <svg className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </div>
                    </div>

                    {/* Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Lọc theo loại</label>
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-700/60 border border-gray-600/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                        >
                            <option value="all">Tất cả</option>
                            <option value="light">Ánh sáng</option>
                            <option value="temperature">Nhiệt độ</option>
                            <option value="humidity">Độ ẩm</option>
                        </select>
                    </div>

                    {/* Limit */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Số lượng</label>
                        <select
                            value={limit}
                            onChange={(e) => setLimit(Number(e.target.value))}
                            className="w-full px-4 py-2 bg-gray-700/60 border border-gray-600/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                        >
                            <option value={20}>20 dòng</option>
                            <option value={50}>50 dòng</option>
                            <option value={100}>100 dòng</option>
                            <option value={200}>200 dòng</option>
                            <option value={500}>500 dòng</option>
                        </select>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={loadData}
                        disabled={isLoading}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        <svg className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                        </svg>
                        Làm mới
                    </button>

                    <button
                        onClick={() => setAutoRefresh(!autoRefresh)}
                        className={`px-4 py-2 font-medium rounded-xl transition-all flex items-center gap-2 ${
                            autoRefresh 
                                ? 'bg-green-600 hover:bg-green-700 text-white' 
                                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        }`}
                    >
                        <div className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-white animate-pulse' : 'bg-gray-500'}`}></div>
                        Auto {autoRefresh ? 'ON' : 'OFF'}
                    </button>

                    <button
                        onClick={exportJSON}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        Export JSON
                    </button>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-900/50 border-b border-gray-700/50">
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Timestamp</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Ánh sáng</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Nhiệt độ</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Độ ẩm</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Pin</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700/30">
                            {filteredData.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <svg className="w-16 h-16 text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                                            </svg>
                                            <p className="text-gray-400 text-lg font-medium">Không có dữ liệu</p>
                                            <p className="text-gray-500 text-sm mt-1">Thử làm mới hoặc điều chỉnh bộ lọc</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredData.map((item) => {
                                    const time = formatTimestamp(item.timestamp);
                                    return (
                                        <tr key={item.id} className="hover:bg-gray-700/30 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 py-1 text-xs font-mono bg-purple-600/20 text-purple-300 rounded border border-purple-500/30">
                                                    #{item.id}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <span className="text-sm text-white font-medium">{time.time}</span>
                                                    <span className="text-xs text-gray-400">{time.date}</span>
                                                    <span className="text-xs text-gray-500">{time.relative}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {item.light_value !== null ? (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-yellow-400 font-bold">{item.light_value}</span>
                                                        <span className="text-gray-500 text-sm">lux</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-500">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {item.temperature !== null ? (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-red-400 font-bold">{item.temperature}</span>
                                                        <span className="text-gray-500 text-sm">°C</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-500">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {item.humidity !== null ? (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-blue-400 font-bold">{item.humidity}</span>
                                                        <span className="text-gray-500 text-sm">%</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-500">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-20 bg-gray-700 h-2 rounded-full overflow-hidden">
                                                        <div 
                                                            className={`h-full transition-all ${
                                                                batteryLevel > 50 ? 'bg-green-500' : 
                                                                batteryLevel > 20 ? 'bg-yellow-500' : 
                                                                'bg-red-500'
                                                            }`}
                                                            style={{ width: `${batteryLevel}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className={`font-bold ${
                                                        batteryLevel > 50 ? 'text-green-400' : 
                                                        batteryLevel > 20 ? 'text-yellow-400' : 
                                                        'text-red-400'
                                                    }`}>
                                                        {batteryLevel}%
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex gap-1">
                                                    {getStatusBadge(item.light_value, 'light')}
                                                    {getStatusBadge(item.temperature, 'temperature')}
                                                    {getStatusBadge(item.humidity, 'humidity')}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Footer Info */}
            {filteredData.length > 0 && (
                <div className="mt-4 text-center text-sm text-gray-400">
                    Hiển thị {filteredData.length} / {rawData.length} dòng dữ liệu
                    {autoRefresh && <span className="ml-2">• Auto refresh mỗi 5 giây</span>}
                </div>
            )}
        </div>
    );
};

export default DebugData;

