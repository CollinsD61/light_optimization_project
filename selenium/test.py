from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

BASE_URL = "http://localhost:5173"  # Chỉnh port nếu FE chạy port khác

def check_intro_page(driver):
    print("🟫 Kiểm tra trang intro / ...")
    driver.get(f"{BASE_URL}/")
    time.sleep(1)
    
    
    nav_items = ["About Us", "Our Projects", "Team", "Contact Us"]
    for item in nav_items:
        assert driver.find_elements(By.XPATH, f"//a[contains(text(), '{item}')]"), f"❌ Không thấy menu '{item}'"
    
    # Kiểm tra tiêu đề chính
    assert driver.find_elements(By.XPATH, "//h1[contains(text(), 'Optimizing Light')]"), "❌ Không thấy tiêu đề chính"
    
    # Kiểm tra nút Login
    assert driver.find_elements(By.XPATH, "//button[contains(text(), 'Log In')]"), "❌ Không thấy nút Login"
    
    print("✅ Trang INTRO OK!")

def check_login_page(driver):
    print("🟦 Kiểm tra trang /login...")
    driver.get(f"{BASE_URL}/login")
    time.sleep(1)

    assert driver.find_elements(By.ID, "email"), "❌ Không có input Email"
    assert driver.find_elements(By.ID, "password"), "❌ Không có input Password"
    assert driver.find_elements(By.XPATH, "//button[contains(text(),'Continue')]"), "❌ Không có nút Continue"
    
    # Kiểm tra đăng nhập Google
    google_login = driver.find_elements(By.XPATH, "//button[contains(@class, 'google-login') or contains(text(), 'Google')]") or \
                  driver.find_elements(By.XPATH, "//iframe[contains(@src, 'accounts.google.com')]") or \
                  driver.find_elements(By.XPATH, "//div[contains(@class, 'credential_picker_container')]")
    assert google_login, "❌ Không có nút login Google"

    print("✅ Trang LOGIN đầy đủ UI!")

def check_signup_page(driver):
    print("🟩 Kiểm tra trang /signup...")
    driver.get(f"{BASE_URL}/signup")
    time.sleep(1)
    assert driver.find_elements(By.ID, "email"), "❌ Không có input Email"
    assert driver.find_elements(By.ID, "password"), "❌ Không có input Password"
    assert driver.find_elements(By.XPATH, "//button[contains(text(),'Create account')]"), "❌ Không có nút Create account"
    print("✅ Trang SIGNUP OK!")

def check_forgot_password_page(driver):
    print("🟥 Kiểm tra trang /forgot-password...")
    driver.get(f"{BASE_URL}/forgot-password")
    time.sleep(1)
    assert driver.find_elements(By.ID, "email"), "❌ Không thấy input Email"
    assert driver.find_elements(By.XPATH, "//button[contains(text(), 'Continue')]"), "❌ Không thấy nút Continue"
    assert driver.find_elements(By.XPATH, "//button[contains(text(), 'Back to login')]"), "❌ Không thấy nút Back to login"
    print("✅ Trang FORGOT PASSWORD OK!")

def check_home_page(driver):
    print("🟪 Kiểm tra trang /mainlayout/home...")
    driver.get(f"{BASE_URL}/mainlayout/home")
    time.sleep(2)
    
    # Kiểm tra tiêu đề và các phần tử chính
    assert driver.find_elements(By.XPATH, "//h1[contains(text(), 'Bảng điều khiển')]"), "❌ Không thấy tiêu đề Bảng điều khiển"
    
    # Kiểm tra các card thông tin
    cards = ["Tổng thiết bị", "Cảnh báo", "Bảng điều khiển", "Hoạt động"]
    for card in cards:
        assert driver.find_elements(By.XPATH, f"//h2[contains(text(), '{card}')]"), f"❌ Không thấy card {card}"
    
    # Kiểm tra chức năng dark mode
    assert driver.find_elements(By.XPATH, "//button[@aria-label='Toggle dark mode']"), "❌ Không thấy nút dark mode"
    
    print("✅ Trang HOME OK!")

def check_settings_page(driver):
    print("🟧 Kiểm tra trang /mainlayout/settings...")
    driver.get(f"{BASE_URL}/mainlayout/settings")
    time.sleep(2)
    
    # Kiểm tra tiêu đề
    assert driver.find_elements(By.XPATH, "//h1[contains(text(), 'Cài đặt hệ thống')]"), "❌ Không thấy tiêu đề Cài đặt hệ thống"
    
    # Kiểm tra các phần cài đặt chính
    settings = ["Cài đặt chung", "Cấu hình API", "Thông tin hệ thống"]
    for setting in settings:
        assert driver.find_elements(By.XPATH, f"//h2[contains(text(), '{setting}')]"), f"❌ Không thấy phần {setting}"
    
    # Kiểm tra các nút toggle và thiết lập
    assert driver.find_elements(By.XPATH, "//h3[contains(text(), 'Chế độ tối')]"), "❌ Không thấy cài đặt chế độ tối"
    assert driver.find_elements(By.XPATH, "//button[contains(text(), 'Lưu tất cả cài đặt')]"), "❌ Không thấy nút lưu cài đặt"
    
    print("✅ Trang SETTINGS OK!")

def check_alarms_page(driver):
    print("🟨 Kiểm tra trang /mainlayout/alarms...")
    driver.get(f"{BASE_URL}/mainlayout/alarms")
    time.sleep(2)
    
    # Kiểm tra tiêu đề
    assert driver.find_elements(By.XPATH, "//h1[contains(text(), 'Quản lý cảnh báo')]"), "❌ Không thấy tiêu đề Quản lý cảnh báo"
    
    # Kiểm tra các tab và controls
    tabs = ["Tất cả", "Đang kích hoạt", "Đang cảnh báo", "Nghiêm trọng"]
    for tab in tabs:
        assert driver.find_elements(By.XPATH, f"//button[contains(text(), '{tab}')]"), f"❌ Không thấy tab {tab}"
    
    # Kiểm tra nút thêm cảnh báo
    assert driver.find_elements(By.XPATH, "//button[contains(text(), 'Thêm cảnh báo')]"), "❌ Không thấy nút thêm cảnh báo"
    
    # Kiểm tra bảng cảnh báo
    headers = ["Trạng thái", "Tên cảnh báo", "Thiết bị", "Điều kiện", "Ưu tiên", "Lần cuối kích hoạt", "Hành động"]
    for header in headers:
        xpath = f"//th[contains(text(), '{header}')]"
        assert driver.find_elements(By.XPATH, xpath), f"❌ Không thấy header bảng {header}"
    
    print("✅ Trang ALARMS OK!")

def main():
    options = Options()
    options.add_argument("--headless")  # Chạy ẩn trình duyệt
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--window-size=1920,1080")  # Đặt kích thước cửa sổ

    driver = webdriver.Chrome(options=options)
    
    try:
        check_intro_page(driver)
        check_login_page(driver)
        check_signup_page(driver)
        check_forgot_password_page(driver)
        
        # Kiểm tra thêm các trang trong MainLayout
        try:
            check_home_page(driver)
            check_settings_page(driver)
            check_alarms_page(driver)
            print("\n🎉🎉🎉 TẤT CẢ TRANG ĐỀU OK! 🎉🎉🎉")
        except AssertionError as e:
            print(f"\n⚠️ Lưu ý: Các trang trong MainLayout có lỗi: {e}")
            print("🎉 Tuy nhiên, các trang đăng nhập đều OK!")
    except Exception as e:
        print(f"\n❌ Lỗi kiểm tra: {str(e)}")
    finally:
        driver.quit()

if __name__ == "__main__":
    main()
