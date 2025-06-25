// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCbbEUU1Jlz5xjDGR87e7NWrI9SI7r5ucM",
  authDomain: "iot-web-3ceb5.firebaseapp.com",
  databaseURL: "https://iot-web-3ceb5-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "iot-web-3ceb5",
  storageBucket: "iot-web-3ceb5.firebasestorage.app",
  messagingSenderId: "871067858499",
  appId: "1:871067858499:web:d75988a5fd2e4116c046f6",
  measurementId: "G-0QBDQKSZMY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const analytics = getAnalytics(app);