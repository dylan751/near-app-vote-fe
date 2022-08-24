// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
const firebaseConfig = {
  apiKey: 'AIzaSyAZk4y8b79_kfumt65FCM3vzr55VwBz2mA',
  authDomain: 'app-vote-images-6d327.firebaseapp.com',
  projectId: 'app-vote-images-6d327',
  storageBucket: 'app-vote-images-6d327.appspot.com',
  messagingSenderId: '1081109300592',
  appId: '1:1081109300592:web:3efdb7cbc84dd48d5a3bb5',
  measurementId: 'G-WQX6E5CDTD',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
