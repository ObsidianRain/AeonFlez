// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBrkeSB14FksFLZ7UrabqiXLO2GYvmaB1U",
  authDomain: "device-streaming-78333e53.firebaseapp.com",
  projectId: "device-streaming-78333e53",
  storageBucket: "device-streaming-78333e53.firebasestorage.app",
  messagingSenderId: "705970981208",
  appId: "1:705970981208:web:64f41e6b637c09ea257d2d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app };
