const jwt = require('jsonwebtoken');
const config = require('../config/config');
const db = require('../models');

// Middleware để verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ detail: 'No token provided' });
    }

    const decoded = jwt.verify(token, config.jwt.secret);
    
    // Tìm user trong database
    const user = await db.User.findByPk(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ detail: 'User not found' });
    }

    if (!user.isActive) {
      return res.status(401).json({ detail: 'User is inactive' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ detail: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ detail: 'Token expired' });
    }
    return res.status(500).json({ error: 'Authentication error' });
  }
};

// Middleware cho public routes (không bắt buộc token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, config.jwt.secret);
      const user = await db.User.findByPk(decoded.userId);
      if (user && user.isActive) {
        req.user = user;
      }
    }
  } catch (error) {
    // Ignore errors for optional auth
  }
  next();
};

module.exports = {
  authenticateToken,
  optionalAuth
};

