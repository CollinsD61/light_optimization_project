const cron = require('node-cron');
const BatteryService = require('../services/batteryService');

/**
 * 🔋 BATTERY UPDATE CRON JOB
 * 
 * Chạy mỗi 5 phút để tự động update battery decay
 * 
 * Cron syntax: '*/5 * * * *' = Mỗi 5 phút
 * - Minute: */5 (mỗi 5 phút)
 * - Hour: * (mọi giờ)
 * - Day of Month: * (mọi ngày)
 * - Month: * (mọi tháng)
 * - Day of Week: * (mọi ngày trong tuần)
 */

// Cấu hình: Chạy mỗi 5 phút
const CRON_SCHEDULE = '*/5 * * * *'; // Mỗi 5 phút
// const CRON_SCHEDULE = '*/1 * * * *'; // Mỗi 1 phút (for testing)
// const CRON_SCHEDULE = '0 * * * *'; // Mỗi giờ

let cronJob = null;

/**
 * Start cron job
 */
function startBatteryUpdateJob() {
  if (cronJob) {
    console.log('⚠️  Battery update job already running');
    return;
  }

  console.log('🚀 Starting battery update cron job...');
  console.log(`   Schedule: ${CRON_SCHEDULE} (every 5 minutes)`);
  
  cronJob = cron.schedule(CRON_SCHEDULE, async () => {
    const now = new Date().toISOString();
    console.log(`\n⏰ [${now}] Battery update cron job triggered`);
    
    try {
      await BatteryService.updateAllSensorsBattery();
    } catch (error) {
      console.error('❌ Error in battery update cron job:', error);
    }
  });

  console.log('✅ Battery update cron job started successfully');
  
  // Chạy 1 lần ngay khi start (optional)
  setTimeout(async () => {
    console.log('\n🔄 Running initial battery update...');
    await BatteryService.updateAllSensorsBattery();
  }, 2000); // Đợi 2s cho server khởi động xong
}

/**
 * Stop cron job
 */
function stopBatteryUpdateJob() {
  if (cronJob) {
    cronJob.stop();
    cronJob = null;
    console.log('🛑 Battery update cron job stopped');
  }
}

module.exports = {
  startBatteryUpdateJob,
  stopBatteryUpdateJob
};

