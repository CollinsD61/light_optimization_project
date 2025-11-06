const db = require('../models');
const { generateTokenPair } = require('../utils/jwt');
const { sendPasswordResetEmail } = require('../utils/emailService');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const config = require('../config/config');

const client = new OAuth2Client(config.google.clientId);

// Register new user
const register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists.' });
    }

    // Create new user
    const user = await db.User.create({
      email,
      password
      // name: name || null // Field doesn't exist in current schema
    });

    // Generate tokens
    const tokens = generateTokenPair(user.id);

    res.status(201).json({
      message: 'User registered successfully.',
      access: tokens.access,
      refresh: tokens.refresh
    });
  } catch (error) {
    next(error);
  }
};

// Login user
const login = async (req, res, next) => {
  try {
    console.log('Login API CALLED');
    const { email, password } = req.body;

    // Find user by email
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ detail: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ detail: 'User account is inactive' });
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ detail: 'Invalid credentials' });
    }

    // Update last login
    await user.update({ lastLogin: new Date() });

    // Generate tokens
    const tokens = generateTokenPair(user.id);

    res.json({
      access: tokens.access,
      refresh: tokens.refresh
    });
  } catch (error) {
    next(error);
  }
};

// Google OAuth login
const googleLogin = async (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: config.google.clientId
    });

    const payload = ticket.getPayload();
    const email = payload.email;
    // const name = payload.name || '';

    // Find or create user
    let user = await db.User.findOne({ where: { email } });

    if (!user) {
      // Create new user for Google OAuth
      // Use a random password that cannot be guessed (OAuth users don't use password login)
      const randomPassword = crypto.randomBytes(32).toString('hex');
      user = await db.User.create({
        email,
        // name, // Field doesn't exist in current schema
        password: randomPassword // Random password for OAuth users (they won't use it)
      });
    }

    // Update last login
    await user.update({ lastLogin: new Date() });

    // Generate tokens
    const tokens = generateTokenPair(user.id);

    res.json({
      access: tokens.access,
      refresh: tokens.refresh
    });
  } catch (error) {
    console.error('Google login error:', error);
    return res.status(400).json({ error: 'Invalid token' });
  }
};

// Forgot password - send reset email
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'Email not found' });
    }

    // Generate random token
    const token = crypto.randomBytes(32).toString('hex');

    // Save or update reset token
    await db.PasswordResetToken.destroy({ where: { userId: user.id } });
    await db.PasswordResetToken.create({
      userId: user.id,
      token
    });

    // Send email
    await sendPasswordResetEmail(email, token);

    res.json({ message: 'Password reset link sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    next(error);
  }
};

// Reset password with token
const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    // Find reset token
    const resetToken = await db.PasswordResetToken.findOne({
      where: { token },
      include: [{
        model: db.User,
        as: 'user'
      }]
    });

    if (!resetToken) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    // Check if token is expired (1 hour)
    const tokenAge = Date.now() - new Date(resetToken.createdAt).getTime();
    const oneHour = 60 * 60 * 1000;
    
    if (tokenAge > oneHour) {
      await resetToken.destroy();
      return res.status(400).json({ error: 'Token has expired' });
    }

    // Update user password
    const user = resetToken.user;
    await user.update({ password });

    // Delete used token
    await resetToken.destroy();

    res.json({ message: 'Password has been reset.' });
  } catch (error) {
    next(error);
  }
};

// Refresh token
const refreshToken = async (req, res, next) => {
  try {
    const { refresh } = req.body;

    if (!refresh) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(refresh, config.jwt.secret);

    if (decoded.type !== 'refresh') {
      return res.status(400).json({ error: 'Invalid token type' });
    }

    // Generate new access token
    const tokens = generateTokenPair(decoded.userId);

    res.json({
      access: tokens.access,
      refresh: tokens.refresh
    });
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired refresh token' });
  }
};

module.exports = {
  register,
  login,
  googleLogin,
  forgotPassword,
  resetPassword,
  refreshToken
};

