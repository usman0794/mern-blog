// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-a0478.firebaseapp.com",
  projectId: "mern-blog-a0478",
  storageBucket: "mern-blog-a0478.firebasestorage.app",
  messagingSenderId: "981353250756",
  appId: "1:981353250756:web:e86ffe6ac86434a264ee91"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);