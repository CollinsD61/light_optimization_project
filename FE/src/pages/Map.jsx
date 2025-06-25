import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl, ZoomControl, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import L from 'leaflet';
import { fetchSensorData } from '../api';
import { ChevronDown, Search, Filter, RefreshCw, PlusCircle, MapPin, AlertTriangle, CheckCircle, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BatteryService } from '../services/batteryService';

// Fix for default marker icons with Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Update the customIcon function to use device-specific icons and move battery to top
const customIcon = (status, battery = 100, deviceType = 'default', isSelected = false) => {
  // Choose icon based on device type
  let iconUrl;
  switch(deviceType.toLowerCase()) {
    case 'humidity':
      iconUrl = 'https://cdn-icons-png.flaticon.com/512/3262/3262966.png';
      break;
    case 'temperature':
      iconUrl = 'https://cdn-icons-png.flaticon.com/512/1843/1843544.png';
      break;
    case 'light':
      iconUrl = 'https://cdn-icons-png.flaticon.com/512/3262/3262940.png';
      break;
    case 'gateway':
      iconUrl = 'https://cdn-icons-png.flaticon.com/512/2885/2885334.png';
      break;
    case 'environment':
      iconUrl = 'https://cdn-icons-png.flaticon.com/512/1808/1808468.png';
      break;
    default:
      iconUrl = 'https://cdn-icons-png.flaticon.com/512/3655/3655582.png';
  }

  // Choose marker color based on status and battery
  let markerBorderColor = '';
  if (status === 'warning') {
    markerBorderColor = '#EF4444'; // red
  } else if (status === 'caution') {
    markerBorderColor = '#F59E0B'; // orange
  } else {
    markerBorderColor = '#3B82F6'; // blue
  }
  
  // Choose battery color
  const batteryColor = battery > 50 ? '#10B981' : battery > 20 ? '#F59E0B' : '#EF4444';
  
  // Build class names properly
  const baseClasses = ['custom-marker'];
  if (status === 'warning') baseClasses.push('marker-warning');
  if (isSelected) baseClasses.push('marker-selected');
  
  const selectedBorderWidth = isSelected ? '3px' : '2px';
  const selectedBorderColor = isSelected ? '#3B82F6' : markerBorderColor;
  
  return new L.DivIcon({
    className: baseClasses.join(' '), // Ensure classes are properly joined
    html: `
      <div class="marker-container ${status === 'warning' ? 'marker-warning' : ''} ${isSelected ? 'marker-selected' : ''}">
        <!-- Battery indicator on top -->
        <div class="battery-indicator-top">
          <div class="battery-level-top" style="width: ${battery}%; background-color: ${batteryColor};"></div>
        </div>
        <!-- Device icon -->
        <div class="device-icon" style="border: ${selectedBorderWidth} solid ${selectedBorderColor};">
          <img 
            src="${iconUrl}"
            alt="Device"
            style="width: 100%; height: 100%; object-fit: cover;"
          />
          <div class="marker-hover-effect"></div>
        </div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });
};

const SensorMap = () => {
  const [sensors, setSensors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState([21.0285, 105.8542]);
  const [zoom, setZoom] = useState(13);
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [mapStyle, setMapStyle] = useState('standard');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [openPopup, setOpenPopup] = useState(null);
  const [batteryUpdateInterval, setBatteryUpdateInterval] = useState(null);
  const mapRef = useRef(null);
  const navigate = useNavigate();
  
  // Tile layer options
  const mapTiles = {
    standard: {
      url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      name: 'Standard'
    },
    dark: {
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      name: 'Dark'
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      name: 'Satellite'
    },
    night: {
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      name: 'Night Lights',
      className: 'night-map-style'
    }
  };

  useEffect(() => {
    // Load dữ liệu ngay khi mount
    loadSensorData();
    
    // Đợi 5 phút trước khi bắt đầu auto-update
    const delayTimeout = setTimeout(() => {
      console.log('Starting auto battery update after 5 minutes delay');
      
      const interval = setInterval(() => {
        console.log('Auto battery update every 10 minutes');
        updateSensorsBattery();
      }, 10 * 60 * 1000); // 10 phút
      
      setBatteryUpdateInterval(interval);
    }, 5 * 60 * 1000); // Đợi 5 phút

    // Set up CSS for custom markers and animations
    const style = document.createElement('style');
    style.innerHTML = `
  @keyframes pulse-marker {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  /* Fix for glitching markers */
  .leaflet-marker-icon {
    pointer-events: auto !important;
    will-change: transform;
    transform-origin: center bottom;
    transform: translate3d(0,0,0);
    transition: none;
  }
  
  /* Marker container that holds all components */
  .marker-container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    transform-origin: center bottom;
    transition: none;
  }
  
  /* The device icon styling */
  .device-icon {
    position: relative;
    width: 40px;
    height: 40px;
    background-color: rgba(31, 41, 55, 0.9);
    border-radius: 50%;
    overflow: hidden;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px;
    z-index: 1;
    transform: translateZ(0);
    transition: none;
  }
  
  /* Hover effects */
  .marker-hover-effect {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: transparent;
    z-index: 2;
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), 
                box-shadow 0.3s ease;
    transform: scale(1) translateY(0);
    pointer-events: none;
  }
  
  .leaflet-marker-icon:hover .marker-hover-effect {
    transform: scale(1.2) translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
  }
  
  .leaflet-marker-icon:hover .device-icon {
    filter: brightness(1.2);
  }
  
  .marker-warning .device-icon {
    animation: pulse-marker 2s infinite;
  }
  
  /* Battery indicator on top of icon */
  .battery-indicator-top {
    position: absolute;
    width: 36px;
    height: 4px;
    background-color: rgba(0, 0, 0, 0.6);
    border-radius: 2px;
    overflow: hidden;
    z-index: 10;
    top: -7px;
    left: 50%;
    transform: translateX(-50%);
    border: 1px solid rgba(255, 255, 255, 0.3);
  }
  
  .battery-level-top {
    height: 100%;
    border-radius: 1px;
  }
  
  /* SELECTED MARKER STYLES - FIX POSITION */
  .custom-marker.marker-selected .device-icon {
    transform: scale(1.3) !important;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.8), 0 8px 20px rgba(0, 0, 0, 0.6) !important;
    z-index: 1000 !important;
    background-color: rgba(59, 130, 246, 0.3) !important;
    filter: brightness(1.3) !important;
  }
  
  /* Fix vòng tròn - căn chỉnh với marker chính xác */
  .custom-marker.marker-selected::after {
    content: '';
    position: absolute;
    width: 56px;
    height: 56px;
    background: transparent;
    border: 2px solid #3B82F6;
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);  /* Fix: center exactly */
    animation: pulse-ring 2s infinite;
    z-index: -1;
    pointer-events: none;
  }
  
  @keyframes pulse-ring {
    0% { 
      transform: translate(-50%, -50%) scale(0.9); 
      opacity: 1; 
      border-width: 2px;
    }
    50% { 
      transform: translate(-50%, -50%) scale(1.2); 
      opacity: 0.5; 
      border-width: 1px;
    }
    100% { 
      transform: translate(-50%, -50%) scale(0.9); 
      opacity: 1; 
      border-width: 2px;
    }
  }
  
  /* Ensure selected markers appear on top */
  .leaflet-marker-pane .custom-marker.marker-selected {
    z-index: 9000 !important;
  }
    `;
    document.head.appendChild(style);
    
    return () => {
      clearTimeout(delayTimeout);
      if (batteryUpdateInterval) {
        clearInterval(batteryUpdateInterval);
      }
      document.head.removeChild(style);
    };
  }, []);

  const loadSensorData = async () => {
    setIsLoading(true);
    try {
      const response = await fetchSensorData();
      const data = response.data;
      
      if (data && data.length > 0) {
        const sortedData = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        const latest = sortedData[0];
        
        // Lấy giá trị pin từ Firebase
        const batteryData = await BatteryService.getBattery('hcm-device-01');
        console.log('Battery data from Firebase:', batteryData);
        
        let batteryLevel = 86; // Default value
        
        if (batteryData && batteryData.level !== undefined) {
          // Có dữ liệu pin trên Firebase
          console.log('Found existing battery data:', batteryData);
          
          // Tính toán pin mới dựa trên thời gian đã trôi qua
          const calculatedBattery = BatteryService.calculateBatteryLevel(
            batteryData.timestamp, 
            batteryData.level
          );
          
          console.log('Original battery:', batteryData.level);
          console.log('Calculated battery after time:', calculatedBattery);
          
          // Nếu pin đã thay đổi đáng kể (>= 1%), cập nhật lên Firebase
          if (Math.abs(calculatedBattery - batteryData.level) >= 1) {
            console.log(`Battery changed from ${batteryData.level}% to ${calculatedBattery}%`);
            await BatteryService.updateBattery('hcm-device-01', calculatedBattery);
            batteryLevel = calculatedBattery;
          } else {
            console.log('Battery change too small, keeping original value');
            batteryLevel = batteryData.level;
          }
        } else {
          // Chưa có dữ liệu, khởi tạo lần đầu
          console.log('No Firebase data found, initializing with:', batteryLevel);
          await BatteryService.updateBattery('hcm-device-01', batteryLevel);
        }
        
        const sensorData = {
          id: 'hcm-device-01',
          sensor_id: 'hcm-device-01',
          name: 'Cảm biến độ ẩm TP.HCM',
          lat: 10.7769,
          lng: 106.7009,
          type: 'humidity',
          deviceType: 'humidity',
          location: 'Quận 1, TP. Hồ Chí Minh',
          timestamp: latest.timestamp,
          light: latest.light_value || 0,
          temperature: latest.temperature || 0,
          humidity: latest.humidity || 0,
          battery: batteryLevel, // Sử dụng pin đã tính toán
          batteryLastUpdated: new Date().toISOString(),
          isLive: true
        };
        
        setSensors([sensorData]);
      }
    } catch (error) {
      console.error('Error loading sensor data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm cập nhật pin
  const updateSensorsBattery = async (sensorList = sensors) => {
    try {
      console.log('Manual battery update triggered');
      for (const sensor of sensorList) {
        // Sử dụng smartUpdateBattery thay vì calculateBatteryLevel
        const newBatteryLevel = await BatteryService.smartUpdateBattery(sensor.id);
        
        if (newBatteryLevel !== null) {
          setSensors(prevSensors => 
            prevSensors.map(s => 
              s.id === sensor.id 
                ? { ...s, battery: newBatteryLevel, batteryLastUpdated: new Date().toISOString() }
                : s
            )
          );
        }
      }
    } catch (error) {
      console.error('Error updating sensors battery:', error);
    }
  };

  // Thêm listener cho realtime updates
  useEffect(() => {
    if (sensors.length > 0) {
      const unsubscribers = sensors.map(sensor => {
        return BatteryService.listenToBatteryChanges(sensor.id, (snapshot) => {
          if (snapshot.exists()) {
            const batteryData = snapshot.val();
            setSensors(prevSensors => 
              prevSensors.map(s => 
                s.id === sensor.id 
                  ? { ...s, battery: batteryData.level, batteryLastUpdated: batteryData.timestamp }
                  : s
              )
            );
          }
        });
      });

      return () => {
        unsubscribers.forEach(unsubscribe => unsubscribe());
      };
    }
  }, [sensors.length]);

  const getSensorStatus = (temp, humidity, light) => {
    // Logic to determine sensor status based on readings
    if (temp > 30) return 'warning';
    if (humidity > 80) return 'warning';
    if (light < 100) return 'caution';
    return 'normal';
  };
  
  const getMarkerColor = (status) => {
    switch(status) {
      case 'warning': return 'red';
      case 'caution': return 'orange';
      default: return 'blue';
    }
  };
  
  const getStatusText = (status) => {
    switch(status) {
      case 'warning': return 'Cảnh báo';
      case 'caution': return 'Chú ý';
      default: return 'Bình thường';
    }
  };
  
  const handleSensorClick = (sensor) => {
    console.log('Selecting sensor:', sensor.id, 'at coordinates:', sensor.lat, sensor.lng);
    
    // Không tự động cập nhật pin khi click
    // Chỉ set selected sensor
    setSelectedSensor(sensor);
    setOpenPopup(sensor.id);
    
    if (mapRef.current) {
      mapRef.current.flyTo([sensor.lat, sensor.lng], 16, {
        animate: true,
        duration: 1.5
      });
      
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
              const position = layer.getLatLng();
              if (position.lat === sensor.lat && position.lng === sensor.lng) {
                layer.openPopup();
              }
            }
          });
          mapRef.current.invalidateSize();
        }
      }, 1600);
    }
  };
  
  const getFilteredSensors = () => {
    return sensors.filter(sensor => {
      const status = getSensorStatus(sensor.temperature, sensor.humidity, sensor.light);
      
      // Apply status filter
      if (filterStatus !== 'all' && status !== filterStatus) {
        return false;
      }
      
      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          sensor.name.toLowerCase().includes(query) ||
          sensor.location.toLowerCase().includes(query) ||
          sensor.type.toLowerCase().includes(query)
        );
      }
      
      return true;
    });
  };
  
  const filteredSensors = getFilteredSensors();
  
  const getMapRef = (ref) => {
    mapRef.current = ref;
  };
  
  // Add this function alongside your other helper functions
const getDeviceTypeText = (type) => {
  switch(type) {
    case 'humidity':
      return 'Cảm biến độ ẩm';
    case 'temperature':
      return 'Cảm biến nhiệt độ';
    case 'light':
      return 'Cảm biến ánh sáng';
    case 'gateway':
      return 'Bộ thu phát Gateway';
    case 'environment':
      return 'Cảm biến môi trường';
    default:
      return 'Thiết bị IoT';
  }
};

  useEffect(() => {
  // Force redraw markers when selectedSensor changes
  if (mapRef.current) {
    // Invalidate size to trigger marker refresh
    setTimeout(() => {
      mapRef.current.invalidateSize();
      // Also trigger a small pan to force marker re-render
      const currentCenter = mapRef.current.getCenter();
      mapRef.current.panTo([currentCenter.lat + 0.0001, currentCenter.lng + 0.0001]);
      setTimeout(() => {
        mapRef.current.panTo([currentCenter.lat, currentCenter.lng]);
      }, 50);
    }, 100);
  }
}, [selectedSensor]);

  // Thêm function này vào SensorMap component
const forceSyncBattery = async () => {
  try {
    console.log('Force syncing battery...');
    const batteryData = await BatteryService.getBattery('hcm-device-01');
    console.log('Current Firebase battery:', batteryData);
    
    if (batteryData && batteryData.level !== undefined) {
      setSensors(prevSensors => 
        prevSensors.map(sensor => ({
          ...sensor,
          battery: batteryData.level,
          batteryLastUpdated: batteryData.timestamp
        }))
      );
      console.log('Battery synced to:', batteryData.level);
    } else {
      console.log('No battery data found');
    }
  } catch (error) {
    console.error('Error syncing battery:', error);
  }
};

  // Thêm function test battery calculation
const testBatteryCalculation = async () => {
  try {
    console.log('=== TESTING BATTERY CALCULATION ===');
    const batteryData = await BatteryService.getBattery('hcm-device-01');
    
    if (batteryData) {
      console.log('Current Firebase data:', batteryData);
      
      // Test với timestamp giả (1 giờ trước)
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const calculatedBattery = BatteryService.calculateBatteryLevel(oneHourAgo, batteryData.level);
      
      console.log('If last update was 1 hour ago:');
      console.log('Original:', batteryData.level + '%');
      console.log('After 1 hour:', calculatedBattery + '%');
      console.log('Difference:', (batteryData.level - calculatedBattery) + '%');
    }
  } catch (error) {
    console.error('Error testing battery calculation:', error);
  }
};

  return (
    <div className="p-6 bg-gradient-to-br from-gray-800 to-gray-900 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <div className="p-2 bg-blue-600/20 border border-blue-500/30 rounded-xl">
            <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
            </svg>
          </div>
          Bản đồ cảm biến
        </h1>
        <p className="text-gray-300">
          Giám sát vị trí và trạng thái các cảm biến trong toàn bộ hệ thống
        </p>
      </div>

      {/* Control Panel */}
      <div className="mb-6 grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Search & Filter */}
        <div className="lg:col-span-2 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input 
              type="text" 
              placeholder="Tìm kiếm cảm biến..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-700/60 backdrop-blur-sm border border-gray-600/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
            />
            <Search className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="w-full sm:w-auto px-6 py-3 bg-gray-700/60 backdrop-blur-sm border border-gray-600/60 rounded-xl text-white flex items-center justify-center gap-2 hover:bg-gray-600/60 transition-all duration-300"
            >
              <Filter size={18} />
              <span>Lọc</span>
              <ChevronDown size={16} className={`transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isFilterOpen && (
              <div className="absolute z-10 mt-2 w-64 rounded-xl bg-gray-700 shadow-lg border border-gray-600 p-4">
                <h3 className="text-white font-medium mb-3">Trạng thái cảm biến</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-white">
                    <input 
                      type="radio" 
                      name="status" 
                      checked={filterStatus === 'all'} 
                      onChange={() => setFilterStatus('all')} 
                      className="accent-blue-500" 
                    />
                    <span>Tất cả cảm biến</span>
                  </label>
                  <label className="flex items-center gap-2 text-white">
                    <input 
                      type="radio" 
                      name="status" 
                      checked={filterStatus === 'normal'} 
                      onChange={() => setFilterStatus('normal')} 
                      className="accent-blue-500" 
                    />
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      Bình thường
                    </span>
                  </label>
                  <label className="flex items-center gap-2 text-white">
                    <input 
                      type="radio" 
                      name="status" 
                      checked={filterStatus === 'caution'} 
                      onChange={() => setFilterStatus('caution')} 
                      className="accent-orange-500" 
                    />
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                      Cần chú ý
                    </span>
                  </label>
                  <label className="flex items-center gap-2 text-white">
                    <input 
                      type="radio" 
                      name="status" 
                      checked={filterStatus === 'warning'} 
                      onChange={() => setFilterStatus('warning')} 
                      className="accent-red-500" 
                    />
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      Cảnh báo
                    </span>
                  </label>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-600">
                  <button 
                    onClick={() => {
                      setFilterStatus('all');
                      setSearchQuery('');
                      setIsFilterOpen(false);
                    }}
                    className="w-full py-2 text-sm bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors duration-300"
                  >
                    Đặt lại bộ lọc
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Map Style Selection */}
        <div className="flex gap-3">
          {Object.keys(mapTiles).map(style => (
            <button
              key={style}
              onClick={() => setMapStyle(style)}
              className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 ${
                mapStyle === style 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                  : 'bg-gray-700/60 text-gray-300 hover:bg-gray-600/60'
              }`}
            >
              <Layers size={16} />
              <span>{mapTiles[style].name}</span>
            </button>
          ))}
        </div>
        
        {/* Actions - loại bỏ nút test */}
        <div className="flex gap-3">
          <button 
            onClick={loadSensorData}
            className="flex-1 py-3 bg-gray-700/60 hover:bg-gray-600/60 backdrop-blur-sm border border-gray-600/60 rounded-xl text-white flex items-center justify-center gap-2 transition-all duration-300"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            <span>{isLoading ? 'Đang tải...' : 'Làm mới'}</span>
          </button>
          
          <button 
            onClick={forceSyncBattery}
            className="flex-1 py-3 bg-purple-700/60 hover:bg-purple-600/60 backdrop-blur-sm border border-purple-600/60 rounded-xl text-white flex items-center justify-center gap-2 transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
            <span>Đồng bộ pin</span>
          </button>

          {/* Nút test calculation */}
          <button 
            onClick={testBatteryCalculation}
            className="flex-1 py-3 bg-indigo-700/60 hover:bg-indigo-600/60 backdrop-blur-sm border border-indigo-600/60 rounded-xl text-white flex items-center justify-center gap-2 transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
            <span>Test tính toán</span>
          </button>
          
          <button 
            onClick={() => {
              alert('Chức năng thêm cảm biến mới sẽ được phát triển trong phiên bản tiếp theo');
            }}
            className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl text-white flex items-center justify-center gap-2 transition-all duration-300"
          >
            <PlusCircle size={16} />
            <span>Thêm cảm biến</span>
          </button>
        </div>
      </div>

      {/* Map container with 3D perspective effect */}
      <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/60 backdrop-blur-xl border border-gray-700/50 rounded-3xl shadow-2xl p-4 mb-8 relative transform hover:scale-[1.01] transition-all duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-indigo-600/5 to-blue-600/5 rounded-3xl pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(59,130,246,0.08),transparent_50%)] rounded-3xl pointer-events-none"></div>
        <div className="h-[80vh] w-full rounded-2xl overflow-hidden shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] relative transform perspective-1000">
          {isLoading ? (
            <div className="h-full w-full flex items-center justify-center bg-gray-800/60">
              <div className="flex flex-col items-center">
                <svg className="animate-spin h-10 w-10 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-blue-300">Đang tải bản đồ cảm biến...</span>
              </div>
            </div>
          ) : (
            <div className="relative h-full w-full transform transition-transform duration-1000 hover:rotateX-1 hover:scale-[1.01]">
              <MapContainer 
                center={mapCenter} 
                zoom={zoom} 
                style={{ height: "100%", width: "100%" }}
                whenCreated={getMapRef}
                zoomControl={false}
                className="rounded-2xl z-0 shadow-inner"
                // Add these options to reduce glitching
                zoomAnimation={true}
                markerZoomAnimation={true}
                fadeAnimation={false}
                // Add pointer events styling to prevent hover issues
                attributionControl={false}
              >
                <ZoomControl position="bottomright" />
                <TileLayer
                  attribution={mapTiles[mapStyle].attribution}
                  url={mapTiles[mapStyle].url}
                />
                
                {filteredSensors.map(sensor => {
                  const status = getSensorStatus(sensor.temperature, sensor.humidity, sensor.light);
                  return (
                    <Marker 
                      key={sensor.id}
                      position={[sensor.lat, sensor.lng]}
                      icon={customIcon(
        status, 
        sensor.battery, 
        sensor.deviceType,
        selectedSensor && selectedSensor.id === sensor.id
      )}
                      eventHandlers={{
                        click: () => {
                          console.log('Single click sensor:', sensor.name);
                          handleSensorClick(sensor);
                        },
                        dblclick: () => {
                          console.log('Double click sensor:', sensor.name);
                          handleSensorClick(sensor);
                        }
                      }}
                      pane="markerPane"
                      autoPan={false}
                    >
                      <Popup 
        className="sensor-popup" 
        autoPan={false}
        closeButton={true}
        autoClose={false}
        closeOnClick={false}
      >
                        <div className="bg-gray-900/95 backdrop-blur-lg text-white p-4 rounded-xl border border-gray-700/80 w-72 shadow-2xl">
                          <h3 className="font-bold text-blue-400 mb-2 text-lg flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`w-2.5 h-2.5 rounded-full ${
                                status === 'warning' ? 'bg-red-500 animate-pulse' : 
                                status === 'caution' ? 'bg-yellow-500' :
                                'bg-green-500'
                              }`}></div>
                              {sensor.name}
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                              status === 'warning' ? 'bg-red-900/50 text-red-300 border border-red-700/30' : 
                              status === 'caution' ? 'bg-yellow-900/50 text-yellow-300 border border-yellow-700/30' :
                              'bg-green-900/50 text-green-300 border border-green-700/30'
                            }`}>
                              {getStatusText(status)}
                            </span>
                          </h3>
                          
                          <p className="text-sm text-gray-400 mb-3 flex items-center gap-2">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                            </svg>
                            {sensor.location}
                          </p>

                          <div className="flex mb-3 items-center text-sm text-gray-300">
                            <span>Loại thiết bị: </span>
                            <span className="ml-2 px-2 py-0.5 bg-gray-700/70 rounded text-xs">
                              {getDeviceTypeText(sensor.deviceType || sensor.type)}
                            </span>
                          </div>
                          
                          <div className="space-y-2.5 text-sm">
                            <div className="flex justify-between items-center p-2.5 rounded-lg bg-gray-800/80 backdrop-blur-sm border border-gray-700/50">
                              <span className="text-gray-400 flex items-center gap-2">
                                <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                Nhiệt độ:
                              </span> 
                              <span className="font-medium text-red-400">{sensor.temperature}°C</span>
                            </div>
                            
                            <div className="flex justify-between items-center p-2.5 rounded-lg bg-gray-800/80 backdrop-blur-sm border border-gray-700/50">
                              <span className="text-gray-400 flex items-center gap-2">
                                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                </svg>
                                Độ ẩm:
                              </span> 
                              <span className="font-medium text-blue-400">{sensor.humidity}%</span>
                            </div>
                            
                            <div className="flex justify-between items-center p-2.5 rounded-lg bg-gray-800/80 backdrop-blur-sm border border-gray-700/50">
                              <span className="text-gray-400 flex items-center gap-2">
                                <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                Ánh sáng:
                              </span> 
                              <span className="font-medium text-yellow-400">{sensor.light} lux</span>
                            </div>
                            
                            {/* Battery percentage display */}
                            <div className="flex justify-between items-center p-2.5 rounded-lg bg-gray-800/80 backdrop-blur-sm border border-gray-700/50">
                              <span className="text-gray-400 flex items-center gap-2">
                                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V7a2 2 0 012-2z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11h3a2 2 0 012 2v2a2 2 0 01-2 2h-3" />
                                </svg>
                                Pin:
                              </span> 
                              <span className={`font-medium ${
                                (sensor.battery || 0) > 50 ? 'text-green-400' : 
                                (sensor.battery || 0) > 20 ? 'text-yellow-400' : 'text-red-400'
                              }`}>{sensor.battery || 100}%</span>
                            </div>
                          </div>
                          
                          <p className="text-xs text-gray-500 mt-3 mb-3 flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Cập nhật: {new Date(sensor.timestamp).toLocaleString('vi-VN')}
                          </p>
                          
                          <div className="flex space-x-2">
                            <button className="flex-1 py-2 text-xs bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors flex items-center justify-center gap-1.5" 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleSensorClick(sensor);
                                    }}>
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              Chi tiết
                            </button>
                            <button className="flex-1 py-2 text-xs bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors flex items-center justify-center gap-1.5">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Lịch sử
                            </button>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
                
                <div className="leaflet-custom-controls">
                  <div className="leaflet-custom-control-container">
                    <button 
                      onClick={() => {
                        mapRef.current?.flyTo([21.0285, 105.8542], 13, {
                          animate: true,
                          duration: 1.5
                        });
                      }}
                      className="custom-map-button"
                      title="Trở về trung tâm"
                    >
                      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </button>
                  </div>
                </div>
              </MapContainer>
            </div>
          )}
        </div>
      </div>

      {/* Dashboard style status cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/20 border border-green-600/30 rounded-xl p-4 backdrop-blur-sm transform transition-transform hover:scale-105 duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-green-600/20 border border-green-500/30">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-white font-bold">Cảm biến bình thường</h3>
                <p className="text-gray-400 text-sm">Tất cả chỉ số trong ngưỡng an toàn</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-white">
              {sensors.filter(s => getSensorStatus(s.temperature, s.humidity, s.light) === 'normal').length}
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/20 border border-yellow-600/30 rounded-xl p-4 backdrop-blur-sm transform transition-transform hover:scale-105 duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-yellow-600/20 border border-yellow-500/30">
                <MapPin className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-white font-bold">Cần theo dõi</h3>
                <p className="text-gray-400 text-sm">Một số chỉ số gần ngưỡng cảnh báo</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-white">
              {sensors.filter(s => getSensorStatus(s.temperature, s.humidity, s.light) === 'caution').length}
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-red-900/30 to-pink-900/20 border border-red-600/30 rounded-xl p-4 backdrop-blur-sm transform transition-transform hover:scale-105 duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-red-600/20 border border-red-500/30">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-white font-bold">Cảnh báo</h3>
                <p className="text-gray-400 text-sm">Có chỉ số vượt ngưỡng an toàn</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-white">
              {sensors.filter(s => getSensorStatus(s.temperature, s.humidity, s.light) === 'warning').length}
            </div>
          </div>
        </div>
      </div>

      {/* Sensor details or selected sensor */}
      {selectedSensor && (
        <div className="mb-8 bg-gray-800/60 border border-gray-700/50 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">{selectedSensor.name}</h2>
              <p className="text-gray-400">{selectedSensor.location || 'Vị trí không xác định'}</p>
            </div>
            <button 
              onClick={() => setSelectedSensor(null)}
              className="p-2 text-gray-400 hover:text-white bg-gray-700/50 hover:bg-gray-600/50 rounded-lg"
            >
              ✕
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-red-900/20 border border-red-600/30 p-4 rounded-lg">
              <h3 className="text-red-300 mb-1 font-medium flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-400"></div>
                Nhiệt độ
              </h3>
              <p className="text-2xl font-bold text-white">{selectedSensor.temperature} °C</p>
            </div>
            <div className="bg-blue-900/20 border border-blue-600/30 p-4 rounded-lg">
              <h3 className="text-blue-300 mb-1 font-medium flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                Độ ẩm
              </h3>
              <p className="text-2xl font-bold text-white">{selectedSensor.humidity} %</p>
            </div>
            <div className="bg-yellow-900/20 border border-yellow-600/30 p-4 rounded-lg">
              <h3 className="text-yellow-300 mb-1 font-medium flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                Ánh sáng
              </h3>
              <p className="text-2xl font-bold text-white">{selectedSensor.light} lux</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2V4a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              Xem lịch sử
            </button>
            <button className="flex-1 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              Cài đặt cảm biến
            </button>
          </div>
        </div>
      )}

      {/* Responsive sensor data table */}
      <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl overflow-hidden backdrop-blur-sm">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
            Danh sách cảm biến
          </h2>
          <span className="text-sm text-gray-400">
            {filteredSensors.length} / {sensors.length} cảm biến
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700/50">
  <tr>
    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Cảm biến</th>
    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Vị trí</th>
    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Nhiệt độ</th>
    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Độ ẩm</th>
    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Ánh sáng</th>
    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Pin</th>
    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Trạng thái</th>
    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Thao tác</th>
  </tr>
</thead>
<tbody className="bg-gray-800/30 divide-y divide-gray-700">
  {filteredSensors.length > 0 ? (
    filteredSensors.map(sensor => {
      const status = getSensorStatus(sensor.temperature, sensor.humidity, sensor.light);
      return (
        <tr 
          key={sensor.id} 
          className="hover:bg-gray-700/30 transition-colors duration-200 cursor-pointer"
          onClick={() => handleSensorClick(sensor)}
        >
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full ${
                status === 'warning' ? 'bg-red-500 animate-pulse' : 
                status === 'caution' ? 'bg-yellow-500' : 
                'bg-green-500'
              }`}></div>
              <span className="ml-3 font-medium text-white">{sensor.name}</span>
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
            {sensor.location || `${sensor.lat.toFixed(4)}, ${sensor.lng.toFixed(4)}`}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-red-400">{sensor.temperature}°C</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-400">{sensor.humidity}%</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-400">{sensor.light} lux</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm">
            <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full ${
                  (sensor.battery || 0) > 50 ? 'bg-green-500' : 
                  (sensor.battery || 0) > 20 ? 'bg-yellow-500' : 
                  'bg-red-500'
                }`}
                style={{ width: `${sensor.battery || 0}%` }}
              ></div>
            </div>
            <span className={`text-xs mt-1 inline-block ${
              (sensor.battery || 0) > 50 ? 'text-green-400' : 
              (sensor.battery || 0) > 20 ? 'text-yellow-400' : 
              'text-red-400'
            }`}>
              {sensor.battery || 0}%
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
              status === 'warning' ? 'bg-red-900/50 text-red-300' : 
              status === 'caution' ? 'bg-yellow-900/50 text-yellow-300' :
              'bg-green-900/50 text-green-300'
            }`}>
              {getStatusText(status)}
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <button className="text-blue-400 hover:text-blue-300 mr-3">Chi tiết</button>
            <button className="text-gray-400 hover:text-gray-300">Lịch sử</button>
          </td>
        </tr>
      );
    })
  ) : (
    <tr>
      <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-400">
        {searchQuery || filterStatus !== 'all' ? 
          'Không có cảm biến nào khớp với bộ lọc' : 
          'Không có dữ liệu cảm biến'}
      </td>
    </tr>
  )}
</tbody>
          </table>
        </div>
      </div>
      
      {/* Custom styles */}
      <style jsx>{`
        .leaflet-container {
          font-family: inherit;
          z-index: 0;
          filter: saturate(1.1) contrast(1.05) brightness(1.02);
        }
        
        /* Fix popup styles */
        .leaflet-popup-content-wrapper {
          background-color: transparent !important;
          box-shadow: none !important;
          border: none !important;
          border-radius: 0 !important;
        }

        .leaflet-popup-content {
          margin: 0 !important;
          filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.6));
        }

        .leaflet-popup-tip {
          background-color: #1f2937 !important;
          border: 1px solid #374151 !important;
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2) !important;
        }

        /* Ensure popup appears above everything */
        .leaflet-popup {
          z-index: 10000 !important;
        }

        .leaflet-popup-pane {
          z-index: 10000 !important;
        }
        
        /* Fix controls */
        .leaflet-control {
          backdrop-filter: blur(6px);
          border-radius: 10px !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
        }
        
        .leaflet-control-zoom a {
          background-color: rgba(31, 41, 55, 0.85) !important;
          color: #fff !important;
          border-color: rgba(75, 85, 99, 0.5) !important;
          transition: all 0.2s ease !important;
        }
        
        .leaflet-control-zoom a:hover {
          background-color: rgba(59, 130, 246, 0.8) !important;
        }
        
        /* Remove all marker transitions in global styles */
        .leaflet-marker-icon, .leaflet-marker-shadow {
          transition: none !important;
          transform-origin: center bottom;
        }
        
        :global(.leaflet-custom-controls) {
          position: absolute;
          bottom: 95px;
          right: 10px;
          z-index: 1000;
        }
        
        :global(.leaflet-custom-control-container) {
          background: rgba(31, 41, 55, 0.85);
          border-radius: 10px;
          backdrop-filter: blur(8px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
          padding: 2px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          overflow: hidden;
        }
        
        :global(.custom-map-button) {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background: transparent;
          color: #fff;
          border: none;
          cursor: pointer;
          padding: 0;
          transition: all 0.3s ease;
        }
        
        :global(.custom-map-button:hover) {
}
      `}</style>
    </div>
  );
};

export default SensorMap;