const cron = require('node-cron');
const BatteryService = require('../services/batteryService');

/**
 * BATTERY UPDATE CRON JOB
 * 
 * Runs every 5 minutes to automatically update battery decay
 * 
 * Cron syntax: */5 * * * * = Every 5 minutes
 * - Minute: */5 (every 5 minutes)
 * - Hour: * (every hour)
 * - Day of Month: * (every day)
 * - Month: * (every month)
 * - Day of Week: * (every day of week)
 */

// Configuration: Run every 5 minutes
const CRON_SCHEDULE = '*/5 * * * *'; // Every 5 minutes
// const CRON_SCHEDULE = '*/1 * * * *'; // Every 1 minute (for testing)
// const CRON_SCHEDULE = '0 * * * *'; // Every hour

let cronJob = null;

/**
 * Start cron job
 */
function startBatteryUpdateJob() {
  if (cronJob) {
    console.log('Battery update job already running');
    return;
  }

  console.log('Starting battery update cron job...');
  console.log('Schedule: ' + CRON_SCHEDULE + ' (every 5 minutes)');
  
  cronJob = cron.schedule(CRON_SCHEDULE, async () => {
    const now = new Date().toISOString();
    console.log('[' + now + '] Battery update cron job triggered');
    
    try {
      await BatteryService.updateAllSensorsBattery();
    } catch (error) {
      console.error('Error in battery update cron job:', error);
    }
  });

  console.log('Battery update cron job started successfully');
  
  // Run once immediately on start (optional)
  setTimeout(async () => {
    console.log('Running initial battery update...');
    await BatteryService.updateAllSensorsBattery();
  }, 2000); // Wait 2s for server to fully start
}

/**
 * Stop cron job
 */
function stopBatteryUpdateJob() {
  if (cronJob) {
    cronJob.stop();
    cronJob = null;
    console.log('Battery update cron job stopped');
  }
}

module.exports = {
  startBatteryUpdateJob,
  stopBatteryUpdateJob
};

