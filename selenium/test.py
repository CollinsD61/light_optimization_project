from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import time

BASE_URL = "http://localhost:5173"  # Chỉnh port nếu FE chạy port khác

def check_intro_page(driver):
    print("🟫 Kiểm tra trang intro / ...")
    driver.get(f"{BASE_URL}/")
    time.sleep(1)
    found = any(s in driver.page_source for s in ["About", "Projects", "Team", "Contact"])
    assert found, "❌ Không thấy UI intro (About/Projects/Team/Contact)"
    print("✅ Trang INTRO OK!")

def check_login_page(driver):
    print("🟦 Kiểm tra trang /login...")
    driver.get(f"{BASE_URL}/login")
    time.sleep(1)

    assert driver.find_elements(By.ID, "email"), "❌ Không có input Email"
    assert driver.find_elements(By.ID, "password"), "❌ Không có input Password"
    assert driver.find_elements(By.XPATH, "//button[contains(text(),'Continue')]"), "❌ Không có nút Continue"
    
    google_login_iframe = driver.find_elements(By.XPATH, "//iframe[contains(@src, 'accounts.google.com')]")
    google_login_div = driver.find_elements(By.XPATH, "//div[contains(@class, 'credential_picker_container')]")
    assert google_login_iframe or google_login_div, "❌ Không có nút login Google (GoogleLogin)"

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

def check_alarms_page(driver):
    print("🟨 Kiểm tra trang /alarms...")
    driver.get(f"{BASE_URL}/alarms")
    time.sleep(1)
    assert "Alarms" in driver.page_source, "❌ Không thấy tiêu đề Alarms"
    print("✅ Trang ALARMS OK!")

def check_settings_page(driver):
    print("🟧 Kiểm tra trang /settings...")
    driver.get(f"{BASE_URL}/settings")
    time.sleep(1)
    assert "Settings" in driver.page_source, "❌ Không thấy tiêu đề Settings"
    print("✅ Trang SETTINGS OK!")

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
        check_alarms_page(driver)
        check_settings_page(driver)
        print("\n🎉🎉🎉 TẤT CẢ TRANG ĐỀU OK! 🎉🎉🎉")
    finally:
        driver.quit()

if __name__ == "__main__":
    main()
