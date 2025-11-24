const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensorController');
const sensorDataController = require('../controllers/sensorDataController');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const { iotLimiter, sensorDataLimiter } = require('../middleware/rateLimiter');

// Sensor routes
router.get('/sensors', authenticateToken, sensorController.getSensors);
router.get('/sensors/:id', authenticateToken, sensorController.getSensor);
router.post('/sensors', authenticateToken, sensorController.createSensor);
router.put('/sensors/:id', authenticateToken, sensorController.updateSensor);
router.patch('/sensors/:id', authenticateToken, sensorController.updateSensor);
router.delete('/sensors/:id', authenticateToken, sensorController.deleteSensor);

// Sensor data routes (with relaxed rate limiting for read operations)
router.get('/sensor-data', authenticateToken, sensorDataLimiter, sensorDataController.getSensorData);
router.get('/sensor-data/:id', authenticateToken, sensorDataLimiter, sensorDataController.getSingleSensorData);
router.post('/sensor-data', authenticateToken, sensorDataController.createSensorData);
router.put('/sensor-data/:id', authenticateToken, sensorDataController.updateSensorData);
router.patch('/sensor-data/:id', authenticateToken, sensorDataController.updateSensorData);
router.delete('/sensor-data/:id', authenticateToken, sensorDataController.deleteSensorData);

// NEW: Get sensor data with battery level (Frontend chỉ gọi endpoint này)
router.get('/sensor-data-with-battery', authenticateToken, sensorDataLimiter, sensorDataController.getSensorDataWithBattery);

// Public endpoint for IoT devices to send data (with rate limiting)
router.post('/receive-data', iotLimiter, sensorDataController.receiveSensorData);

module.exports = router;

