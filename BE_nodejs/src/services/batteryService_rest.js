// Battery Service dùng Firebase REST API (không cần SDK)
const axios = require('axios');

const FIREBASE_URL = 'https://iot-web-3ceb5-default-rtdb.asia-southeast1.firebasedatabase.app';

class BatteryServiceREST {
  /**
   * 📖 LẤY PIN TỪ FIREBASE (REST API)
   */
  static async getBattery(sensorId, timeoutMs = 3000) {
    try {
      console.log(`[REST] Getting battery for ${sensorId}...`);
      
      const url = `${FIREBASE_URL}/sensors/${sensorId}/battery.json`;
      
      const response = await axios.get(url, {
        timeout: timeoutMs
      });
      
      if (response.data) {
        console.log(`[REST] Battery found: ${response.data.level}%`);
        return response.data;
      }
      
      console.log('[REST] No battery data found');
      return null;
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        console.warn(`[REST] Timeout after ${timeoutMs}ms`);
      } else {
        console.error('[REST] Error getting battery:', error.message);
      }
      return null;
    }
  }

  /**
   * 💾 CẬP NHẬT PIN VÀO FIREBASE (REST API)
   */
  static async updateBattery(sensorId, batteryLevel, reason = 'AUTO_DECAY') {
    try {
      const url = `${FIREBASE_URL}/sensors/${sensorId}/battery.json`;
      
      const data = {
        level: Math.max(0, Math.min(100, batteryLevel)),
        timestamp: new Date().toISOString(),
        lastUpdated: Date.now(),
        reason: reason
      };
      
      await axios.put(url, data, {
        timeout: 3000
      });
      
      console.log(`[REST] ✅ Battery updated: ${batteryLevel}% (${reason})`);
      return true;
    } catch (error) {
      console.error('[REST] Error updating battery:', error.message);
      return false;
    }
  }

  /**
   * 🧮 TÍNH TOÁN PIN DECAY
   */
  static calculateBatteryLevel(lastTimestamp, initialBattery) {
    const now = Date.now();
    const lastTime = new Date(lastTimestamp).getTime();
    const minutesDiff = (now - lastTime) / (1000 * 60);
    
    const BATTERY_TIMEOUT_MINUTES = 70;
    
    if (minutesDiff > BATTERY_TIMEOUT_MINUTES) {
      return 0;
    }
    
    const batteryDropPerMinute = 0.01;
    const batteryDrop = minutesDiff * batteryDropPerMinute;
    const currentBattery = Math.max(0, initialBattery - batteryDrop);
    
    return Math.round(currentBattery);
  }

  /**
   * 🔄 CẬP NHẬT PIN THÔNG MINH
   */
  static async smartUpdateBattery(sensorId) {
    try {
      const batteryData = await this.getBattery(sensorId);
      
      if (!batteryData) {
        await this.updateBattery(sensorId, 100, 'INIT');
        return 100;
      }
      
      const now = new Date();
      const lastUpdate = new Date(batteryData.timestamp);
      const minutesSinceUpdate = (now - lastUpdate) / (1000 * 60);
      
      if (minutesSinceUpdate > 70) {
        await this.updateBattery(sensorId, 0, 'TIMEOUT');
        return 0;
      }
      
      if (minutesSinceUpdate >= 1) {
        const newLevel = this.calculateBatteryLevel(batteryData.timestamp, batteryData.level);
        if (newLevel !== batteryData.level) {
          await this.updateBattery(sensorId, newLevel, 'DECAY');
          return newLevel;
        }
      }
      
      return batteryData.level;
    } catch (error) {
      console.error('[REST] Error in smart update:', error.message);
      return 100;
    }
  }

  /**
   * 🔄 CẬP NHẬT TẤT CẢ CẢM BIẾN
   */
  static async updateAllSensorsBattery() {
    const sensorIds = ['hcm-device-01'];
    
    console.log('\n=== BATTERY UPDATE JOB (REST API) ===');
    for (const sensorId of sensorIds) {
      try {
        const newBattery = await this.smartUpdateBattery(sensorId);
        console.log(`[REST] ${sensorId}: ${newBattery}%`);
      } catch (error) {
        console.error(`[REST] Error updating ${sensorId}:`, error.message);
      }
    }
    console.log('=== END ===\n');
  }
}

module.exports = BatteryServiceREST;

