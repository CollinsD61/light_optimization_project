const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation
} = require('../middleware/validators');
const {
  authLimiter,
  registerLimiter,
  passwordResetLimiter
} = require('../middleware/rateLimiter');

// POST /api/users/register
router.post('/register', registerLimiter, registerValidation, authController.register);

// POST /api/users/login
router.post('/login', authLimiter, loginValidation, authController.login);

// POST /api/users/google-login
router.post('/google-login', authLimiter, authController.googleLogin);

// POST /api/users/forgot-password
router.post('/forgot-password', passwordResetLimiter, forgotPasswordValidation, authController.forgotPassword);

// POST /api/users/reset-password
router.post('/reset-password', passwordResetLimiter, resetPasswordValidation, authController.resetPassword);

module.exports = router;

