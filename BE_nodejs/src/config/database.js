require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'dohoang',
    database: process.env.DATABASE_NAME || 'sensors',
    host: process.env.DATABASE_HOST || 'localhost',
    port: process.env.DATABASE_PORT || 5432,
    dialect: 'postgres',
    logging: console.log,
  },
  production: {
    username: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'dohoang',
    database: process.env.DATABASE_NAME || 'sensors',
    host: process.env.DATABASE_HOST || 'db',
    port: process.env.DATABASE_PORT || 5432,
    dialect: 'postgres',
    logging: false,
  }
};

