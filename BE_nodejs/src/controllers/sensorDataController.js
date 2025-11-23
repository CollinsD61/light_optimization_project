const db = require('../models');
const { Op } = require('sequelize');
const BatteryService = require('../services/batteryService');
const { database } = require('../config/firebase');

// Get all sensor data with pagination and filtering
const getSensorData = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Build where clause for filtering
    const where = {};
    
    // Filter by sensor name
    if (req.query.sensor__name) {
      const sensor = await db.Sensor.findOne({ 
        where: { name: req.query.sensor__name } 
      });
      if (sensor) {
        where.sensorId = sensor.id;
      }
    }

    // Filter by timestamp
    if (req.query.timestamp) {
      where.timestamp = req.query.timestamp;
    }

    // Build order clause
    let order = [['timestamp', 'DESC']];
    if (req.query.ordering) {
      const orderField = req.query.ordering.startsWith('-') 
        ? req.query.ordering.substring(1)
        : req.query.ordering;
      const orderDirection = req.query.ordering.startsWith('-') ? 'DESC' : 'ASC';
      order = [[orderField, orderDirection]];
    }

    const { count, rows } = await db.SensorData.findAndCountAll({
      where,
      limit: 10000, // Tăng limit để lấy nhiều data cho frontend
      offset: 0,
      order,
      include: [{
        model: db.Sensor,
        as: 'sensor',
        attributes: ['id', 'name', 'location']
      }]
    });

    console.log(`Số lượng SensorData tìm thấy: ${count}`);

    // Trả về trực tiếp array để frontend tương thích
    // Frontend expect response.data là array, không phải object với results
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

// Get single sensor data
const getSingleSensorData = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const sensorData = await db.SensorData.findByPk(id, {
      include: [{
        model: db.Sensor,
        as: 'sensor',
        attributes: ['id', 'name', 'location']
      }]
    });
    
    if (!sensorData) {
      return res.status(404).json({ error: 'Sensor data not found' });
    }

    res.json(sensorData);
  } catch (error) {
    next(error);
  }
};

// Create new sensor data
const createSensorData = async (req, res, next) => {
  try {
    const { sensor_name, light_value, temperature, humidity, timestamp } = req.body;

    // Find or create sensor
    let sensor = await db.Sensor.findOne({ where: { name: sensor_name } });
    
    if (!sensor) {
      sensor = await db.Sensor.create({ 
        name: sensor_name,
        description: `Auto-created sensor: ${sensor_name}`
      });
    }

    // Create sensor data
    const sensorData = await db.SensorData.create({
      sensorId: sensor.id,
      lightValue: light_value,
      temperature,
      humidity,
      timestamp: timestamp || new Date()
    });

    res.status(201).json(sensorData);
  } catch (error) {
    next(error);
  }
};

// Receive sensor data from IoT devices (public endpoint)
const receiveSensorData = async (req, res, next) => {
  try {
    console.log('ReceiveSensorDataAPI được gọi.');
    console.log('Request data:', req.body);

    const { sensor_name, light_value, temperature, humidity, timestamp, test_mode } = req.body;

    if (!sensor_name) {
      return res.status(400).json({ error: 'sensor_name is required' });
    }

    // TEST MODE: Nếu test_mode = true, KHÔNG ghi vào database
    if (test_mode === true || test_mode === 'true') {
      console.log('🧪 TEST MODE: Data được nhận nhưng KHÔNG ghi vào database');
      
      // Validate data format
      const mockData = {
        id: 'test-' + Date.now(),
        sensorId: 'test-sensor-id',
        sensor_name: sensor_name,
        lightValue: light_value || null,
        temperature: temperature || null,
        humidity: humidity || null,
        timestamp: timestamp || new Date(),
        test_mode: true
      };

      return res.status(201).json({ 
        message: 'TEST MODE: Dữ liệu đã được nhận nhưng KHÔNG ghi vào database.',
        test_mode: true,
        data: mockData
      });
    }

    // NORMAL MODE: Ghi vào database như bình thường
    // Find or create sensor
    let sensor = await db.Sensor.findOne({ where: { name: sensor_name } });
    
    if (!sensor) {
      console.log(`Tạo sensor mới: ${sensor_name}`);
      sensor = await db.Sensor.create({ 
        name: sensor_name,
        description: `Auto-created sensor: ${sensor_name}`
      });
    }

    // Create sensor data
    const sensorData = await db.SensorData.create({
      sensorId: sensor.id,
      lightValue: light_value || null,
      temperature: temperature || null,
      humidity: humidity || null,
      timestamp: timestamp || new Date()
    });

    console.log('Dữ liệu đã được ghi thành công:', sensorData.id);

    // 📡 GHI NHẬN LẦN NHẬN DATA CUỐI CÙNG VÀO FIREBASE
    // Map sensor_name → Firebase sensor ID
    const sensorFirebaseId = 'hcm-device-01'; // TODO: Mapping logic if needed
    await BatteryService.recordDataReceived(sensorFirebaseId);

    res.status(201).json({ 
      message: 'Dữ liệu đã được ghi thành công.',
      test_mode: false,
      data: sensorData
    });
  } catch (error) {
    console.error('Lỗi trong receiveSensorData:', error);
    next(error);
  }
};

// Update sensor data
const updateSensorData = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { light_value, temperature, humidity } = req.body;

    const sensorData = await db.SensorData.findByPk(id);
    
    if (!sensorData) {
      return res.status(404).json({ error: 'Sensor data not found' });
    }

    await sensorData.update({
      lightValue: light_value !== undefined ? light_value : sensorData.lightValue,
      temperature: temperature !== undefined ? temperature : sensorData.temperature,
      humidity: humidity !== undefined ? humidity : sensorData.humidity
    });

    res.json(sensorData);
  } catch (error) {
    next(error);
  }
};

// Delete sensor data
const deleteSensorData = async (req, res, next) => {
  try {
    const { id } = req.params;

    const sensorData = await db.SensorData.findByPk(id);
    
    if (!sensorData) {
      return res.status(404).json({ error: 'Sensor data not found' });
    }

    await sensorData.destroy();

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// NEW: Get sensor data WITH battery level from Firebase
const getSensorDataWithBattery = async (req, res, next) => {
  try {
    console.log('[API] /api/sensor-data-with-battery called');
    
    // 1. Lấy sensor data từ database
    const { count, rows } = await db.SensorData.findAndCountAll({
      limit: 10000,
      offset: 0,
      order: [['timestamp', 'DESC']],
      include: [{
        model: db.Sensor,
        as: 'sensor',
        attributes: ['id', 'name', 'location']
      }]
    });
    
    const sensorData = rows.map(row => ({
      id: row.id,
      sensor_name: row.sensor ? row.sensor.name : 'Unknown',
      light_value: row.lightValue,
      temperature: row.temperature,
      humidity: row.humidity,
      timestamp: row.timestamp,
      location: row.sensor ? row.sensor.location : null
    }));
    
    console.log(`[API] Found ${count} sensor data records`);
    
    if (!sensorData || sensorData.length === 0) {
      console.log('[API] No sensor data found, returning empty array');
      return res.status(200).json({
        success: true,
        data: [],
        battery: null,
        message: 'No sensor data found'
      });
    }
    
    // 2. Lấy battery level từ Firebase (Backend tự động cập nhật mỗi 5 phút)
    const sensorId = 'hcm-device-01'; // Hardcoded for now
    let batteryLevel = 100;
    let batteryData = null;
    
    console.log('[API] Attempting to fetch battery from Firebase...');
    
    try {
      const batteryRef = database.ref(`sensors/${sensorId}/battery`);
      console.log('[API] Firebase ref created, calling once()...');
      
      // Set timeout for Firebase call (max 3 seconds)
      const batteryPromise = batteryRef.once('value');
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Firebase timeout')), 3000)
      );
      
      const snapshot = await Promise.race([batteryPromise, timeoutPromise]);
      console.log('[API] Firebase snapshot received');
      
      batteryData = snapshot.val();
      
      if (batteryData && batteryData.level !== undefined) {
        batteryLevel = batteryData.level;
        console.log(`[API] Retrieved battery level from Firebase: ${batteryLevel}%`);
      } else {
        console.log('[API] No battery data in Firebase, using default 100%');
      }
    } catch (firebaseError) {
      console.warn('[API] Firebase error (using default battery 100%):', firebaseError.message);
      // Continue with default battery level
    }
    
    console.log('[API] Battery fetch completed, preparing response...');
    
    console.log(`[API] Returning ${sensorData.length} records with battery: ${batteryLevel}%`);
    
    // 3. Trả về cho frontend
    return res.status(200).json({
      success: true,
      data: sensorData,
      battery: {
        level: batteryLevel,
        lastUpdated: batteryData ? batteryData.lastUpdated : Date.now(),
        timestamp: batteryData ? batteryData.timestamp : new Date().toISOString()
      },
      message: 'Data fetched successfully'
    });
    
  } catch (error) {
    console.error('[API] Error getting sensor data with battery:', error);
    console.error('[API] Error stack:', error.stack);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  getSensorData,
  getSingleSensorData,
  createSensorData,
  receiveSensorData,
  updateSensorData,
  deleteSensorData,
  getSensorDataWithBattery  // NEW endpoint
};

