import paho.mqtt.client as mqtt
import requests
import json

# Địa chỉ API Django của bạn (Thay đổi nếu cần)
DJANGO_API_URL = 'https://api.lightoptimization.io.vn/api/receive-data/'

# Thông tin MQTT Broker (Điều chỉnh nếu cần)
MQTT_BROKER = '192.168.1.117'  # IP của Raspberry Pi 4 (giống như trong Arduino)
MQTT_PORT = 1883
MQTT_TOPIC = 'sensor/data'  # Topic mà Arduino publish

# Tên cảm biến (Cố định, hoặc bạn có thể truyền từ Arduino nếu cần)
SENSOR_NAME = "ESP8266_Sensor"  # Tên cảm biến để gửi đến Django

def on_connect(client, userdata, flags, rc):
    """Hàm callback khi kết nối thành công."""
    print(f"✅ Đã kết nối với MQTT Broker với kết quả code: {rc}")
    client.subscribe(MQTT_TOPIC)

def on_message(client, userdata, msg):
    print(f"📥 Đã nhận được tin nhắn từ topic: {msg.topic}, payload: {msg.payload.decode()}")

    try:
        payload = json.loads(msg.payload.decode())

        # Đổi key 'light' → 'light_value'
        if 'light' in payload:
            payload['light_value'] = payload.pop('light')

        payload['sensor_name'] = SENSOR_NAME

        print("📤 Payload gửi lên Django:", payload)
        send_data_to_django(payload)

    except json.JSONDecodeError:
        print(f"❌ Lỗi giải mã JSON từ topic: {msg.topic}")
    except Exception as e:
        print(f"❌ Lỗi xử lý tin nhắn MQTT: {e}")


def send_data_to_django(data):
    """Gửi dữ liệu cảm biến đến Django backend."""
    try:
        response = requests.post(DJANGO_API_URL, json=data)
        response.raise_for_status()  # Báo lỗi nếu không phải 200 OK
        print(f"🚀 Đã gửi dữ liệu đến Django: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"❌ Lỗi khi gửi dữ liệu đến Django: {e}")

# Khởi tạo MQTT client
client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

# Kết nối đến MQTT Broker
client.connect(MQTT_BROKER, MQTT_PORT, 60)  # keepalive=60

# Chạy vòng lặp để lắng nghe tin nhắn
client.loop_forever()