# Chọn image Python 3.13.2 chính thức làm base image
FROM python:alpine

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép requirements.txt vào container
COPY requirements.txt .

# Cài đặt các dependencies Python cho dự án + gunicorn
RUN pip install --no-cache-dir -r requirements.txt gunicorn

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Chạy migrations để chuẩn bị cơ sở dữ liệu
#RUN python manage.py migrate

# Cấu hình Gunicorn để chạy Django
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "BE.wsgi:application"]
