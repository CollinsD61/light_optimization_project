const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const sensorRoutes = require('./sensorRoutes');
const tokenRoutes = require('./tokenRoutes');

// API routes
router.use('/users', authRoutes);
router.use('/', sensorRoutes);
router.use('/token', tokenRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'API is running' });
});

module.exports = router;

