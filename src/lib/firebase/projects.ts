import { FirebaseApp, initializeApp } from 'firebase/app';
import { Firestore, getFirestore } from 'firebase/firestore';

interface FirebaseProject {
  app: FirebaseApp;
  firestore: Firestore;
}

const mainConfig = {
  apiKey: "AIzaSyCardwk1UkAVYYl-4PAkwRlyLkOXaf2qFM",
  authDomain: "restaurant-5ba0f.firebaseapp.com",
  projectId: "restaurant-5ba0f",
  storageBucket: "restaurant-5ba0f.firebasestorage.app",
  messagingSenderId: "451731766890",
  appId: "1:451731766890:web:e6f7ea3c43adca9b5b9413",
  measurementId: "G-DH39W4QLP6"
};

// Initialize main project
const mainApp = initializeApp(mainConfig);
const mainFirestore = getFirestore(mainApp);

export const projects: Record<string, FirebaseProject> = {
  main: {
    app: mainApp,
    firestore: mainFirestore
  }
};