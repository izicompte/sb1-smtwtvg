import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCardwk1UkAVYYl-4PAkwRlyLkOXaf2qFM",
  authDomain: "restaurant-5ba0f.firebaseapp.com",
  projectId: "restaurant-5ba0f",
  storageBucket: "restaurant-5ba0f.firebasestorage.app",
  messagingSenderId: "451731766890",
  appId: "1:451731766890:web:e6f7ea3c43adca9b5b9413",
  measurementId: "G-DH39W4QLP6"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);