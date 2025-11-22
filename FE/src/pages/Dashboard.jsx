// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, AreaChart, Area,
    BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import { fetchSensorData } from '../api';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';

const Dashboard = () => {
    const [lightData, setLightData] = useState([]);
    const [tempData, setTempData] = useState([]);
    const [humidityData, setHumidityData] = useState([]);
    const [combinedData, setCombinedData] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [hoveredChart, setHoveredChart] = useState(null);
    const [activeQuickFilter, setActiveQuickFilter] = useState(''); // New state for quick filters

    // Quick filter functions
    const setQuickFilter = (days, label) => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - days);
        
        setEndDate(end.toISOString().split('T')[0]);
        setStartDate(start.toISOString().split('T')[0]);
        setActiveQuickFilter(label);
    };

    const clearFilters = () => {
        setStartDate('');
        setEndDate('');
        setActiveQuickFilter('');
    };

    // Quick filter options
    const quickFilters = [
        { days: 1, label: '1 ngày', icon: '📅' },
        { days: 7, label: '7 ngày', icon: '📊' },
        { days: 15, label: '15 ngày', icon: '📈' },
        { days: 30, label: '30 ngày', icon: '📆' },
        { days: 60, label: '2 tháng', icon: '🗓️' },
    ];

    const loadSensorData = async () => {
        setIsLoading(true);
        try {
            const response = await fetchSensorData();
            const data = response.data;

            // Lọc theo khoảng ngày nếu được chọn
            const filtered = data.filter(d => {
                const ts = new Date(d.timestamp);
                
                // Set start of day (00:00:00) for startDate
                const start = startDate ? new Date(startDate) : null;
                if (start) start.setHours(0, 0, 0, 0);
                
                // Set end of day (23:59:59) for endDate
                const end = endDate ? new Date(endDate) : null;
                if (end) end.setHours(23, 59, 59, 999);
                
                const startOK = start ? start <= ts : true;
                const endOK = end ? ts <= end : true;
                return startOK && endOK;
            });

            const light = filtered.map(d => ({
                timestamp: d.timestamp,
                value: d.light_value,
                time: new Date(d.timestamp).getTime()
            })).filter(d => d.value !== null).reverse();

            const temperature = filtered.map(d => ({
                timestamp: d.timestamp,
                value: d.temperature,
                time: new Date(d.timestamp).getTime()
            })).filter(d => d.value !== null).reverse();

            const humidity = filtered.map(d => ({
                timestamp: d.timestamp,
                value: d.humidity,
                time: new Date(d.timestamp).getTime()
            })).filter(d => d.value !== null).reverse();

            // Tạo combined data cho multi-line chart
            const combined = filtered.map(d => ({
                timestamp: d.timestamp,
                time: new Date(d.timestamp).getTime(),
                light: d.light_value,
                temperature: d.temperature,
                humidity: d.humidity
            })).filter(d => d.light !== null || d.temperature !== null || d.humidity !== null).reverse();

            setLightData(light);
            setTempData(temperature);
            setHumidityData(humidity);
            setCombinedData(combined);
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

    const getStatistics = (data) => {
        if (!data.length) return { min: 0, max: 0, avg: 0, trend: 'stable' };
        
        const values = data.map(d => parseFloat(d.value));
        const min = Math.min(...values);
        const max = Math.max(...values);
        const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
        
        // Tính xu hướng
        const recent = values.slice(0, Math.min(10, values.length));
        const older = values.slice(-Math.min(10, values.length));
        const recentAvg = recent.reduce((sum, val) => sum + val, 0) / recent.length;
        const olderAvg = older.reduce((sum, val) => sum + val, 0) / older.length;
        
        let trend = 'stable';
        if (recentAvg > olderAvg * 1.05) trend = 'up';
        else if (recentAvg < olderAvg * 0.95) trend = 'down';

        return { min, max, avg, trend };
    };

    // Custom Tooltip Component
    const CustomTooltip = ({ active, payload, label, title, unit }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-gray-800/90 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-gray-600/50">
                    <p className="font-semibold text-white mb-2">
                        {new Date(label).toLocaleDateString('vi-VN')} - {new Date(label).toLocaleTimeString('vi-VN')}
                    </p>
                    {payload.map((entry, index) => (
                        <div key={index} className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <div 
                                    className="w-3 h-3 rounded-full" 
                                    style={{ backgroundColor: entry.color }}
                                />
                                <span className="text-sm text-gray-300">
                                    {entry.name || title}
                                </span>
                            </div>
                            <span className="font-bold" style={{ color: entry.color }}>
                                {entry.value} {unit}
                            </span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    const getTrendIcon = (trend) => {
        switch(trend) {
            case 'up':
                return (
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 17l9.2-9.2M17 17V7m0 10H7"></path>
                    </svg>
                );
            case 'down':
                return (
                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 7l-9.2 9.2M7 7v10m0-10h10"></path>
                    </svg>
                );
            default:
                return (
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14"></path>
                    </svg>
                );
        }
    };

    const renderEnhancedChart = (title, data, unit, color, icon, chartType = 'area', theme = 'default') => {
        const stats = getStatistics(data);
        const gradientId = `gradient-${title.replace(/\s+/g, '')}`;
        const isHovered = hoveredChart === title;

        // Theme-based background colors
        const getThemeBackground = (theme) => {
            switch(theme) {
                case 'yellow':
                    return 'bg-gradient-to-br from-yellow-900/20 to-orange-900/10 border border-yellow-600/20 backdrop-blur-sm';
                case 'red':
                    return 'bg-gradient-to-br from-red-900/20 to-pink-900/10 border border-red-600/20 backdrop-blur-sm';
                case 'blue':
                    return 'bg-gradient-to-br from-blue-900/20 to-cyan-900/10 border border-blue-600/20 backdrop-blur-sm';
                default:
                    return 'bg-gray-800/60 border border-gray-700/50 backdrop-blur-sm';
            }
        };

        const getHeaderBackground = (theme) => {
            switch(theme) {
                case 'yellow':
                    return 'bg-gradient-to-r from-yellow-900/30 to-orange-900/20 border-b border-yellow-600/20';
                case 'red':
                    return 'bg-gradient-to-r from-red-900/30 to-pink-900/20 border-b border-red-600/20';
                case 'blue':
                    return 'bg-gradient-to-r from-blue-900/30 to-cyan-900/20 border-b border-blue-600/20';
                default:
                    return 'bg-gradient-to-r from-gray-800/50 to-gray-700/30 border-b border-gray-600/30';
            }
        };

        return (
            <div 
                className={`${getThemeBackground(theme)} rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden transform ${
                    isHovered ? 'scale-[1.02] shadow-3xl' : 'hover:scale-[1.01]'
                }`}
                onMouseEnter={() => setHoveredChart(title)}
                onMouseLeave={() => setHoveredChart(null)}
            >
                {/* Header */}
                <div className={`p-6 ${getHeaderBackground(theme)}`}>
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                            <div 
                                className={`p-3 rounded-xl transition-all duration-300 border ${
                                    isHovered ? 'scale-110 shadow-lg' : ''
                                }`} 
                                style={{ 
                                    backgroundColor: `${color}20`,
                                    borderColor: `${color}30`
                                }}
                            >
                                <div style={{ color }}>{icon}</div>
                            </div>
                            <div>
                                <h2 className="font-bold text-xl text-white flex items-center gap-2">
                                    {title}
                                    {getTrendIcon(stats.trend)}
                                </h2>
                                <p className="text-sm text-gray-300 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                    {data.length > 0 
                                        ? `${data.length} điểm dữ liệu - Cập nhật ${new Date(data[0]?.timestamp).toLocaleTimeString()}`
                                        : 'Không có dữ liệu'
                                    }
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className={`text-4xl font-bold transition-all duration-300 ${isHovered ? 'scale-110' : ''}`} style={{color}}>
                                {getLatestValue(data)}
                                <span className="text-xl ml-1">{unit}</span>
                            </div>
                            <p className="text-xs text-gray-400">Giá trị hiện tại</p>
                        </div>
                    </div>

                    {/* Statistics Row */}
                    <div className="mt-4 grid grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-gray-800/40 border border-gray-600/30 rounded-lg backdrop-blur-sm">
                            <div className="text-sm text-gray-400">Trung bình</div>
                            <div className="text-lg font-bold text-white">
                                {stats.avg.toFixed(1)} {unit}
                            </div>
                        </div>
                        <div className="text-center p-3 bg-gray-800/40 border border-gray-600/30 rounded-lg backdrop-blur-sm">
                            <div className="text-sm text-gray-400">Cao nhất</div>
                            <div className="text-lg font-bold text-green-400">
                                {stats.max} {unit}
                            </div>
                        </div>
                        <div className="text-center p-3 bg-gray-800/40 border border-gray-600/30 rounded-lg backdrop-blur-sm">
                            <div className="text-sm text-gray-400">Thấp nhất</div>
                            <div className="text-lg font-bold text-red-400">
                                {stats.min} {unit}
                            </div>
                        </div>
                        <div className="text-center p-3 bg-gray-800/40 border border-gray-600/30 rounded-lg backdrop-blur-sm">
                            <div className="text-sm text-gray-400">Xu hướng</div>
                            <div className="flex items-center justify-center gap-1">
                                {getTrendIcon(stats.trend)}
                                <span className="text-sm font-medium text-gray-300 capitalize">
                                    {stats.trend === 'up' ? 'Tăng' : stats.trend === 'down' ? 'Giảm' : 'Ổn định'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chart */}
                <div className="p-6">
                    {data.length > 0 ? (
                        <ResponsiveContainer width="100%" height={320}>
                            <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                                <defs>
                                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={color} stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor={color} stopOpacity={0.05}/>
                                    </linearGradient>
                                    <filter id={`glow-${title}`}>
                                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                                        <feMerge> 
                                            <feMergeNode in="coloredBlur"/>
                                            <feMergeNode in="SourceGraphic"/>
                                        </feMerge>
                                    </filter>
                                </defs>
                                <CartesianGrid
                                    strokeDasharray="3 3" 
                                    stroke="rgba(156, 163, 175, 0.2)" 
                                    vertical={false}
                                />
                                <XAxis
                                    dataKey="timestamp"
                                    tickFormatter={(t) => new Date(t).toLocaleTimeString().substring(0, 5)}
                                    stroke="#9CA3AF"
                                    fontSize={12}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ dy: 5 }}
                                />
                                <YAxis 
                                    stroke="#9CA3AF" 
                                    fontSize={12} 
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ dx: -5 }}
                                    tickFormatter={(value) => `${value}${unit}`}
                                    domain={['dataMin - 5', 'dataMax + 5']}
                                />
                                <Tooltip
                                    content={(props) => <CustomTooltip {...props} title={title} unit={unit} />}
                                    cursor={{ 
                                        stroke: color, 
                                        strokeWidth: 2, 
                                        strokeDasharray: '5 5',
                                        opacity: 0.7
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke={color}
                                    strokeWidth={3}
                                    fill={`url(#${gradientId})`}
                                    fillOpacity={1}
                                    activeDot={{ 
                                        r: 8, 
                                        stroke: color, 
                                        strokeWidth: 3, 
                                        fill: 'white',
                                        filter: `url(#glow-${title})`,
                                        style: { 
                                            animation: isHovered ? 'pulse 1.5s infinite' : 'none'
                                        }
                                    }}
                                    dot={{ 
                                        r: 3, 
                                        fill: color, 
                                        stroke: 'white', 
                                        strokeWidth: 2,
                                        opacity: isHovered ? 1 : 0
                                    }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-[320px] flex items-center justify-center flex-col">
                            <div className="animate-pulse">
                                <svg className="w-16 h-16 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 19V6l12-1v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-1c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-1"></path>
                                </svg>
                            </div>
                            <p className="text-gray-400 text-lg">Không có dữ liệu hiển thị</p>
                            <p className="text-gray-500 text-sm mt-1">Vui lòng chọn khoảng thời gian khác</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Combined Multi-line Chart
    const renderCombinedChart = () => {
        return (
            <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden">
                <div className="p-6 border-b border-gray-600/30 bg-gradient-to-r from-gray-800/50 to-gray-700/30">
                    <h2 className="font-bold text-xl text-white mb-2">Tổng quan tất cả cảm biến</h2>
                    <p className="text-sm text-gray-300">So sánh xu hướng các thông số</p>
                </div>
                <div className="p-6">
                    {combinedData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={400}>
                            <LineChart data={combinedData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.2)" />
                                <XAxis
                                    dataKey="timestamp"
                                    tickFormatter={(t) => new Date(t).toLocaleTimeString().substring(0, 5)}
                                    stroke="#9CA3AF"
                                    fontSize={12}
                                />
                                <YAxis yAxisId="left" stroke="#9CA3AF" fontSize={12} />
                                <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" fontSize={12} />
                                <Tooltip
                                    content={({ active, payload, label }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-gray-800/90 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-gray-600/50">
                                                    <p className="font-semibold text-white mb-2">
                                                        {new Date(label).toLocaleDateString('vi-VN')} - {new Date(label).toLocaleTimeString('vi-VN')}
                                                    </p>
                                                    {payload.map((entry, index) => (
                                                        <div key={index} className="flex items-center justify-between gap-4 mb-1">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                                                                <span className="text-sm text-gray-300">{entry.name}</span>
                                                            </div>
                                                            <span className="font-bold" style={{ color: entry.color }}>
                                                                {entry.value} {entry.name === 'Ánh sáng' ? 'lux' : entry.name === 'Nhiệt độ' ? '°C' : '%'}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Legend />
                                <Line yAxisId="left" type="monotone" dataKey="light" stroke="#facc15" strokeWidth={3} name="Ánh sáng" dot={false} />
                                <Line yAxisId="right" type="monotone" dataKey="temperature" stroke="#ef4444" strokeWidth={3} name="Nhiệt độ" dot={false} />
                                <Line yAxisId="right" type="monotone" dataKey="humidity" stroke="#3b82f6" strokeWidth={3} name="Độ ẩm" dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-[400px] flex items-center justify-center">
                            <p className="text-gray-400">Không có dữ liệu để hiển thị</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Icons
    const lightIcon = (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
        </svg>
    );

    const tempIcon = (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
        </svg>
    );

    const humidityIcon = (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
        </svg>
    );

    return (
        <div className="p-6 bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-900 dark:to-black min-h-screen transition-colors duration-300">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <div className="p-2 bg-indigo-600/20 border border-indigo-500/30 rounded-xl">
                        <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                        </svg>
                    </div>
                    Dashboard IoT Monitoring
                </h1>
                <p className="text-gray-300">
                    Giám sát và phân tích dữ liệu từ hệ thống cảm biến thông minh
                </p>
            </div>

            {/* Enhanced Filter Card */}
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/60 backdrop-blur-xl border border-gray-700/50 rounded-3xl shadow-2xl p-8 mb-8 relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 to-purple-600/5 pointer-events-none"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                
                <div className="relative">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-indigo-600/20 border border-indigo-500/30 rounded-xl">
                                <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Bộ lọc dữ liệu thông minh</h2>
                                <p className="text-sm text-gray-400">Chọn khoảng thời gian để phân tích chi tiết</p>
                            </div>
                        </div>
                        
                        {/* Reset button */}
                        <button
                            onClick={clearFilters}
                            className="px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/50 text-gray-300 hover:text-white rounded-xl transition-all duration-300 flex items-center gap-2 text-sm"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                            </svg>
                            Đặt lại
                        </button>
                    </div>

                    {/* Quick Filter Buttons */}
                    <div className="mb-6">
                        <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                            <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                            </svg>
                            Lọc nhanh
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                            {quickFilters.map((filter) => (
                                <button
                                    key={filter.label}
                                    onClick={() => setQuickFilter(filter.days, filter.label)}
                                    className={`px-3 sm:px-4 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 border ${
                                        activeQuickFilter === filter.label
                                            ? 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-500 shadow-lg shadow-indigo-500/25'
                                            : 'bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white border-gray-600/50 hover:border-gray-500/50'
                                    }`}
                                >
                                    <span className="text-lg">{filter.icon}</span>
                                    <span className="text-xs sm:text-sm">{filter.label}</span>
                                    {activeQuickFilter === filter.label && (
                                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Custom Date Range */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-300 flex items-center gap-2">
                                <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                Từ ngày
                            </label>
                            <div className="relative">
                                <input 
                                    type="date" 
                                    value={startDate} 
                                    max={new Date().toISOString().split('T')[0]}
                                    onChange={(e) => {
                                        setStartDate(e.target.value);
                                        setActiveQuickFilter('');
                                    }}
                                    className="w-full px-4 py-3 bg-gray-700/60 backdrop-blur-sm border border-gray-600/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 hover:bg-gray-700/80"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-300 flex items-center gap-2">
                                <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                Đến ngày
                            </label>
                            <div className="relative">
                                <input 
                                    type="date" 
                                    value={endDate} 
                                    max={new Date().toISOString().split('T')[0]}
                                    onChange={(e) => {
                                        setEndDate(e.target.value);
                                        setActiveQuickFilter('');
                                    }}
                                    className="w-full px-4 py-3 bg-gray-700/60 backdrop-blur-sm border border-gray-600/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 hover:bg-gray-700/80" 
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        
                        <div className="sm:col-span-2 lg:col-span-1 flex gap-3">
                            <button
                                onClick={loadSensorData}
                                className="flex-1 px-4 sm:px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span className="hidden sm:inline">Đang tải...</span>
                                        <span className="sm:hidden">Tải</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                        </svg>
                                        <span className="hidden sm:inline">Tìm kiếm</span>
                                        <span className="sm:hidden">Tìm</span>
                                    </>
                                )}
                            </button>
                        </div>
                        
                        <div className="sm:col-span-2 lg:col-span-1">
                            <button
                                onClick={exportToCSV}
                                className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                disabled={isLoading || (!lightData.length && !tempData.length && !humidityData.length)}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                                <span>Tải CSV</span>
                                <div className="w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
                            </button>
                        </div>
                    </div>

                    {/* Filter Status */}
                    {(startDate || endDate || activeQuickFilter) && (
                        <div className="mt-4 p-4 bg-indigo-600/10 border border-indigo-500/20 rounded-xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
                                    <span className="text-sm text-indigo-300 font-medium">
                                        {activeQuickFilter ? (
                                            `Đang hiển thị dữ liệu ${activeQuickFilter.toLowerCase()}`
                                        ) : (
                                            `Đang hiển thị từ ${startDate || '...'} đến ${endDate || '...'}`
                                        )}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    <span>
                                        {lightData.length + tempData.length + humidityData.length} điểm dữ liệu
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Metrics Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* Light Card */}
                <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/20 border border-yellow-600/30 rounded-2xl shadow-2xl p-6 flex items-center justify-between transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
                    <div className="flex items-center">
                        <div className="p-4 rounded-xl bg-yellow-600/20 border border-yellow-500/30 mr-4 shadow-inner">
                            <div className="text-yellow-400">{lightIcon}</div>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-yellow-300">Ánh sáng</h3>
                            <p className="text-3xl font-bold text-yellow-200">
                                {getLatestValue(lightData)} <span className="text-lg">lux</span>
                            </p>
                            <p className="text-xs text-yellow-400 mt-1">
                                Xu hướng: {getStatistics(lightData).trend === 'up' ? '📈 Tăng' : getStatistics(lightData).trend === 'down' ? '📉 Giảm' : '➡️ Ổn định'}
                            </p>
                        </div>
                    </div>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                        parseFloat(getLatestValue(lightData)) > 1000 
                            ? 'bg-green-600/20 text-green-300 border border-green-500/30' 
                            : 'bg-yellow-600/20 text-yellow-300 border border-yellow-500/30'
                    }`}>
                        {parseFloat(getLatestValue(lightData)) > 1000 ? '☀️ Sáng' : '🌤️ Vừa'}
                    </span>
                </div>

                {/* Temperature Card */}
                <div className="bg-gradient-to-br from-red-900/30 to-pink-900/20 border border-red-600/30 rounded-2xl shadow-2xl p-6 flex items-center justify-between transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
                    <div className="flex items-center">
                        <div className="p-4 rounded-xl bg-red-600/20 border border-red-500/30 mr-4 shadow-inner">
                            <div className="text-red-400">{tempIcon}</div>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-red-300">Nhiệt độ</h3>
                            <p className="text-3xl font-bold text-red-200">
                                {getLatestValue(tempData)} <span className="text-lg">°C</span>
                            </p>
                            <p className="text-xs text-red-400 mt-1">
                                Xu hướng: {getStatistics(tempData).trend === 'up' ? '📈 Tăng' : getStatistics(tempData).trend === 'down' ? '📉 Giảm' : '➡️ Ổn định'}
                            </p>
                        </div>
                    </div>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                        parseFloat(getLatestValue(tempData)) > 30 
                            ? 'bg-red-600/20 text-red-300 border border-red-500/30' 
                            : parseFloat(getLatestValue(tempData)) > 20
                            ? 'bg-green-600/20 text-green-300 border border-green-500/30'
                            : 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                    }`}>
                        {parseFloat(getLatestValue(tempData)) > 30 ? '🔥 Nóng' : parseFloat(getLatestValue(tempData)) > 20 ? '🌡️ Ấm' : '❄️ Lạnh'}
                    </span>
                </div>

                {/* Humidity Card */}
                <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/20 border border-blue-600/30 rounded-2xl shadow-2xl p-6 flex items-center justify-between transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
                    <div className="flex items-center">
                        <div className="p-4 rounded-xl bg-blue-600/20 border border-blue-500/30 mr-4 shadow-inner">
                            <div className="text-blue-400">{humidityIcon}</div>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-blue-300">Độ ẩm</h3>
                            <p className="text-3xl font-bold text-blue-200">
                                {getLatestValue(humidityData)} <span className="text-lg">%</span>
                            </p>
                            <p className="text-xs text-blue-400 mt-1">
                                Xu hướng: {getStatistics(humidityData).trend === 'up' ? '📈 Tăng' : getStatistics(humidityData).trend === 'down' ? '📉 Giảm' : '➡️ Ổn định'}
                            </p>
                        </div>
                    </div>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                        parseFloat(getLatestValue(humidityData)) > 70 
                            ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30' 
                            : 'bg-yellow-600/20 text-yellow-300 border border-yellow-500/30'
                    }`}>
                        {parseFloat(getLatestValue(humidityData)) > 70 ? '💧 Ẩm ướt' : '🌵 Khô ráo'}
                    </span>
                </div>
            </div>

            {/* Combined Chart */}
            <div className="mb-8">
                {renderCombinedChart()}
            </div>

            {/* Individual Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {renderEnhancedChart("Ánh sáng", lightData, "lux", "#facc15", lightIcon, 'area', 'yellow')}
                {renderEnhancedChart("Nhiệt độ", tempData, "°C", "#ef4444", tempIcon, 'area', 'red')}
            </div>
            <div>
                {renderEnhancedChart("Độ ẩm", humidityData, "%", "#3b82f6", humidityIcon, 'area', 'blue')}
            </div>

            {/* CSS Animation */}
            <style jsx>{`
                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.1); opacity: 0.8; }
                }
                .animate-pulse-slow {
                    animation: pulse 2s infinite;
                }
            `}</style>
        </div>
    );
};

export default Dashboard;
