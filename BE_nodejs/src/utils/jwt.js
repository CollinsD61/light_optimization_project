const jwt = require('jsonwebtoken');
const config = require('../config/config');

const generateAccessToken = (userId) => {
  return jwt.sign(
    { userId, type: 'access' },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
};

const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId, type: 'refresh' },
    config.jwt.secret,
    { expiresIn: config.jwt.refreshExpiresIn }
  );
};

const generateTokenPair = (userId) => {
  return {
    access: generateAccessToken(userId),
    refresh: generateRefreshToken(userId)
  };
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generateTokenPair,
  verifyToken
};

