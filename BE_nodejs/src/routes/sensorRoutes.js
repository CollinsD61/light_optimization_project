const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensorController');
const sensorDataController = require('../controllers/sensorDataController');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

// Sensor routes
router.get('/sensors', authenticateToken, sensorController.getSensors);
router.get('/sensors/:id', authenticateToken, sensorController.getSensor);
router.post('/sensors', authenticateToken, sensorController.createSensor);
router.put('/sensors/:id', authenticateToken, sensorController.updateSensor);
router.patch('/sensors/:id', authenticateToken, sensorController.updateSensor);
router.delete('/sensors/:id', authenticateToken, sensorController.deleteSensor);

// Sensor data routes
router.get('/sensor-data', authenticateToken, sensorDataController.getSensorData);
router.get('/sensor-data/:id', authenticateToken, sensorDataController.getSingleSensorData);
router.post('/sensor-data', authenticateToken, sensorDataController.createSensorData);
router.put('/sensor-data/:id', authenticateToken, sensorDataController.updateSensorData);
router.patch('/sensor-data/:id', authenticateToken, sensorDataController.updateSensorData);
router.delete('/sensor-data/:id', authenticateToken, sensorDataController.deleteSensorData);

// Public endpoint for IoT devices to send data
router.post('/receive-data', sensorDataController.receiveSensorData);

module.exports = router;

