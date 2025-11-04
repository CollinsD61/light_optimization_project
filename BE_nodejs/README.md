# IoT Sensor Backend API - Node.js

Backend API được migrate từ Django sang Node.js với Express và PostgreSQL.

## 🚀 Features

- ✅ RESTful API với Express.js
- ✅ PostgreSQL database với Sequelize ORM
- ✅ JWT Authentication
- ✅ Google OAuth 2.0 Login
- ✅ Email service (Password Reset)
- ✅ CORS configuration
- ✅ Pagination & Filtering
- ✅ Docker support

## 📁 Project Structure

```
BE_nodejs/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Sequelize models
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   ├── app.js           # Express app setup
│   └── server.js        # Server entry point
├── .env                 # Environment variables
├── Dockerfile           # Docker configuration
└── package.json         # Dependencies
```

## 📦 Installation

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (see `.env.example`)

3. Start PostgreSQL database

4. Run the server:
```bash
npm start          # Production
npm run dev        # Development with nodemon
```

### Docker

```bash
docker-compose up --build
```

## 🔗 API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `POST /api/users/google-login` - Google OAuth login
- `POST /api/users/forgot-password` - Request password reset
- `POST /api/users/reset-password` - Reset password with token

### Token
- `POST /api/token/refresh` - Refresh access token

### Sensors
- `GET /api/sensors/` - List all sensors
- `POST /api/sensors/` - Create sensor
- `GET /api/sensors/:id/` - Get sensor detail
- `PUT/PATCH /api/sensors/:id/` - Update sensor
- `DELETE /api/sensors/:id/` - Delete sensor

### Sensor Data
- `GET /api/sensor-data/` - List sensor data (with pagination & filters)
- `POST /api/sensor-data/` - Create sensor data
- `GET /api/sensor-data/:id/` - Get sensor data detail
- `PUT/PATCH /api/sensor-data/:id/` - Update sensor data
- `DELETE /api/sensor-data/:id/` - Delete sensor data
- `POST /api/receive-data/` - Receive data from IoT devices (public)

### Health Check
- `GET /api/health` - API health check

## 🔐 Environment Variables

See `env.example` for all required environment variables.

## 🗄️ Database

The application uses PostgreSQL with Sequelize ORM. Models are automatically synced with the existing Django database schema:

- `users_customuser` - User accounts
- `users_passwordresettoken` - Password reset tokens
- `sensors_sensor` - Sensor information
- `sensor_data_sensordata` - Sensor readings

## 🐳 Docker Deployment

The application is containerized and ready for deployment. Use the updated `docker-compose.yml` in the root directory.

## 📝 Migration Notes

Migrated from Django to Node.js:
- Django ORM → Sequelize ORM
- Django REST Framework → Express.js
- Django JWT → jsonwebtoken
- Django email backend → nodemailer
- All API endpoints remain compatible with existing frontend

## 👥 Authors

Migrated by AI Assistant from Django backend.

