const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation
} = require('../middleware/validators');

// POST /api/users/register
router.post('/register', registerValidation, authController.register);

// POST /api/users/login
router.post('/login', loginValidation, authController.login);

// POST /api/users/google-login
router.post('/google-login', authController.googleLogin);

// POST /api/users/forgot-password
router.post('/forgot-password', forgotPasswordValidation, authController.forgotPassword);

// POST /api/users/reset-password
router.post('/reset-password', resetPasswordValidation, authController.resetPassword);

module.exports = router;

