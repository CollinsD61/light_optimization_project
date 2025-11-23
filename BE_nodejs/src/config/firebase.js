const admin = require('firebase-admin');
const path = require('path');

// CÁCH 1: Dùng Service Account (KHUYẾN NGHỊ - AN TOÀN NHẤT)
// Đặt file service-account.json vào thư mục config/
const serviceAccount = require('../../config/firebase-service-account.json');

// CÁCH 2: Dùng Application Default Credentials (HIỆN TẠI - BỊ LỖI VPS)
// Không cần config gì, tự động lấy từ Google Cloud environment

const firebaseConfig = {
  databaseURL: "https://iot-web-3ceb5-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Initialize Firebase Admin SDK
let database = null;

try {
  if (!admin.apps.length) {
    // CÁCH 1: Với Service Account (ACTIVE - AN TOÀN)
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: firebaseConfig.databaseURL
    });
    
    // CÁCH 2: Với Application Default Credentials (comment out)
    // admin.initializeApp({
    //   databaseURL: firebaseConfig.databaseURL
    // });
  }
  database = admin.database();
  console.log('✅ Firebase Admin SDK initialized successfully');
} catch (error) {
  console.error('❌ Error initializing Firebase Admin SDK:', error);
}

module.exports = { database, admin };

