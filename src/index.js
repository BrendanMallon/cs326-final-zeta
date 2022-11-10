// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD82UDNc7FtI7oIPodznPQBtQsceJrp2W0",
  authDomain: "team-zeta.firebaseapp.com",
  projectId: "team-zeta",
  storageBucket: "team-zeta.appspot.com",
  messagingSenderId: "862273333231",
  appId: "1:862273333231:web:5b611d4542bdf87436b81a",
  measurementId: "G-DJTXFC1NY9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);