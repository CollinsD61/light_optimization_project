require('dotenv').config();
const app = require('./app');
const db = require('./models');
const config = require('./config/config');

const PORT = config.port;

// Test database connection and start server
const startServer = async () => {
  try {
    // Test database connection
    await db.sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // Sync models (only in development, use migrations in production)
    if (config.nodeEnv === 'development') {
      // await db.sequelize.sync({ alter: true });
      console.log('⚠️  Using existing database schema (migrations recommended)');
    }

    // Start server
    app.listen(PORT, '0.0.0.0', () => {
      console.log('🚀 Server is running');
      console.log(`📍 Environment: ${config.nodeEnv}`);
      console.log(`🌐 Server URL: http://localhost:${PORT}`);
      console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
      console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

startServer();

