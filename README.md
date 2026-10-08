# 🌱 Light Optimization Project - Hệ Thống IoT Giám Sát & Tối Ưu Hóa Ánh Sáng Nông Nghiệp Thông Minh

> **Nền tảng IoT toàn diện ứng dụng trong nông nghiệp công nghệ cao** — Giám sát vi khí hậu, phân tích dữ liệu cảm biến đa phổ, quản lý thời lượng pin và tối ưu hóa năng lượng chiếu sáng nhân tạo (chuyên biệt cho canh tác cây thanh long).

[![Backend Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-green.svg)](https://nodejs.org/)
[![Frontend React](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Vite-blue.svg)](https://react.dev/)
[![Database PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%2015-336791.svg)](https://www.postgresql.org/)
[![Realtime Firebase](https://img.shields.io/badge/Realtime-Firebase-orange.svg)](https://firebase.google.com/)
[![E2E Testing Playwright](https://img.shields.io/badge/Testing-Playwright-45ba4b.svg)](https://playwright.dev/)
[![Docker Ready](https://img.shields.io/badge/Docker-Compose-2496ED.svg)](https://www.docker.com/)

---

## 📌 Mục Lục
1. [Giới Thiệu Đề Tài & Bài Toán Thực Tế](#-giới-thiệu-đề-tài--bài-toán-thực-tế)
2. [Kiến Trúc Hệ Thống (System Architecture)](#-kiến-trúc-hệ-thống-system-architecture)
3. [Các Phân Hệ & Tính Năng Trọng Tâm](#-các-phân-hệ--tính-năng-trọng-tâm)
4. [Công Nghệ Sử Dụng (Tech Stack)](#-công-nghệ-sử-dụng-tech-stack)
5. [Cấu Trúc Thư Mục Dự Án](#-cấu-trúc-thư-mục-dự-án)
6. [Hướng Dẫn Cài Đặt & Vận Hành](#-hướng-dẫn-cài-đặt--vận-hành)
7. [Đặc Tả API & Dữ Liệu IoT](#-đặc-tả-api--dữ-liệu-iot)
8. [Kiểm Thử & CI/CD (QA & DevOps)](#-kiểm-thử--cicd-qa--devops)
9. [Đánh Giá Chất Lượng & Định Hướng Phát Triển](#-đánh-giá-chất-lượng--định-hướng-phát-triển)

---

## 📖 Giới Thiệu Đề Tài & Bài Toán Thực Tế

### 1. Bối cảnh thực tế
Tại các vùng trồng thanh long trọng điểm của Việt Nam (tiêu biểu như Bình Thuận / Phan Thiết, Long An, Tiền Giang), việc **xông đèn (chong đèn kích thích ra hoa trái vụ)** là kỹ thuật bắt buộc để nâng cao năng suất và giá trị kinh tế. Tuy nhiên, phương pháp canh tác truyền thống đang đối mặt với các thách thức lớn:
- **Lãng phí điện năng nghiêm trọng**: Người nông dân thường bật đèn theo cảm tính hoặc hẹn giờ cố định mà không căn cứ vào điều kiện vi khí hậu, dẫn đến chi phí năng lượng chiếm tỉ trọng rất lớn trong chi phí sản xuất.
- **Thiếu dữ liệu thời gian thực**: Khó theo dõi cường độ quang phổ, độ ẩm, nhiệt độ theo từng giai đoạn sinh trưởng của cây trên các diện tích canh tác quy mô lớn.
- **Rủi ro gián đoạn thiết bị**: Cảm biến ngoài đồng ruộng chạy bằng pin/năng lượng mặt trời dễ bị hụt nguồn, mất kết nối mạng nhưng không được cảnh báo kịp thời.

### 2. Mục tiêu giải pháp của đề tài
Dự án **Light Optimization Project** giải quyết bài toán trên bằng mô hình tích hợp IoT, điện toán đám mây và web trực quan:
- **Tự động thu thập dữ liệu vi khí hậu liên tục**: Đo cường độ sáng (*lux/quang phổ đa dải*), nhiệt độ (°C) và độ ẩm (%) từ mạng lưới cảm biến trường.
- **Cơ chế Gateway thông minh**: Tiếp nhận dữ liệu qua giao thức MQTT từ các vi điều khiển (ESP8266, ESP32, Arduino), tự động phục hồi kết nối và chuyển tiếp lên máy chủ đám mây.
- **Tự động quản lý cảm biến & thuật toán tính pin**: Tự động nhận diện thiết bị mới (*Auto-create sensor*), mô hình hóa hao hụt pin (*Battery Decay Model*) và giám sát trạng thái sống/chết (*Heartbeat & Timeout*).
- **Hỗ trợ tối ưu hóa năng lượng**: Phân tích dữ liệu lịch sử để nông hộ và chuyên gia xác định chu kỳ chiếu sáng tối ưu, giúp tiết kiệm tới 30-35% điện năng mà vẫn đảm bảo năng suất cây trồng.

---

## 🏗️ Kiến Trúc Hệ Thống (System Architecture)

Hệ thống hoạt động theo mô hình phân tầng chuẩn công nghiệp khép kín từ thiết bị phần cứng tới người dùng cuối:

```
[ Field Sensor Nodes ]
  ├── Cảm biến quang phổ/ánh sáng (LDR, AS7341, UV)
  ├── Cảm biến nhiệt độ & độ ẩm (DHT22 / SHT)
  └── Vi điều khiển phát tín hiệu (ESP8266, ESP32, Arduino)
               │ (MQTT / Wi-Fi / ZigBee)
               ▼
[ Local Gateway Client ] (client/client.py)
  ├── MQTT Broker Subscriber (Topic: sensor/data)
  ├── Network Keep-alive & Auto-reconnect Mechanism
  └── Payload Standardization & HTTP Forwarder
               │ (HTTPS POST /api/receive-data)
               ▼
[ Node.js Backend Server ] (BE_nodejs)
  ├── RESTful API Endpoints + Rate Limiting Guard
  ├── JWT Auth & Google OAuth 2.0 Integration
  ├── Sequelize ORM & Data Validation
  ├── Battery Life Calculation & Health Engine
  └── Background Cron Job (batteryUpdateJob.js)
         │                           │
         ▼                           ▼
[ PostgreSQL Database ]     [ Firebase Realtime DB ]
 (Bản ghi cảm biến, Users)   (Trạng thái Pin, Heartbeat)
         │
         ▼ (REST API / Bearer Token)
[ React Frontend SPA ] (FE)
  ├── Landing Page giới thiệu nghiên cứu ứng dụng AI
  ├── Dashboard biểu đồ Recharts (Thời gian thực & Phân tích xu hướng)
  ├── Bản đồ số hóa Leaflet (Giám sát trạm cảm biến theo GPS, vẽ vùng)
  ├── Quản trị cảnh báo ngưỡng (Alarms & Notifications)
  └── Trình điều khiển đa ngôn ngữ, Dark/Light Mode
```

---

## ✨ Các Phân Hệ & Tính Năng Trọng Tâm

### 1. Phân hệ IoT Gateway (`client/client.py`)
- **MQTT Bridge**: Lắng nghe dữ liệu phát ra từ vi điều khiển theo thời gian thực.
- **Tự phục hồi kết nối (Self-Healing Connection)**: Cơ chế kiểm tra kết nối mạng (ping socket Google DNS `8.8.8.8`), chờ MQTT Broker sẵn sàng trước khi kết nối, tự động kết nối lại khi rớt mạng với số lần thử vô hạn.
- **Chuẩn hóa dữ liệu**: Tự động ánh xạ các trường (ví dụ chuyển đổi `light` thành `light_value`), gán định danh cảm biến và gửi qua HTTP API Backend.

### 2. Phân hệ Backend (`BE_nodejs`)
- **Kiến trúc chuyển đổi hoàn thiện**: Đã di chuyển thành công 100% từ Django REST Framework sang Node.js (Express), tương thích hoàn hảo với cơ sở dữ liệu và ứng dụng khách.
- **Public IoT Ingestion Endpoint (`/api/receive-data`)**: Tiếp nhận dữ liệu từ cảm biến không cần đăng nhập phức tạp, có cơ chế `auto-create` tự động đăng ký cảm biến vào hệ thống khi có tín hiệu mới.
- **Thuật toán tính hao tổn pin (`batteryService.js`)**: Mô hình hóa tỷ lệ hao pin theo thời gian thực, cập nhật vào Firebase Realtime DB và tự động đánh dấu cảm biến ngừng hoạt động nếu không nhận được dữ liệu quá 70 phút.
- **Bảo mật đa tầng**:
  - Mã hóa mật khẩu người dùng với `bcryptjs`.
  - Cơ chế xác thực cặp token JWT (Access Token 30 phút, Refresh Token 1 ngày).
  - Tích hợp đăng nhập bằng tài khoản Google (OAuth 2.0).
  - Tích hợp Rate Limiting chống spam/tấn công từ chối dịch vụ (DDoS) vào cả endpoint IoT và Auth.

### 3. Phân hệ Frontend (`FE`)
- **Trang giới thiệu công nghệ (Landing Page)**: Giao diện hiện đại có video nền chất lượng cao, giới thiệu tổng quan đề tài, bài báo khoa học về ứng dụng AI & Raspberry Pi trong nông nghiệp thông minh.
- **Trung tâm điều khiển (Home & Quick Stats)**: Giám sát tức thì các chỉ số nhiệt độ, độ ẩm, độ rọi sáng, tỷ lệ phần trăm pin còn lại và danh sách cảnh báo vi khí hậu nhanh.
- **Phân tích biểu đồ chuyên sâu (Dashboard)**:
  - Tích hợp biểu đồ tương tác: Đồ thị đường (LineChart), vùng (AreaChart), cột (BarChart) biểu diễn biến thiên nhiệt độ, độ ẩm, độ rọi theo thời gian.
  - Bộ lọc dữ liệu nhanh: Xem theo 1 ngày, 7 ngày, 15 ngày, 30 ngày, 2 tháng hoặc tùy chọn khoảng ngày cụ thể.
  - Xuất dữ liệu báo cáo: Hỗ trợ kết xuất toàn bộ dữ liệu đo đạc ra định dạng file `.csv` phục vụ nghiên cứu và phân tích ngoại tuyến.
- **Bản đồ giám sát trạm cảm biến (Sensor Map)**:
  - Hiển thị vị trí thực tế của từng trạm cảm biến trên nền bản đồ Leaflet.
  - Icon cảm biến động theo loại thiết bị (nhiệt độ, độ ẩm, ánh sáng, gateway), hiển thị mức pin trực tiếp ngay trên biểu tượng trạm.
  - Tích hợp công cụ vẽ đa giác và đo đạc không gian nông nghiệp (`leaflet-draw`).
- **Hệ thống cảnh báo (Alarms)**:
  - Tự động kích hoạt thông báo khi các giá trị vượt ngưỡng an toàn (ví dụ: nhiệt độ > 30°C, thiếu sáng < 100 lux, độ ẩm < 30% hoặc > 80%).
  - Phân loại cảnh báo theo độ ưu tiên (High, Medium, Low) và bộ lọc theo trạng thái kích hoạt.
- **Tùy biến trải nghiệm người dùng**:
  - Chuyển đổi giao diện Sáng / Tối (Light Mode / Dark Mode).
  - Hỗ trợ đa ngôn ngữ: Tiếng Việt, Tiếng Anh, Tiếng Trung, Tiếng Nhật.

---

## 💻 Công Nghệ Sử Dụng (Tech Stack)

| Hạng mục | Công nghệ | Chi tiết sử dụng |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite | Nền tảng Single Page Application tốc độ cao |
| **Giao diện & UI** | Tailwind CSS, Lucide Icons, AOS | Thiết kế Responsive, hiệu ứng chuyển động mượt mà |
| **Bản đồ & Biểu đồ**| Leaflet, React-Leaflet, Recharts | Bản đồ vệ tinh/địa hình & Biểu đồ phân tích dữ liệu |
| **Backend API** | Node.js, Express.js | Xử lý yêu cầu bất đồng bộ I/O hiệu năng cao |
| **ORM & Database** | Sequelize, PostgreSQL 15 | Quản lý dữ liệu quan hệ, quan hệ khoá ngoại, migrate |
| **Realtime State** | Firebase Realtime Database | Lưu trữ trạng thái pin, timestamp gói tin gần nhất |
| **IoT Protocol** | MQTT, HTTP REST | Giao thức truyền tin siêu nhẹ cho thiết bị nhúng |
| **IoT Gateway** | Python 3, Paho-MQTT, Requests | Cầu nối nhận tin MQTT và đẩy REST API |
| **Testing** | Playwright E2E | Bộ kiểm thử tự động toàn diện giao diện & API |
| **DevOps** | Docker, Docker Compose | Đóng gói môi trường đồng nhất (Local & Production) |
| **CI/CD** | GitHub Actions, Discord Webhook | Tự động kiểm thử song song & gửi báo cáo kết quả |

---

## 📁 Cấu Trúc Thư Mục Dự Án

```
light_optimization_project/
├── .github/
│   └── workflows/              # Kịch bản CI/CD GitHub Actions (test.yml, update.yml)
├── BE_nodejs/                  # Mã nguồn Backend Node.js (Active)
│   ├── config/                 # Cấu hình Database, Firebase, Database Sequelize
│   ├── controllers/            # Bộ xử lý nghiệp vụ (Auth, Sensor, SensorData)
│   ├── middleware/             # Middleware xác thực JWT, Rate Limiter, Error Handler
│   ├── models/                 # Mô hình dữ liệu ORM (User, Sensor, SensorData, Token)
│   ├── routes/                 # Định tuyến API (Auth, Sensor, IoT)
│   ├── services/               # Nghiệp vụ chuyên biệt (BatteryService)
│   ├── jobs/                   # Tác vụ định kỳ (Cron job cập nhật pin)
│   └── Dockerfile              # Container đóng gói Backend
├── FE/                         # Mã nguồn Frontend React SPA
│   ├── src/
│   │   ├── auth/               # Các trang Login, Register, Forgot Password
│   │   ├── components/         # Các thành phần giao diện dùng chung (MainLayout, Sidebar, ...)
│   │   ├── intro/              # Landing page giới thiệu đề tài, bài báo khoa học
│   │   ├── pages/              # Các trang chính (Dashboard, Map, Alarms, Settings, Home)
│   │   ├── utils/              # Tiện ích bổ trợ (Rate limit handler, v.v.)
│   │   └── api.js              # Cấu hình gọi API tập trung
│   └── Dockerfile              # Container đóng gói Frontend
├── client/                     # Mã nguồn Gateway Client
│   └── client.py               # Cầu nối nhận dữ liệu MQTT từ vi điều khiển gửi về Backend
├── documents/                  # Thư viện tài liệu kỹ thuật hoàn chỉnh
│   ├── BE/                     # Hướng dẫn di trú Django -> Node.js, tài liệu API
│   ├── FE/                     # Báo cáo tương thích Frontend, quy chuẩn API IoT
│   ├── QA/                     # Hướng dẫn kiểm thử Playwright, kịch bản E2E
│   ├── CI-CD/                  # Thiết lập thông báo tự động Discord & CI
│   └── Improve/                # Đánh giá chất lượng mã nguồn & bảo mật
├── playwright/                 # Bộ kiểm thử tự động End-to-End
│   ├── pages/                  # Mô hình Page Object Model (POM)
│   ├── tests/                  # Kịch bản kiểm thử API, Auth, Dashboard, Map
│   └── playwright.config.js    # Cấu hình kiểm thử đa trình duyệt
├── docker-compose.yml          # Cấu hình triển khai hệ thống (Production)
├── docker-compose.local.yml    # Cấu hình phát triển cục bộ (Local Development)
├── FINAL_STATUS.md             # Báo cáo nghiệm thu kết quả kiểm thử & vận hành
└── sonar-project.properties    # Cấu hình phân tích mã nguồn SonarQube
```

---

## 🚀 Hướng Dẫn Cài Đặt & Vận Hành

### Cách 1: Khởi chạy nhanh bằng Docker Compose (Khuyên dùng)

Hệ thống đã được đóng gói sẵn để chạy với 1 lệnh duy nhất:

```bash
# 1. Sao chép dự án về máy
git clone <repository_url>
cd light_optimization_project

# 2. Khởi chạy toàn bộ hệ sinh thái (PostgreSQL, Backend Node.js, Frontend)
docker compose -f docker-compose.local.yml up -d --build

# 3. Kiểm tra trạng thái các container
docker compose -f docker-compose.local.yml ps
```

Khi chạy thành công:
- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:8000`
- **PostgreSQL**: `localhost:5432`

---

### Cách 2: Chạy trực tiếp trên máy cục bộ (Manual Setup)

#### 1. Yêu cầu tiên quyết
- Node.js version 18.x hoặc 20.x trở lên
- PostgreSQL 14+ đang chạy và đã tạo cơ sở dữ liệu `sensors`
- Python 3.9+ (nếu chạy IoT Gateway client)

#### 2. Cài đặt Backend (`BE_nodejs`)
```bash
cd BE_nodejs

# Sao chép file môi trường và điền thông tin
cp env.example .env

# Cài đặt thư viện
npm install

# Khởi chạy server phát triển
npm run dev
# Server lắng nghe tại http://localhost:8000
```

#### 3. Cài đặt Frontend (`FE`)
```bash
cd ../FE

# Tạo file cấu hình môi trường
echo "VITE_API_BASE_URL=http://localhost:8000" > .env.development

# Cài đặt thư viện
npm install

# Khởi chạy giao diện
npm run dev
# Giao diện mở tại http://localhost:5173
```

#### 4. Khởi chạy IoT Gateway Client (`client`)
```bash
cd ../client

# Cài đặt thư viện phụ thuộc
pip install paho-mqtt requests

# Khởi chạy client chuyển tiếp
python client.py
```

---

## 📡 Đặc Tả API & Dữ Liệu IoT

### 1. Endpoint Tiếp Nhận Dữ Liệu Cảm Biến (Public IoT Endpoint)
- **URL**: `POST /api/receive-data`
- **Yêu cầu xác thực**: Không (Public nhằm tối ưu cho vi điều khiển nhúng)
- **Content-Type**: `application/json`

#### Cấu trúc Payload:
```json
{
  "sensor_name": "DHT22_PhanThiet_Station_01",
  "temperature": 27.5,
  "humidity": 68.4,
  "light_value": 450,
  "timestamp": "2026-10-08T14:30:00Z"
}
```

#### Mã phản hồi:
- `201 Created`: Ghi nhận dữ liệu thành công (tự động tạo cảm biến nếu chưa có).
- `400 Bad Request`: Thiếu trường bắt buộc `sensor_name`.
- `429 Too Many Requests`: Vượt quá tần suất gửi cho phép (Rate Limit Guard).

### 2. Các Endpoint Nghiệp Vụ Chính

| Nhóm | Method | Đường dẫn API | Mô tả | Quyền |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/users/register/` | Đăng ký tài khoản mới | Public |
| **Auth** | `POST` | `/api/users/login/` | Đăng nhập tài khoản | Public |
| **Auth** | `POST` | `/api/users/google-login/`| Đăng nhập qua Google OAuth | Public |
| **Auth** | `POST` | `/api/users/forgot-password/` | Yêu cầu cấp lại mật khẩu | Public |
| **Sensor** | `GET` | `/api/sensors/` | Lấy danh sách cảm biến | Bearer JWT |
| **Sensor Data** | `GET` | `/api/sensor-data/` | Lấy lịch sử dữ liệu cảm biến | Bearer JWT |
| **Sensor Data** | `GET` | `/api/sensor-data-with-battery`| Lấy dữ liệu kèm mức pin thực tế | Bearer JWT |

---

## 🧪 Kiểm Thử & CI/CD (QA & DevOps)

### 1. Kiểm thử End-to-End với Playwright
Thư mục `playwright/` chứa bộ kiểm thử tự động áp dụng mô hình **Page Object Model (POM)**:
- Hơn **35 kịch bản kiểm thử (Test Cases)** bao phủ:
  - Khả năng tiếp nhận dữ liệu API của trạm IoT.
  - Luồng xác thực đăng nhập, đăng ký, quên mật khẩu.
  - Kiểm tra kết xuất biểu đồ Dashboard và các bộ lọc thời gian.
  - Tải dữ liệu bản đồ vị trí trạm cảm biến.
- Chạy kiểm thử cục bộ:
  ```bash
  cd playwright
  npm install
  npx playwright test
  ```

### 2. Tự động hóa CI/CD & Báo cáo Discord
- Kịch bản GitHub Actions (`.github/workflows/test.yml` và `update.yml`) kích hoạt khi đẩy mã nguồn lên nhánh chính.
- Tự động chạy song song (Parallel Execution) kiểm thử E2E trên 3 engine trình duyệt: Chromium, Firefox và WebKit.
- Tự động đóng gói kết quả, lưu trữ Video/Screenshot lỗi và bắn thông báo trực tiếp qua **Discord Webhook** giúp nhóm phát triển nắm bắt trạng thái tức thì.

---

## 📈 Đánh Giá Chất Lượng & Định Hướng Phát Triển

### 1. Đánh giá tổng quan (Codebase Audit)
Theo tài liệu đánh giá kỹ thuật chuyên sâu ([`documents/Improve/Review.md`](documents/Improve/Review.md)):
- **Kiến trúc**: 4/5 ⭐ — Phân tầng rõ ràng giữa Controller, Service, Model và Routing.
- **Bảo mật**: Đã xử lý băm mật khẩu, tích hợp JWT token pair và bổ sung bộ đệm Rate Limiter.
- **Kiểm thử & Tài liệu**: 5/5 ⭐ — Tài liệu kỹ thuật chi tiết nhất quán, bộ test Playwright đạt tỷ lệ thành công 100%.

### 2. Định hướng nâng cấp tương lai
- **Bảo mật thiết bị nhúng**: Bổ sung khóa xác thực API Key / Device Secret Header cho các nút cảm biến gửi lên `/api/receive-data`.
- **Mô hình AI tự động điều khiển đèn**: Huấn luyện mô hình học máy (Machine Learning) dựa trên dữ liệu lịch sử để dự đoán chu kỳ bật/tắt bóng đèn LED tự động tối ưu hóa theo thời gian thực thay vì chỉ cảnh báo ngưỡng.
- **Bản đồ 3D nông trại**: Nâng cấp module bản đồ từ Leaflet 2D lên không gian số hóa mô phỏng 3D nông trường canh tác.
- **Phân vùng dữ liệu (Data Partitioning)**: Triển khai chiến lược TimescaleDB hoặc lưu trữ phân vùng thời gian cho dữ liệu chuỗi thời gian khi số lượng bản ghi đo đạc từ sensor tăng cao.

---

## 👥 Đội Ngũ Phát Triển & Bản Quyền

Dự án được xây dựng và phát triển phục vụ mục đích nghiên cứu, học thuật và ứng dụng thực tiễn trong nông nghiệp công nghệ cao.  
Mọi thông tin chi tiết xin vui lòng tham khảo các tài liệu chuyên sâu tại thư mục [`documents/`](documents/).
