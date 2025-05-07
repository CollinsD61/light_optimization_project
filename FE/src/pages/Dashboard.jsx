// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer
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

    const loadSensorData = async () => {
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
        saveAs(blob, 'sensor_data.csv');
    };


    const renderChart = (title, data, unit, color) => (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="font-semibold mb-2">{title} ({unit})</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="timestamp"
                        tickFormatter={(t) => new Date(t).toLocaleTimeString()}
                        minTickGap={20}
                    />
                    <YAxis />
                    <Tooltip labelFormatter={(t) => new Date(t).toLocaleString()} />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke={color} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );

    return (
        <div className="p-4 space-y-6">
            <div className="flex gap-4 items-center">
                <div>
                    <label className="block text-sm">Từ ngày</label>
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border p-1 rounded" />
                </div>
                <div>
                    <label className="block text-sm">Đến ngày</label>
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border p-1 rounded" />
                </div>
                <button
                    onClick={exportToCSV}
                    className="bg-blue-600 text-white px-4 py-2 rounded mt-5"
                >
                    Tải CSV
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderChart("Ánh sáng", lightData, "lux", "#facc15")}
                {renderChart("Nhiệt độ", tempData, "°C", "#ef4444")}
                {renderChart("Độ ẩm", humidityData, "%", "#3b82f6")}
            </div>
        </div>
    );
};

export default Dashboard;
