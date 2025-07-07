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

  // Đặt lại pin về 86 (để test)
  static async resetBatteryTo86(sensorId) {
    try {
      const batteryRef = ref(database, `sensors/${sensorId}/battery`);
      await set(batteryRef, {
        level: 86,
        timestamp: new Date().toISOString(),
        lastUpdated: Date.now()
      });
      console.log(`Battery reset to 86% for ${sensorId}`);
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
    
    // Tốc độ tụt pin: 0.01% mỗi phút = 6% mỗi giờ
    const batteryDropPerMinute = 0.01;
    const batteryDrop = minutesDiff * batteryDropPerMinute;
    
    // CHO PHÉP PIN VỀ 0%
    const currentBattery = Math.max(0, initialBattery - batteryDrop);
    
    console.log('Tốc độ giảm pin:', batteryDropPerMinute + '% mỗi phút');
    console.log('Tổng pin đã giảm:', batteryDrop.toFixed(2) + '%');
    console.log('Mức pin mới:', currentBattery.toFixed(2) + '%');
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
}