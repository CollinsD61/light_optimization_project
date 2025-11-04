const db = require('../models');
const { Op } = require('sequelize');

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
      limit,
      offset,
      order,
      include: [{
        model: db.Sensor,
        as: 'sensor',
        attributes: ['id', 'name', 'location']
      }]
    });

    console.log(`Số lượng SensorData tìm thấy: ${count}`);

    res.json({
      count,
      results: rows,
      next: page * limit < count ? page + 1 : null,
      previous: page > 1 ? page - 1 : null
    });
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

    const { sensor_name, light_value, temperature, humidity, timestamp } = req.body;

    if (!sensor_name) {
      return res.status(400).json({ error: 'sensor_name is required' });
    }

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

    res.status(201).json({ 
      message: 'Dữ liệu đã được ghi thành công.',
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

module.exports = {
  getSensorData,
  getSingleSensorData,
  createSensorData,
  receiveSensorData,
  updateSensorData,
  deleteSensorData
};

