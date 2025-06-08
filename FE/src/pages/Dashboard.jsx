// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, Area
} from 'recharts';
import { fetchSensorData } from '../api';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';

const Dashboard = () => {
    const [lightData, setLightData] = useState([]);
    const [tempData, setTempData] = useState([]);
    const [humidityData, setHumidityData] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const loadSensorData = async () => {
        setIsLoading(true);
        try {
            const response = await fetchSensorData();
            const data = response.data;

            // Lọc theo khoảng ngày nếu được chọn
            const filtered = data.filter(d => {
                const ts = new Date(d.timestamp);
                const startOK = startDate ? new Date(startDate) <= ts : true;
                const endOK = endDate ? ts <= new Date(endDate) : true;
                return startOK && endOK;
            });

            const light = filtered.map(d => ({
                timestamp: d.timestamp,
                value: d.light_value
            })).filter(d => d.value !== null).reverse();

            const temperature = filtered.map(d => ({
                timestamp: d.timestamp,
                value: d.temperature
            })).filter(d => d.value !== null).reverse();

            const humidity = filtered.map(d => ({
                timestamp: d.timestamp,
                value: d.humidity
            })).filter(d => d.value !== null).reverse();

            setLightData(light);
            setTempData(temperature);
            setHumidityData(humidity);
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu cảm biến:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadSensorData();
    }, [startDate, endDate]);

    const exportToCSV = () => {
        if (!lightData.length && !tempData.length && !humidityData.length) {
            alert("Không có dữ liệu để xuất!");
            return;
        }

        const merged = [];
        const maxLength = Math.max(lightData.length, tempData.length, humidityData.length);

        for (let i = 0; i < maxLength; i++) {
            const rawTimestamp = lightData[i]?.timestamp || tempData[i]?.timestamp || humidityData[i]?.timestamp || '';
            const formattedTimestamp = rawTimestamp
                ? new Date(rawTimestamp).toLocaleString()
                : '';

            merged.push({
                timestamp: formattedTimestamp,
                light_value: lightData[i]?.value ?? '',
                temperature: tempData[i]?.value ?? '',
                humidity: humidityData[i]?.value ?? '',
            });
        }

        const csv = Papa.unparse(merged);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, `sensor_data_${new Date().toISOString().split('T')[0]}.csv`);
    };

    const getLatestValue = (data) => {
        return data.length > 0 ? data[0].value : 'N/A';
    };

    const renderChart = (title, data, unit, color, icon) => {
        // Tạo gradient cho phần fill của biểu đồ
        const gradientId = `colorGradient${title.replace(/\s+/g, '')}`;
        
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100 dark:border-gray-700">
                <div className="p-5 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-full bg-opacity-15`} style={{ backgroundColor: `${color}25` }}>
                                {icon}
                            </div>
                            <div>
                                <h2 className="font-semibold text-lg text-gray-800 dark:text-white">{title}</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-300">
                                    {data.length > 0 
                                        ? `${data.length} điểm dữ liệu - Cập nhật ${new Date(data[0]?.timestamp).toLocaleTimeString()}`
                                        : 'Không có dữ liệu'
                                    }
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold" style={{color}}>
                                {getLatestValue(data)}
                                <span className="text-lg ml-1">{unit}</span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Giá trị mới nhất</p>
                        </div>
                    </div>
                </div>
                <div className="p-4 relative">
                    {data.length > 0 ? (
                        <ResponsiveContainer width="100%" height={280}>
                            <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                                <defs>
                                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor={color} stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid
                                    strokeDasharray="3 3" 
                                    stroke="rgba(160, 160, 160, 0.15)" 
                                    vertical={false}
                                />
                                <XAxis
                                    dataKey="timestamp"
                                    tickFormatter={(t) => new Date(t).toLocaleTimeString().substring(0, 5)}
                                    minTickGap={30}
                                    stroke="#888"
                                    fontSize={12}
                                    axisLine={false}
                                    tickLine={false}
                                    dy={10}
                                    padding={{ left: 10, right: 10 }}
                                />
                                <YAxis 
                                    stroke="#888" 
                                    fontSize={12} 
                                    axisLine={false}
                                    tickLine={false}
                                    dx={-10}
                                    tickFormatter={(value) => `${value}${unit}`} 
                                />
                                <Tooltip
                                    labelFormatter={(t) => `${new Date(t).toLocaleDateString()} ${new Date(t).toLocaleTimeString()}`}
                                    formatter={(value) => [`${value} ${unit}`, title]}
                                    contentStyle={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                        border: 'none',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                        padding: '10px 14px'
                                    }}
                                    itemStyle={{ color: color }}
                                    labelStyle={{ fontWeight: 'bold', marginBottom: '6px' }}
                                    cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: '4 4' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke={color}
                                    strokeWidth={2.5}
                                    fillOpacity={1}
                                    fill={`url(#${gradientId})`}
                                    activeDot={{ 
                                        r: 6, 
                                        stroke: color, 
                                        strokeWidth: 2, 
                                        fill: 'white' 
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke={color}
                                    strokeWidth={2.5}
                                    dot={false}
                                    activeDot={{ 
                                        r: 6, 
                                        stroke: color, 
                                        strokeWidth: 2, 
                                        fill: 'white' 
                                    }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-[280px] flex items-center justify-center flex-col">
                            <svg className="w-12 h-12 mb-3 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            <p className="text-gray-500 dark:text-gray-400">Không có dữ liệu hiển thị</p>
                        </div>
                    )}
                    
                    {/* Chi tiết phân tích */}
                    {data.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 grid grid-cols-3 gap-3 text-center">
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500 dark:text-gray-400">Trung bình</span>
                                <span className="font-semibold text-gray-700 dark:text-gray-200">
                                    {(data.reduce((sum, item) => sum + parseFloat(item.value), 0) / data.length).toFixed(1)} {unit}
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500 dark:text-gray-400">Cao nhất</span>
                                <span className="font-semibold text-gray-700 dark:text-gray-200">
                                    {Math.max(...data.map(item => item.value))} {unit}
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500 dark:text-gray-400">Thấp nhất</span>
                                <span className="font-semibold text-gray-700 dark:text-gray-200">
                                    {Math.min(...data.map(item => item.value))} {unit}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Icons
    const lightIcon = (
        <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
        </svg>
    );

    const tempIcon = (
        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
        </svg>
    );

    const humidityIcon = (
        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
        </svg>
    );

    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Thống kê cảm biến</h1>
                <p className="text-gray-600 dark:text-gray-300">
                    Dữ liệu từ hệ thống cảm biến IoT
                </p>
            </div>

            {/* Filter Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                    </svg>
                    Lọc dữ liệu
                </h2>

                <div className="flex flex-wrap items-end gap-5">
                    <div className="flex-grow max-w-xs">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Từ ngày</label>
                        <input 
                            type="date" 
                            value={startDate} 
                            onChange={(e) => setStartDate(e.target.value)} 
                            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-gray-900 dark:text-white"
                        />
                    </div>
                    
                    <div className="flex-grow max-w-xs">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Đến ngày</label>
                        <input 
                            type="date" 
                            value={endDate} 
                            onChange={(e) => setEndDate(e.target.value)} 
                            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-gray-900 dark:text-white" 
                        />
                    </div>
                    
                    <div className="flex space-x-3">
                        <button
                            onClick={loadSensorData}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition duration-200 flex items-center"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Đang tải...
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                    </svg>
                                    Làm mới
                                </>
                            )}
                        </button>
                        
                        <button
                            onClick={exportToCSV}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition duration-200 flex items-center"
                            disabled={isLoading || (!lightData.length && !tempData.length && !humidityData.length)}
                        >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                            </svg>
                            Tải CSV
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Metrics Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* Light Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30 mr-4">
                            {lightIcon}
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Ánh sáng</h3>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {getLatestValue(lightData)} <span className="text-lg">lux</span>
                            </p>
                        </div>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                        parseFloat(getLatestValue(lightData)) > 1000 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                    }`}>
                        {parseFloat(getLatestValue(lightData)) > 1000 ? 'Cao' : 'Trung bình'}
                    </span>
                </div>

                {/* Temperature Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30 mr-4">
                            {tempIcon}
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Nhiệt độ</h3>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {getLatestValue(tempData)} <span className="text-lg">°C</span>
                            </p>
                        </div>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                        parseFloat(getLatestValue(tempData)) > 30 
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' 
                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                    }`}>
                        {parseFloat(getLatestValue(tempData)) > 30 ? 'Nóng' : 'Mát mẻ'}
                    </span>
                </div>

                {/* Humidity Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 mr-4">
                            {humidityIcon}
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Độ ẩm</h3>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {getLatestValue(humidityData)} <span className="text-lg">%</span>
                            </p>
                        </div>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                        parseFloat(getLatestValue(humidityData)) > 70 
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' 
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                    }`}>
                        {parseFloat(getLatestValue(humidityData)) > 70 ? 'Ẩm ướt' : 'Khô ráo'}
                    </span>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {renderChart("Ánh sáng", lightData, "lux", "#facc15", lightIcon)}
                {renderChart("Nhiệt độ", tempData, "°C", "#ef4444", tempIcon)}
            </div>
            <div className="mt-6">
                {renderChart("Độ ẩm", humidityData, "%", "#3b82f6", humidityIcon)}
            </div>
        </div>
    );
};

export default Dashboard;
