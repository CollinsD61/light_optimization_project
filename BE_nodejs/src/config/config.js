require('dotenv').config();

module.exports = {
  port: process.env.PORT || 8000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  jwt: {
    secret: process.env.JWT_SECRET || 'your_super_secret_jwt_key',
    expiresIn: process.env.JWT_EXPIRES_IN || '30m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '1d'
  },
  
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    },
    from: process.env.EMAIL_FROM
  },
  
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID
  },
  
  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:5173'
  },
  
  cors: {
    origins: process.env.CORS_ORIGINS 
      ? process.env.CORS_ORIGINS.split(',')
      : ['http://localhost:5173', 'http://127.0.0.1:5173']
  }
};

