from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import time

BASE_URL = "http://localhost:5173"

def check_login_page(driver):
    print("🟦 Kiểm tra trang /login...")
    driver.get(f"{BASE_URL}/login")
    time.sleep(1)
    assert driver.find_elements(By.XPATH, "//input[@name='email']"), "❌ Không có input Email"
    assert driver.find_elements(By.XPATH, "//input[@name='password']"), "❌ Không có input Password"
    assert driver.find_elements(By.XPATH, "//button[contains(.,'Google') or contains(@class,'google')]"), "❌ Không có nút login Google"
    assert driver.find_elements(By.XPATH, "//button[contains(translate(text(),'abcdefghijklmnopqrstuvwxyz','ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 'SIGN IN')]"), "❌ Không có nút SIGN IN"
    assert driver.find_elements(By.XPATH, "//a[contains(translate(text(),'abcdefghijklmnopqrstuvwxyz','ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 'SIGN UP')]"), "❌ Không có link SIGN UP"
    print("✅ Trang LOGIN OK!")

def check_signup_page(driver):
    print("🟩 Kiểm tra trang /signup...")
    driver.get(f"{BASE_URL}/signup")
    time.sleep(1)
    assert driver.find_elements(By.XPATH, "//input[@name='name']"), "❌ Không có input Name"
    assert driver.find_elements(By.XPATH, "//input[@name='email']"), "❌ Không có input Email"
    assert driver.find_elements(By.XPATH, "//input[@name='password']"), "❌ Không có input Password"
    assert driver.find_elements(By.XPATH, "//button[contains(translate(text(),'abcdefghijklmnopqrstuvwxyz','ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 'SIGN UP')]"), "❌ Không có nút SIGN UP"
    print("✅ Trang SIGNUP OK!")

def check_settings_page(driver):
    print("🟧 Kiểm tra trang /settings...")
    driver.get(f"{BASE_URL}/settings")
    time.sleep(1)
    assert "Settings" in driver.page_source, "❌ Không thấy tiêu đề Settings"
    print("✅ Trang SETTINGS OK!")

def check_dashboard_page(driver):
    print("🟪 Kiểm tra trang /dashboard...")
    driver.get(f"{BASE_URL}/dashboard")
    time.sleep(1)
    chart_svgs = driver.find_elements(By.TAG_NAME, "svg")
    assert chart_svgs, "❌ Không thấy biểu đồ chart nào"
    print("✅ Trang DASHBOARD OK!")

def check_home_page(driver):
    print("🟦 Kiểm tra trang /home...")
    driver.get(f"{BASE_URL}/home")
    time.sleep(1)
    assert any(s in driver.page_source for s in ["Devices", "Active:", "Inactive:"]), "❌ Không có block Devices"
    print("✅ Trang HOME OK!")

def check_alarms_page(driver):
    print("🟨 Kiểm tra trang /alarms...")
    driver.get(f"{BASE_URL}/alarms")
    time.sleep(1)
    assert "Alarms" in driver.page_source, "❌ Không thấy tiêu đề Alarms"
    print("✅ Trang ALARMS OK!")

def check_forgot_password_page(driver):
    print("🟥 Kiểm tra trang /forgot-password...")
    driver.get(f"{BASE_URL}/forgot-password")
    time.sleep(1)
    # Check input email hoặc text hướng dẫn
    assert driver.find_elements(By.XPATH, "//input[@type='email']") or "password" in driver.page_source.lower(), "❌ Không thấy UI quên mật khẩu"
    print("✅ Trang FORGOT PASSWORD OK!")

def check_intro_page(driver):
    print("🟫 Kiểm tra trang intro / ...")
    driver.get(f"{BASE_URL}/")
    time.sleep(1)
    # Trang này là HomePageIntro, kiểm tra text About/Projects/Team/Contact
    found = any(s in driver.page_source for s in ["About", "Projects", "Team", "Contact"])
    assert found, "❌ Không thấy UI intro (About/Projects/Team/Contact)"
    print("✅ Trang INTRO OK!")

def main():
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    driver = webdriver.Chrome(options=options)

    try:
        check_intro_page(driver)
        check_login_page(driver)
        check_signup_page(driver)
        check_forgot_password_page(driver)
        check_home_page(driver)
        check_dashboard_page(driver)
        check_alarms_page(driver)
        check_settings_page(driver)
        print("\n🎉🎉🎉 TẤT CẢ TRANG ĐỀU OK! 🎉🎉🎉")
    finally:
        driver.quit()

if __name__ == "__main__":
    main()
