# 📚 Django Backend - Technical Documentation Archive

**Archive Date:** November 6, 2025  
**Status:** ⚠️ **ARCHIVED - Replaced by Node.js Backend**  
**Purpose:** Technical reference for future migrations or rollback

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Database Models](#database-models)
5. [API Endpoints](#api-endpoints)
6. [Configuration](#configuration)
7. [Middleware & Security](#middleware--security)
8. [Deployment](#deployment)
9. [Dependencies](#dependencies)

---

## 🎯 Project Overview

### Django REST Framework Backend
- **Framework:** Django 5.2 + Django REST Framework 3.15.2
- **Database:** PostgreSQL
- **Authentication:** JWT (Simple JWT)
- **ORM:** Django ORM
- **Python Version:** Python 3.x

### Key Features
- ✅ User authentication (Register, Login, Google OAuth)
- ✅ JWT token-based authentication
- ✅ Sensor management (CRUD)
- ✅ Sensor data management with filtering/ordering
- ✅ Public IoT endpoint for receiving sensor data
- ✅ Email service for password reset
- ✅ CORS configuration for frontend

---

## 🛠️ Technology Stack

### Core Framework
```python
Django==5.2
djangorestframework==3.15.2
djangorestframework-simplejwt==5.4.0
```

### Database
```python
psycopg2-binary==2.9.10  # PostgreSQL adapter
```

### Authentication & Security
```python
PyJWT==2.8.0
google-auth-oauthlib==1.2.0
google-auth-httplib2==0.2.0
django-cors-headers==4.3.1
```

### Utilities
```python
python-dotenv==1.0.0
django-filter==24.3
gunicorn==21.2.0  # WSGI server
pytz  # Timezone support
```

---

## 📁 Project Structure

```
BE/
├── BE/                          # Main project folder
│   ├── __init__.py
│   ├── settings.py              # Project settings
│   ├── urls.py                  # Root URL configuration
│   ├── wsgi.py                  # WSGI entry point
│   └── asgi.py                  # ASGI entry point
│
├── api/                         # API app (sensor endpoints)
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── serializers.py           # DRF serializers
│   ├── views.py                 # API views
│   ├── urls.py                  # API routes
│   └── migrations/
│
├── users/                       # User authentication app
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py                # CustomUser, PasswordResetToken
│   ├── serializers.py
│   ├── views.py                 # Auth views
│   ├── urls.py                  # Auth routes
│   └── migrations/
│
├── sensors/                     # Sensor model app
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py                # Sensor model
│   └── migrations/
│
├── sensor_data/                 # Sensor data model app
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py                # SensorData model
│   └── migrations/
│
├── manage.py                    # Django CLI
├── requirements.txt             # Python dependencies
├── Dockerfile                   # Docker configuration
└── db.sqlite3                   # SQLite (dev only)
```

---

## 🗄️ Database Models

### 1. CustomUser Model (`users/models.py`)

```python
class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    
    objects = CustomUserManager()
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []
```

**Table Name:** `users_customuser`

**Fields:**
- `id` - Auto-increment primary key
- `email` - Unique email address (username field)
- `password` - Hashed password (PBKDF2)
- `name` - Optional user name
- `is_active` - Account status (default: True)
- `is_staff` - Staff access (default: False)
- `is_superuser` - Superuser access (default: False)
- `last_login` - Last login timestamp

**Custom Manager:**
```python
class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        # Normalize email, set password, save user
        
    def create_superuser(self, email, password=None, **extra_fields):
        # Create user with staff and superuser flags
```

---

### 2. PasswordResetToken Model (`users/models.py`)

```python
class PasswordResetToken(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    token = models.CharField(max_length=64, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
```

**Table Name:** `users_passwordresettoken`

**Fields:**
- `id` - Auto-increment primary key
- `user_id` - Foreign key to CustomUser
- `token` - Random 32-character token
- `created_at` - Token creation timestamp

**Usage:** Password reset functionality

---

### 3. Sensor Model (`sensors/models.py`)

```python
class Sensor(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    location = models.CharField(max_length=200, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

**Table Name:** `sensors_sensor`

**Fields:**
- `id` - Auto-increment primary key
- `name` - Unique sensor name (max 100 chars)
- `description` - Optional description
- `location` - Optional location string
- `created_at` - Auto-set on creation
- `updated_at` - Auto-update on modification

---

### 4. SensorData Model (`sensor_data/models.py`)

```python
class SensorData(models.Model):
    sensor = models.ForeignKey(Sensor, on_delete=models.CASCADE, related_name='data_points')
    timestamp = models.DateTimeField(default=timezone.now)
    light_value = models.FloatField(null=True, blank=True)
    temperature = models.FloatField(null=True, blank=True)
    humidity = models.FloatField(null=True, blank=True)
    
    class Meta:
        ordering = ['-timestamp']
```

**Table Name:** `sensor_data_sensordata`

**Fields:**
- `id` - Auto-increment primary key
- `sensor_id` - Foreign key to Sensor (CASCADE delete)
- `timestamp` - Data timestamp (default: now)
- `light_value` - Light sensor value (nullable)
- `temperature` - Temperature in Celsius (nullable)
- `humidity` - Humidity percentage (nullable)

**Default Ordering:** Newest first (`-timestamp`)

---

## 🌐 API Endpoints

### Authentication Endpoints (`/api/users/`)

```python
# users/urls.py
urlpatterns = [
    path('register/', register_user, name='register'),
    path('login/', login_user, name='login'),
    path('google-login/', google_login),
    path('forgot-password/', forgot_password, name='forgot-password'),
    path('reset-password/<uidb64>/<token>/', reset_password, name='reset-password'),
]
```

#### 1. Register User
```http
POST /api/users/register/
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "message": "User registered successfully.",
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

#### 2. Login User
```http
POST /api/users/login/
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

#### 3. Google OAuth Login
```http
POST /api/users/google-login/
Content-Type: application/json

{
  "token": "google_id_token_here"
}

Response:
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

#### 4. Forgot Password
```http
POST /api/users/forgot-password/
Content-Type: application/json

{
  "email": "user@example.com"
}

Response:
{
  "message": "Password reset link sent."
}
```

#### 5. Reset Password
```http
POST /api/users/reset-password/<uidb64>/<token>/
Content-Type: application/json

{
  "password": "new_password123"
}

Response:
{
  "message": "Password has been reset."
}
```

---

### Token Endpoints (`/api/token/`)

```python
# BE/urls.py
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
```

#### Refresh Token
```http
POST /api/token/refresh/
Content-Type: application/json

{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}

Response:
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

---

### Sensor Endpoints (`/api/sensors/`)

```python
# api/urls.py - Sensor routes
path('sensors/', SensorListCreateView.as_view(), name='sensor-list-create'),
path('sensors/<int:pk>/', SensorRetrieveUpdateDestroyView.as_view(), name='sensor-retrieve-update-destroy'),
```

#### List/Create Sensors
```http
GET /api/sensors/
Authorization: Bearer <access_token>

Response:
{
  "count": 10,
  "next": "http://api/sensors/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "DHT11_01",
      "description": "Temperature sensor",
      "location": "Room 1",
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-01-01T00:00:00Z"
    }
  ]
}
```

```http
POST /api/sensors/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "DHT11_02",
  "description": "Humidity sensor",
  "location": "Room 2"
}
```

#### Get/Update/Delete Sensor
```http
GET /api/sensors/1/
PUT /api/sensors/1/
PATCH /api/sensors/1/
DELETE /api/sensors/1/
Authorization: Bearer <access_token>
```

---

### Sensor Data Endpoints (`/api/sensor-data/`)

```python
# api/urls.py - Sensor Data routes
path('sensor-data/', SensorDataListCreateView.as_view(), name='sensor-data-list-create'),
path('sensor-data/<int:pk>/', SensorDataRetrieveUpdateDestroyView.as_view(), name='sensor-data-retrieve-update-destroy'),
path('receive-data/', ReceiveSensorDataAPIView.as_view(), name='receive-sensor-data'),
```

#### List Sensor Data (with Filtering)
```http
GET /api/sensor-data/
Authorization: Bearer <access_token>

Query Parameters:
- sensor__name: Filter by sensor name
- timestamp: Filter by timestamp
- ordering: Order by field (e.g., temperature, -humidity)
- page: Page number

Example:
GET /api/sensor-data/?sensor__name=DHT11_01&ordering=-timestamp&page=1

Response:
{
  "count": 100,
  "next": "...",
  "previous": null,
  "results": [
    {
      "id": 1,
      "sensor": {
        "id": 1,
        "name": "DHT11_01",
        "location": "Room 1"
      },
      "timestamp": "2025-01-01T12:00:00Z",
      "light_value": 750.5,
      "temperature": 25.5,
      "humidity": 60.2
    }
  ]
}
```

#### IoT Data Receiver (Public Endpoint)
```http
POST /api/receive-data/
Content-Type: application/json
# NO AUTHENTICATION REQUIRED

{
  "sensor_name": "DHT11_01",
  "light_value": 750.5,
  "temperature": 25.5,
  "humidity": 60.2,
  "timestamp": "2025-01-01T12:00:00Z"
}

Response:
{
  "message": "Dữ liệu đã được ghi thành công."
}
```

**Features:**
- ❌ No authentication required
- ✅ Auto-creates sensor if not exists
- ✅ Validates input data
- ✅ Returns 201 on success

---

## ⚙️ Configuration

### Settings (`BE/settings.py`)

#### Secret Key
```python
SECRET_KEY = 'django-insecure-66jro-01_#xah@3os$^6e-x%b4$qyw%r+o*)w78bg9sbl@m2fj'
DEBUG = True
```

#### Allowed Hosts
```python
ALLOWED_HOSTS = [
    'lightoptimization.io.vn',
    'api.lightoptimization.io.vn', 
    'www.lightoptimization.io.vn', 
    'localhost', 
    '127.0.0.1'
]
```

#### Installed Apps
```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',              # Django REST Framework
    'corsheaders',                 # CORS headers
    'api',                         # API app
    'sensors',                     # Sensors app
    'sensor_data',                 # Sensor data app
    'users',                       # Users app
    'rest_framework_simplejwt',    # JWT authentication
]
```

#### Middleware
```python
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Must be first
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
```

#### Database Configuration
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv("DATABASE_NAME", "sensors"),
        'USER': os.getenv("DATABASE_USER", "postgres"),
        'PASSWORD': os.getenv("DATABASE_PASSWORD", "dohoang"),
        'HOST': os.getenv("DATABASE_HOST", "db"),  # Docker service name
        'PORT': os.getenv("DATABASE_PORT", "5432"),
    }
}
```

#### CORS Configuration
```python
CORS_ALLOWED_ORIGINS = [
    "https://lightoptimization.io.vn",  # Production frontend
    "http://localhost:5173",            # Development frontend
    "http://127.0.0.1:5173",
]
CORS_ALLOW_CREDENTIALS = True
```

#### REST Framework Configuration
```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend'
    ]
}
```

#### Simple JWT Configuration
```python
from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=30),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ROTATE_REFRESH_TOKEN': False,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': False,
}
```

#### Email Configuration
```python
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'your_real_email@gmail.com'
EMAIL_HOST_PASSWORD = 'your_app_password_here'
DEFAULT_FROM_EMAIL = 'your_real_email@gmail.com'
```

#### Google OAuth
```python
GOOGLE_CLIENT_ID = '1035731953101-ubmukhc15mg1o4uu0vaq6aib5jnjqbte.apps.googleusercontent.com'
```

#### Logging Configuration
```python
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        '': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': True,
        },
        'api.views': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}
```

---

## 🔐 Middleware & Security

### Authentication
- **Type:** JWT (JSON Web Token)
- **Library:** djangorestframework-simplejwt
- **Token Lifetime:** 
  - Access: 30 minutes
  - Refresh: 1 day

### Password Hashing
- **Algorithm:** PBKDF2 (Django default)
- **Validators:**
  - UserAttributeSimilarityValidator
  - MinimumLengthValidator
  - CommonPasswordValidator
  - NumericPasswordValidator

### CORS Protection
- **Library:** django-cors-headers
- **Allowed Origins:** Whitelist specific domains
- **Credentials:** Allowed (for cookies/auth headers)

### CSRF Protection
- **Enabled:** Yes (Django default)
- **Middleware:** CsrfViewMiddleware

---

## 🐳 Deployment

### Dockerfile
```dockerfile
FROM python:alpine

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn

COPY . .

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "BE.wsgi:application"]
```

### Docker Compose Service
```yaml
backend:
  build: ./BE
  ports:
    - "8000:8000"
  depends_on:
    - db
  environment:
    - DATABASE_NAME=sensors
    - DATABASE_USER=postgres
    - DATABASE_PASSWORD=dohoang
    - DATABASE_HOST=db
    - DATABASE_PORT=5432
```

### WSGI Server
- **Server:** Gunicorn
- **Workers:** Default (auto-detected)
- **Bind:** 0.0.0.0:8000

---

## 📦 Dependencies

### requirements.txt
```
asgiref
Django
django-cors-headers
djangorestframework
djangorestframework-simplejwt
PyJWT
pytz
psycopg2-binary
python-dotenv
django-filter
google-auth-oauthlib
google-auth-httplib2
gunicorn
```

### Specific Versions (used in production)
- Django: 5.2
- djangorestframework: 3.15.2
- djangorestframework-simplejwt: 5.4.0
- psycopg2-binary: 2.9.10
- django-cors-headers: 4.3.1
- PyJWT: 2.8.0

---

## 🔄 Migration History

### Initial Migrations
```bash
python manage.py makemigrations users
python manage.py makemigrations sensors
python manage.py makemigrations sensor_data
python manage.py migrate
```

### Migration Files Created
- `users/migrations/0001_initial.py` - CustomUser, PasswordResetToken
- `sensors/migrations/0001_initial.py` - Sensor model
- `sensor_data/migrations/0001_initial.py` - SensorData model

---

## 📊 Database Schema

```sql
-- users_customuser
CREATE TABLE users_customuser (
    id SERIAL PRIMARY KEY,
    email VARCHAR(254) UNIQUE NOT NULL,
    password VARCHAR(128),
    name VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    is_staff BOOLEAN DEFAULT FALSE,
    is_superuser BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP
);

-- users_passwordresettoken
CREATE TABLE users_passwordresettoken (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users_customuser(id) ON DELETE CASCADE,
    token VARCHAR(64) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- sensors_sensor
CREATE TABLE sensors_sensor (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    location VARCHAR(200),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- sensor_data_sensordata
CREATE TABLE sensor_data_sensordata (
    id SERIAL PRIMARY KEY,
    sensor_id INTEGER REFERENCES sensors_sensor(id) ON DELETE CASCADE,
    timestamp TIMESTAMP DEFAULT NOW(),
    light_value FLOAT,
    temperature FLOAT,
    humidity FLOAT
);

CREATE INDEX idx_sensor_data_sensor_id ON sensor_data_sensordata(sensor_id);
CREATE INDEX idx_sensor_data_timestamp ON sensor_data_sensordata(timestamp);
```

---

## 🚀 Running the Backend

### Development
```bash
# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run development server
python manage.py runserver 0.0.0.0:8000
```

### Production (Docker)
```bash
# Build image
docker build -t django-backend .

# Run container
docker run -p 8000:8000 \
  -e DATABASE_HOST=db \
  -e DATABASE_NAME=sensors \
  -e DATABASE_USER=postgres \
  -e DATABASE_PASSWORD=dohoang \
  django-backend
```

---

## 📝 Key Implementation Details

### Auto-create Sensor on Data Receipt
```python
# api/serializers.py
def create(self, validated_data):
    sensor_name = validated_data.pop('sensor_name')
    sensor, created = Sensor.objects.get_or_create(name=sensor_name)
    return SensorData.objects.create(sensor=sensor, **validated_data)
```

### Password Hashing Hook
```python
# users/models.py
def create_user(self, email, password=None, **extra_fields):
    user = self.model(email=email, **extra_fields)
    user.set_password(password)  # Auto-hashes with PBKDF2
    user.save(using=self._db)
    return user
```

### JWT Token Generation
```python
# users/views.py
from rest_framework_simplejwt.tokens import RefreshToken

user = authenticate(request, email=username, password=password)
if user is not None:
    refresh = RefreshToken.for_user(user)
    return Response({
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    })
```

---

## ⚠️ Known Issues & Limitations

1. **Public IoT Endpoint** - No authentication, vulnerable to spam
2. **No Rate Limiting** - Vulnerable to brute force attacks
3. **Hardcoded Secrets** - SECRET_KEY in settings.py
4. **No Logging Framework** - Only console output
5. **Email Service** - Not configured (placeholder values)
6. **No Health Check Endpoint** - Can't monitor service status

---

## 🔄 Migration to Node.js

**Date:** November 6, 2025  
**Status:** ✅ Complete

All functionality has been successfully migrated to Node.js backend (`BE_nodejs/`).

See migration documentation:
- `documents/BE/FINAL_MIGRATION_REPORT.md`
- `documents/BE/MIGRATION_VERIFICATION.md`
- `documents/BE/MIGRATION_SUMMARY.md`

---

## 📚 Additional Resources

### Django Documentation
- [Django Official Docs](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Simple JWT](https://django-rest-framework-simplejwt.readthedocs.io/)

### Code References
- Django Backend: `/BE/` (archived)
- Node.js Backend: `/BE_nodejs/` (current)

---

**Document Version:** 1.0.0  
**Last Updated:** November 6, 2025  
**Maintained By:** Project Team  
**Status:** 📁 ARCHIVED FOR REFERENCE ONLY

