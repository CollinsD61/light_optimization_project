# Dùng Node.js Alpine cho nhẹ
FROM node:20-alpine

# Tạo thư mục làm việc
WORKDIR /app

# Copy package.json và lock file
COPY package*.json ./

# Xóa package-lock.json nếu có để tránh conflict
RUN rm -f package-lock.json

# Cài đặt dependencies
RUN npm install

# Copy toàn bộ mã nguồn
COPY . .

# Build ứng dụng
RUN npm run build

# Mở cổng đúng với Vite
EXPOSE 5173

# Chạy Vite preview server và mở cho máy ngoài truy cập
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]
