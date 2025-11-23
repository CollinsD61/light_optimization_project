import { database } from '../firebase/config';
import { ref, set, get, onValue, off } from 'firebase/database';

export class BatteryService {
  // Hằng số: 1 tiếng 10 phút = 70 phút
  static BATTERY_TIMEOUT_MINUTES = 70;
  
  // Lưu giá trị pin
  static async updateBattery(sensorId, batteryLevel) {
    try {
      const batteryRef = ref(database, `sensors/${sensorId}/battery`);
       console.log('Updating battery at path:', `sensors/${sensorId}/battery`);
      console.log('New battery level:', batteryLevel);
      
      await set(batteryRef, {
        level: batteryLevel,
        timestamp: new Date().toISOString(),
        lastUpdated: Date.now()
      });
      console.log(`Battery updated for ${sensorId}: ${batteryLevel}%`);
      return true;
    } catch (error) {
      console.error('Error updating battery:', error);
      return false;
    }
  }

  // Lấy giá trị pin
  static async getBattery(sensorId) {
    try {
      const batteryRef = ref(database, `sensors/${sensorId}/battery`);
      console.log('Getting battery from path:', `sensors/${sensorId}/battery`);
      
      const snapshot = await get(batteryRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log('Firebase battery data:', data);
        return data;
      }
      console.log('No battery data found in Firebase');
      return null;
    } catch (error) {
      console.error('Error getting battery:', error);
      return null;
    }
  }

  // Đặt lại pin về 100% (để test)
  static async resetBatteryTo100(sensorId) {
    try {
      const batteryRef = ref(database, `sensors/${sensorId}/battery`);
      await set(batteryRef, {
        level: 100,
        timestamp: new Date().toISOString(),
        lastUpdated: Date.now()
      });
      console.log(`Battery reset to 100% for ${sensorId}`);
      return true;
    } catch (error) {
      console.error('Error resetting battery:', error);
      return false;
    }
  }

  // Lắng nghe thay đổi pin realtime
  static listenToBatteryChanges(sensorId, callback) {
    const batteryRef = ref(database, `sensors/${sensorId}/battery`);
    const unsubscribe = onValue(batteryRef, callback);
    return unsubscribe;
  }

  // Tính toán pin dựa trên thời gian
  static calculateBatteryLevel(lastTimestamp, initialBattery = 100) {
    const now = new Date();
    const lastTime = new Date(lastTimestamp);
    const minutesDiff = (now - lastTime) / (1000 * 60);
    
    console.log('=== BATTERY CALCULATION ===');
    console.log('Now:', now.toISOString());
    console.log('Last update:', lastTime.toISOString());
    console.log('Minutes passed:', minutesDiff.toFixed(2));
    console.log('Initial battery:', initialBattery + '%');
    
    // Kiểm tra nếu đã quá 1 tiếng 10 phút (70 phút) mà không có cập nhật
    if (minutesDiff > this.BATTERY_TIMEOUT_MINUTES) {
      console.log(`Quá ${this.BATTERY_TIMEOUT_MINUTES} phút (1 tiếng 10 phút) không có cập nhật. Đặt pin về 0%.`);
      return 0;
    }
    
    // Chỉ tính toán nếu đã qua ít nhất 1 phút
    if (minutesDiff < 1) {
      console.log('Chưa đủ 1 phút, không thay đổi mức pin');
      return initialBattery;
    }
    
    // Tốc độ tụt pin: 0.006944% mỗi phút = 0.4167% mỗi giờ = 10% mỗi ngày
    // 100% pin sẽ hết trong 10 ngày (14,400 phút)
    const batteryDropPerMinute = 0.006944; // 100 / (10 * 24 * 60)
    const batteryDrop = minutesDiff * batteryDropPerMinute;
    
    // CHO PHÉP PIN VỀ 0%
    const currentBattery = Math.max(0, initialBattery - batteryDrop);
    
    console.log('Tốc độ giảm pin:', batteryDropPerMinute.toFixed(6) + '% mỗi phút (~0.42% mỗi giờ, 10% mỗi ngày)');
    console.log('Tổng pin đã giảm:', batteryDrop.toFixed(2) + '%');
    console.log('Mức pin mới:', currentBattery.toFixed(2) + '%');
    console.log('Thời gian còn lại:', (currentBattery / batteryDropPerMinute / 60 / 24).toFixed(2) + ' ngày');
    console.log('=== KẾT THÚC TÍNH TOÁN ===');
    
    return Math.round(currentBattery);
  }

  // Giảm pin thủ công (để test)
  static async decreaseBattery(sensorId, amount = 1) {
    try {
      const currentBattery = await this.getBattery(sensorId);
      const currentLevel = currentBattery ? currentBattery.level : 100;
      const newLevel = Math.max(0, currentLevel - amount);
      await this.updateBattery(sensorId, newLevel);
      return newLevel;
    } catch (error) {
      console.error('Error decreasing battery:', error);
      return null;
    }
  }

  // Thêm function để lấy thời gian battery được update lần cuối 2
  static async getLastBatteryUpdateTime(sensorId) {
    try {
      const batteryData = await this.getBattery(sensorId);
      return batteryData ? batteryData.timestamp : new Date().toISOString();
    } catch (error) {
      console.error('Error getting last update time:', error);
      return new Date().toISOString();
    }
  }

  // Sửa lại logic cập nhật pin thông minh hơn
  static async smartUpdateBattery(sensorId) {
    try {
      const batteryData = await this.getBattery(sensorId);
      if (!batteryData) {
        // Nếu chưa có data, tạo mới với 100%
        await this.updateBattery(sensorId, 100);
        return 100;
      }
      
      const now = new Date();
      const lastUpdate = new Date(batteryData.timestamp);
      const minutesSinceUpdate = (now - lastUpdate) / (1000 * 60);
      
      // Kiểm tra nếu đã quá 1 tiếng 10 phút (70 phút) mà không có cập nhật
      if (minutesSinceUpdate > this.BATTERY_TIMEOUT_MINUTES) {
        console.log(`Không có cập nhật trong hơn ${this.BATTERY_TIMEOUT_MINUTES} phút (1 tiếng 10 phút). Đặt pin về 0%.`);
        await this.updateBattery(sensorId, 0);
        return 0;
      }
      
      // Chỉ cập nhật nếu đã quá 1 phút kể từ lần cập nhật cuối
      if (minutesSinceUpdate >= 1) {
        const newLevel = this.calculateBatteryLevel(batteryData.timestamp, batteryData.level);
        if (newLevel !== batteryData.level) {
          await this.updateBattery(sensorId, newLevel);
          return newLevel;
        }
      }
      
      return batteryData.level;
    } catch (error) {
      console.error('Error in smart update:', error);
      return null;
    }
  }
  
  // Kiểm tra xem thiết bị có bị mất kết nối (không có cập nhật trong hơn 70 phút)
  static isDeviceDisconnected(lastUpdateTimestamp) {
    const now = new Date();
    const lastUpdate = new Date(lastUpdateTimestamp);
    const minutesDiff = (now - lastUpdate) / (1000 * 60);
    
    return minutesDiff > this.BATTERY_TIMEOUT_MINUTES;
  }

  // Xử lý khi nhận được tín hiệu mới từ thiết bị
  static async handleNewSignal(sensorId) {
    try {
      // Lấy dữ liệu pin hiện tại
      const batteryData = await this.getBattery(sensorId);
      
      // Nếu không có dữ liệu pin hoặc pin đang ở 0%, đặt về 100%
      if (!batteryData || batteryData.level === 0) {
        console.log(`Thiết bị ${sensorId} có tín hiệu mới sau khi bị ngắt kết nối hoặc pin về 0%. Đặt pin về 100%.`);
        await this.updateBattery(sensorId, 100);
        return 100;
      }
      
      // Nếu thiết bị đang hoạt động bình thường, chỉ cập nhật thời gian
      console.log(`Cập nhật thời gian cho thiết bị ${sensorId}, pin hiện tại: ${batteryData.level}%`);
      await this.updateBattery(sensorId, batteryData.level);
      return batteryData.level;
    } catch (error) {
      console.error('Lỗi khi xử lý tín hiệu mới:', error);
      return null;
    }
  }

  // Verify battery data đã sync chưa
  static async verifyBatterySync(sensorId, expectedValue, maxRetries = 3, delayMs = 500) {
    console.log(`🔍 Verifying battery sync for ${sensorId}...`);
    console.log(`   Expected value: ${expectedValue}%`);
    
    for (let i = 0; i < maxRetries; i++) {
      // Đợi một chút để Firebase sync
      if (i > 0) {
        console.log(`   Retry ${i}/${maxRetries} after ${delayMs}ms...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
      
      // Đọc giá trị hiện tại
      const batteryData = await this.getBattery(sensorId);
      
      if (batteryData && batteryData.level !== undefined) {
        const difference = Math.abs(batteryData.level - expectedValue);
        const lastUpdated = new Date(batteryData.lastUpdated || batteryData.timestamp);
        const timeSinceUpdate = Date.now() - lastUpdated.getTime();
        
        console.log(`   Current value: ${batteryData.level}%`);
        console.log(`   Difference: ${difference}%`);
        console.log(`   Last updated: ${timeSinceUpdate}ms ago`);
        
        // Nếu giá trị đồng bộ (sai số < 1%)
        if (difference <= 1) {
          console.log(`   ✅ Battery synced successfully!`);
          return {
            success: true,
            value: batteryData.level,
            timestamp: batteryData.timestamp,
            lastUpdated: batteryData.lastUpdated,
            retries: i
          };
        }
        
        console.warn(`   ⚠️ Battery not synced yet (difference: ${difference}%)`);
      }
    }
    
    // Sau maxRetries lần vẫn không sync
    console.error(`   ❌ Battery sync failed after ${maxRetries} retries!`);
    return {
      success: false,
      value: expectedValue, // Fallback về expected value
      retries: maxRetries
    };
  }

  // Get battery với retry nếu có race condition
  static async getBatteryWithRetry(sensorId, expectedValue = null, maxRetries = 2) {
    const batteryData = await this.getBattery(sensorId);
    
    // Nếu không có expected value, return luôn
    if (expectedValue === null || !batteryData) {
      return batteryData;
    }
    
    // Nếu có expected value, verify
    const difference = Math.abs(batteryData.level - expectedValue);
    
    // Nếu khác quá nhiều (> 5%), có thể bị stale
    if (difference > 5 && maxRetries > 0) {
      console.warn(`⚠️ Detected stale battery data (expected: ${expectedValue}%, got: ${batteryData.level}%)`);
      console.warn(`   Retrying in 500ms... (${maxRetries} retries left)`);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      return this.getBatteryWithRetry(sensorId, expectedValue, maxRetries - 1);
    }
    
    return batteryData;
  }
}