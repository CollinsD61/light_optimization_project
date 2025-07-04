import { database } from '../firebase/config';
import { ref, set, get, onValue, off } from 'firebase/database';

export class BatteryService {
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
    
    // Chỉ tính toán nếu đã qua ít nhất 1 phút
    if (minutesDiff < 1) {
      console.log('Less than 1 minute passed, no battery change');
      return initialBattery;
    }
    
    // Tốc độ tụt pin: 0.01% mỗi phút = 6% mỗi giờ
    const batteryDropPerMinute = 0.01;
    const batteryDrop = minutesDiff * batteryDropPerMinute;
    
    // CHO PHÉP PIN VỀ 0%
    const currentBattery = Math.max(0, initialBattery - batteryDrop);
    
    console.log('Battery drop rate:', batteryDropPerMinute + '% per minute');
    console.log('Total battery drop:', batteryDrop.toFixed(2) + '%');
    console.log('New battery level:', currentBattery.toFixed(2) + '%');
    console.log('=== END CALCULATION ===');
    
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
}