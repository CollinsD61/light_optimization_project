const admin = require('firebase-admin');

// Firebase config (same as frontend)
const firebaseConfig = {
  databaseURL: "https://iot-web-3ceb5-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Initialize Firebase Admin SDK
let database = null;

try {
  if (!admin.apps.length) {
    admin.initializeApp({
      databaseURL: firebaseConfig.databaseURL
    });
  }
  database = admin.database();
  console.log('✅ Firebase Admin SDK initialized successfully');
} catch (error) {
  console.error('❌ Error initializing Firebase Admin SDK:', error);
}

module.exports = { database, admin };

