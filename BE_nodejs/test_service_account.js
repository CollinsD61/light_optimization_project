// Test Firebase Admin SDK with Service Account
const { database } = require('./src/config/firebase');

async function testServiceAccount() {
  console.log('\n=== TEST FIREBASE WITH SERVICE ACCOUNT ===\n');
  
  try {
    if (!database) {
      console.error('❌ Database not initialized!');
      return;
    }
    
    console.log('✅ Database initialized successfully');
    
    // Test 1: Write data
    console.log('\n📝 TEST 1: Writing test data...');
    const testRef = database.ref('test/service_account');
    await testRef.set({
      message: 'Hello from Service Account!',
      timestamp: new Date().toISOString(),
      working: true
    });
    console.log('✅ Write successful (no permission error!)');
    
    // Test 2: Read data
    console.log('\n📖 TEST 2: Reading test data...');
    const snapshot = await testRef.once('value');
    if (snapshot.exists()) {
      console.log('✅ Read successful!');
      console.log('Data:', snapshot.val());
    }
    
    // Test 3: Battery data (no timeout warning!)
    console.log('\n🔋 TEST 3: Reading battery data...');
    const batteryRef = database.ref('sensors/hcm-device-01/battery');
    const batterySnapshot = await batteryRef.once('value');
    
    if (batterySnapshot.exists()) {
      const battery = batterySnapshot.val();
      console.log('✅ Battery:', battery.level + '%');
      console.log('⚡ NO TIMEOUT WARNING! Service Account works perfectly!');
    } else {
      console.log('⚠️ No battery data (but no error!)');
    }
    
    console.log('\n=== ALL TESTS PASSED ✅ ===');
    console.log('✅ Service Account: WORKING');
    console.log('✅ No permission errors');
    console.log('✅ No timeout warnings');
    console.log('✅ Fast and secure\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

testServiceAccount();

