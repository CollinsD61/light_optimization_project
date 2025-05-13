# Dùng Node.js Alpine cho nhẹ
FROM node:20-alpine

# Tạo thư mục làm việc
WORKDIR /app

# Copy package.json và lock file
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Copy toàn bộ mã nguồn
COPY . .

# Mở cổng đúng với Vite
EXPOSE 5173

# Chạy Vite dev server và mở cho máy ngoài truy cập
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
