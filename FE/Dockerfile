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

# Thêm dòng này vào trước lệnh npm run build
RUN npm install @headlessui/react @heroicons/react --save

# Mở cổng đúng với Vite
EXPOSE 5173

# Chạy Vite dev server và mở cho máy ngoài truy cập
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
