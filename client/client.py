import paho.mqtt.client as mqtt
import requests
import json
import time
import socket
import sys

# Địa chỉ API Django của bạn (Thay đổi nếu cần)
DJANGO_API_URL = 'https://api.lightoptimization.io.vn/api/receive-data/'

# Thông tin MQTT Broker (Điều chỉnh nếu cần)
MQTT_BROKER = 'localhost'  # Sử dụng localhost nếu broker chạy trên cùng máy
MQTT_PORT = 1883
MQTT_TOPIC = 'sensor/data'  # Topic mà Arduino publish

# Tên cảm biến (Cố định, hoặc bạn có thể truyền từ Arduino nếu cần)
SENSOR_NAME = "ESP8266_Sensor"  # Tên cảm biến để gửi đến Django

# Cấu hình retry và timeout
MAX_RETRY_ATTEMPTS = 999999  # Số lần thử lại (vô hạn)
RETRY_DELAY = 10  # Số giây chờ giữa các lần thử
NETWORK_CHECK_TIMEOUT = 5  # Timeout cho việc kiểm tra mạng

def on_connect(client, userdata, flags, rc, properties=None):
    """Hàm callback khi kết nối thành công."""
    print(f"✅ Đã kết nối với MQTT Broker với kết quả code: {rc}")
    client.subscribe(MQTT_TOPIC)

def on_message(client, userdata, msg):
    print(f"📥 Đã nhận được tin nhắn từ topic: {msg.topic}, payload: {msg.payload.decode()}")

    try:
        payload = json.loads(msg.payload.decode())

        # Đổi key 'light' → 'light_value' (nếu có)
        if 'light' in payload:
            payload['light_value'] = payload.pop('light')
        
        # Key 'light_value' đã có sẵn thì không cần đổi
        
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
        response = requests.post(DJANGO_API_URL, json=data, timeout=10)
        response.raise_for_status()  # Báo lỗi nếu không phải 200 OK
        print(f"🚀 Đã gửi dữ liệu đến Django: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"❌ Lỗi khi gửi dữ liệu đến Django: {e}")


def check_network_connection(host="8.8.8.8", port=53, timeout=5):
    """
    Kiểm tra kết nối mạng bằng cách thử kết nối đến Google DNS.
    
    Args:
        host: Địa chỉ để kiểm tra (mặc định: Google DNS)
        port: Cổng để kiểm tra
        timeout: Thời gian chờ tối đa
    
    Returns:
        bool: True nếu có kết nối mạng, False nếu không
    """
    try:
        socket.setdefaulttimeout(timeout)
        socket.socket(socket.AF_INET, socket.SOCK_STREAM).connect((host, port))
        return True
    except socket.error:
        return False


def wait_for_network():
    """Đợi cho đến khi có kết nối mạng."""
    print("🔍 Đang kiểm tra kết nối mạng...")
    attempt = 0
    
    while True:
        attempt += 1
        if check_network_connection():
            print("✅ Kết nối mạng thành công!")
            return True
        else:
            print(f"⏳ Chưa có mạng (lần thử {attempt}). Thử lại sau {RETRY_DELAY} giây...")
            time.sleep(RETRY_DELAY)


def check_mqtt_broker_available(host, port, timeout=5):
    """
    Kiểm tra xem MQTT broker có sẵn sàng không.
    
    Args:
        host: Địa chỉ MQTT broker
        port: Cổng MQTT broker
        timeout: Thời gian chờ tối đa
    
    Returns:
        bool: True nếu broker có thể kết nối, False nếu không
    """
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(timeout)
        result = sock.connect_ex((host if host != 'localhost' else '127.0.0.1', port))
        sock.close()
        return result == 0
    except socket.error:
        return False


def wait_for_mqtt_broker():
    """Đợi cho đến khi MQTT broker sẵn sàng."""
    print(f"🔍 Đang kiểm tra MQTT Broker tại {MQTT_BROKER}:{MQTT_PORT}...")
    attempt = 0
    
    while True:
        attempt += 1
        if check_mqtt_broker_available(MQTT_BROKER, MQTT_PORT):
            print("✅ MQTT Broker đã sẵn sàng!")
            return True
        else:
            print(f"⏳ MQTT Broker chưa sẵn sàng (lần thử {attempt}). Thử lại sau {RETRY_DELAY} giây...")
            time.sleep(RETRY_DELAY)

def on_disconnect(client, userdata, rc, properties=None):
    """Hàm callback khi ngắt kết nối."""
    if rc != 0:
        print(f"⚠️ Mất kết nối MQTT! Code: {rc}")
        print("🔄 Đang thử kết nối lại...")


def start_mqtt_client():
    """Khởi tạo và chạy MQTT client với khả năng tự động kết nối lại."""
    # Đợi kết nối mạng
    wait_for_network()
    
    # Đợi MQTT broker sẵn sàng
    wait_for_mqtt_broker()
    
    # Khởi tạo MQTT client
    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
    client.on_connect = on_connect
    client.on_message = on_message
    client.on_disconnect = on_disconnect
    
    # Cấu hình tự động kết nối lại
    client.reconnect_delay_set(min_delay=1, max_delay=120)
    
    # Thử kết nối với retry
    connected = False
    attempt = 0
    
    while not connected:
        attempt += 1
        try:
            print(f"🔌 Đang kết nối đến MQTT Broker (lần thử {attempt})...")
            client.connect(MQTT_BROKER, MQTT_PORT, 60)
            connected = True
            print("✅ Kết nối MQTT thành công!")
        except Exception as e:
            print(f"❌ Không thể kết nối đến MQTT Broker: {e}")
            print(f"⏳ Thử lại sau {RETRY_DELAY} giây...")
            time.sleep(RETRY_DELAY)
            
            # Kiểm tra lại mạng và broker
            if not check_network_connection():
                wait_for_network()
            if not check_mqtt_broker_available(MQTT_BROKER, MQTT_PORT):
                wait_for_mqtt_broker()
    
    # Chạy vòng lặp để lắng nghe tin nhắn
    try:
        print("🎧 Đang lắng nghe tin nhắn từ MQTT...")
        client.loop_forever()
    except KeyboardInterrupt:
        print("\n⛔ Đã dừng client theo yêu cầu người dùng")
        client.disconnect()
        sys.exit(0)
    except Exception as e:
        print(f"❌ Lỗi trong vòng lặp MQTT: {e}")
        print("🔄 Khởi động lại client...")
        time.sleep(RETRY_DELAY)
        start_mqtt_client()  # Recursive restart


if __name__ == "__main__":
    print("=" * 60)
    print("🚀 MQTT Client đang khởi động...")
    print(f"📡 MQTT Broker: {MQTT_BROKER}:{MQTT_PORT}")
    print(f"📢 Topic: {MQTT_TOPIC}")
    print(f"🌐 Django API: {DJANGO_API_URL}")
    print(f"🔧 Sensor Name: {SENSOR_NAME}")
    print("=" * 60)
    
    start_mqtt_client()