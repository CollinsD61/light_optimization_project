const { database } = require('../config/firebase');

class BatteryService {
  // Hằng số
  static BATTERY_TIMEOUT_MINUTES = 70; // Sensor chết sau 70 phút
  static BATTERY_DROP_PER_MINUTE = 0.006944; // 10% mỗi ngày = 0.006944% mỗi phút
  
  /**
   * 🔋 LẤY THÔNG TIN PIN TỪ FIREBASE
   */
  static async getBattery(sensorId) {
    try {
      if (!database) {
        console.error('❌ Firebase database not initialized');
        return null;
      }

      const batteryRef = database.ref(`sensors/${sensorId}/battery`);
      const snapshot = await batteryRef.once('value');
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log(`[Backend] Battery for ${sensorId}:`, data.level + '%');
        return data;
      }
      
      console.log(`[Backend] No battery data found for ${sensorId}`);
      return null;
    } catch (error) {
      console.error('❌ Error getting battery:', error);
      return null;
    }
  }

  /**
   * 💾 CẬP NHẬT PIN VÀO FIREBASE
   */
  static async updateBattery(sensorId, batteryLevel, reason = 'AUTO_DECAY') {
    try {
      if (!database) {
        console.error('❌ Firebase database not initialized');
        return false;
      }

      const batteryRef = database.ref(`sensors/${sensorId}/battery`);
      const timestamp = new Date().toISOString();
      
      await batteryRef.set({
        level: Math.max(0, Math.min(100, batteryLevel)), // Clamp 0-100
        timestamp: timestamp,
        lastUpdated: Date.now(),
        reason: reason
      });
      
      console.log(`[Backend] ✅ Battery updated for ${sensorId}: ${batteryLevel}% (${reason})`);
      return true;
    } catch (error) {
      console.error('❌ Error updating battery:', error);
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
    
    console.log(`[Backend] Battery calculation:`);
    console.log(`  - Last update: ${new Date(lastTime).toISOString()}`);
    console.log(`  - Minutes passed: ${minutesDiff.toFixed(2)}`);
    console.log(`  - Initial battery: ${initialBattery}%`);
    
    if (minutesDiff < 1) {
      console.log(`  - Too soon, no change`);
      return initialBattery;
    }
    
    const batteryDrop = minutesDiff * this.BATTERY_DROP_PER_MINUTE;
    const currentBattery = Math.max(0, initialBattery - batteryDrop);
    
    console.log(`  - Battery drop: ${batteryDrop.toFixed(2)}%`);
    console.log(`  - New battery: ${currentBattery.toFixed(2)}%`);
    
    return Math.round(currentBattery);
  }

  /**
   * 🔄 CẬP NHẬT TẤT CẢ SENSORS
   */
  static async updateAllSensorsBattery() {
    try {
      console.log('\n========== [Backend] BATTERY UPDATE JOB START ==========');
      
      // List of sensors to update
      const sensorIds = ['hcm-device-01']; // Add more sensors here
      
      for (const sensorId of sensorIds) {
        await this.updateSingleSensorBattery(sensorId);
      }
      
      console.log('========== [Backend] BATTERY UPDATE JOB END ==========\n');
    } catch (error) {
      console.error('❌ Error in battery update job:', error);
    }
  }

  /**
   * 🔋 CẬP NHẬT PIN CHO 1 SENSOR
   */
  static async updateSingleSensorBattery(sensorId) {
    try {
      console.log(`\n[Backend] Updating battery for ${sensorId}...`);
      
      // Lấy thông tin pin hiện tại
      const batteryData = await this.getBattery(sensorId);
      
      if (!batteryData) {
        console.log(`[Backend] No battery data, initializing to 100%`);
        await this.updateBattery(sensorId, 100, 'INIT');
        return;
      }
      
      // Tính pin decay
      const calculatedBattery = this.calculateBatteryLevel(
        batteryData.timestamp,
        batteryData.level
      );
      
      // Chỉ update nếu thay đổi >= 1%
      const batteryChange = Math.abs(calculatedBattery - batteryData.level);
      
      if (batteryChange >= 1) {
        await this.updateBattery(sensorId, calculatedBattery, 'AUTO_DECAY');
        console.log(`[Backend] ✅ Battery updated: ${batteryData.level}% → ${calculatedBattery}%`);
      } else {
        console.log(`[Backend] ⏭️  Battery change too small (${batteryChange.toFixed(2)}%), skipping update`);
      }
      
    } catch (error) {
      console.error(`❌ Error updating battery for ${sensorId}:`, error);
    }
  }

  /**
   * 📡 GHI NHẬN DATA MỚI TỪ SENSOR (gọi khi receive data)
   */
  static async recordDataReceived(sensorId) {
    try {
      if (!database) {
        console.error('❌ Firebase database not initialized');
        return false;
      }

      const dataRef = database.ref(`sensors/${sensorId}/lastDataReceived`);
      const timestamp = Date.now();
      
      await dataRef.set({
        timestamp: new Date(timestamp).toISOString(),
        timestampMs: timestamp
      });
      
      console.log(`[Backend] 📡 Recorded data received for ${sensorId}`);
      return true;
    } catch (error) {
      console.error('❌ Error recording data received:', error);
      return false;
    }
  }

  /**
   * 💀 CHECK SENSOR CÒN SỐNG HAY CHẾT
   */
  static async checkSensorHealth(sensorId) {
    try {
      const dataRef = database.ref(`sensors/${sensorId}/lastDataReceived`);
      const snapshot = await dataRef.once('value');
      
      if (!snapshot.exists()) {
        console.log(`[Backend] ⚠️ No data record for ${sensorId}`);
        return { alive: false, reason: 'NO_DATA_RECORD' };
      }
      
      const lastDataReceived = snapshot.val();
      const now = Date.now();
      const minutesSinceData = (now - lastDataReceived.timestampMs) / (1000 * 60);
      
      if (minutesSinceData > this.BATTERY_TIMEOUT_MINUTES) {
        console.log(`[Backend] 💀 Sensor ${sensorId} CHẾT (${minutesSinceData.toFixed(0)} phút)`);
        return { alive: false, minutesSinceData, reason: 'TIMEOUT' };
      }
      
      console.log(`[Backend] ✅ Sensor ${sensorId} SỐNG (${minutesSinceData.toFixed(0)} phút)`);
      return { alive: true, minutesSinceData, reason: 'ACTIVE' };
      
    } catch (error) {
      console.error('❌ Error checking sensor health:', error);
      return { alive: false, reason: 'ERROR' };
    }
  }
}

module.exports = BatteryService;

