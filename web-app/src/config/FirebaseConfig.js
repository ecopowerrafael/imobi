// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const FirebaseConfig = {
  apiKey: "AIzaSyDfqk3A1khKHpl1fTMK31azTpIuN5OnhSY",
  authDomain: "imobi-taxi.firebaseapp.com",
  databaseURL: "https://imobi-taxi-default-rtdb.firebaseio.com",
  projectId: "imobi-taxi",
  storageBucket: "imobi-taxi.firebasestorage.app",
  messagingSenderId: "201123658541",
  appId: "1:201123658541:web:e06db2d3a29e918e13b1a4"
};

// Initialize Firebase
const app = initializeApp(FirebaseConfig);

export { FirebaseConfig };
export default FirebaseConfig;
