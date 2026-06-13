import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyA-A10DAka_KKVeqltYyiPP1R8Az-eigxA",
  authDomain: "chiller-quiz.firebaseapp.com",
  projectId: "chiller-quiz",
  storageBucket: "chiller-quiz.firebasestorage.app",
  messagingSenderId: "1084535823128",
  appId: "1:1084535823128:web:04787df0035c713ebe9c6d",
  measurementId: "G-62BJ91PM4F"
};

const app = initializeApp(firebaseConfig);

console.log("Firebase loaded successfully");
