const { body, param, query, validationResult } = require('express-validator');

// Helper function to handle validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// User validation rules
const registerValidation = [
  body('email')
    .isEmail()
    .withMessage('Must be a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  validate
];

const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Must be a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  validate
];

const forgotPasswordValidation = [
  body('email')
    .isEmail()
    .withMessage('Must be a valid email'),
  validate
];

const resetPasswordValidation = [
  body('token')
    .notEmpty()
    .withMessage('Token is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  validate
];

// Sensor data validation
const sensorDataValidation = [
  body('sensor_name')
    .notEmpty()
    .withMessage('Sensor name is required'),
  body('light_value')
    .optional()
    .isFloat()
    .withMessage('Light value must be a number'),
  body('temperature')
    .optional()
    .isFloat()
    .withMessage('Temperature must be a number'),
  body('humidity')
    .optional()
    .isFloat()
    .withMessage('Humidity must be a number'),
  validate
];

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  sensorDataValidation
};

