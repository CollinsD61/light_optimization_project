const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/token/refresh - Refresh access token
router.post('/refresh', authController.refreshToken);

module.exports = router;

