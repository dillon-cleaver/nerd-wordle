import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Optionally import the services that you want to use
// import {...} from 'firebase/functions';
// import {...} from 'firebase/storage';

// Initialize Firebase
export const firebaseConfig = {
  apiKey: "AIzaSyCFKMe4vTWkUKr83E-T_i7wmrhG7cx29zY",
  authDomain: "nerd-word-cfda3.firebaseapp.com",
  projectId: "nerd-word-cfda3",
  storageBucket: "nerd-word-cfda3.firebasestorage.app",
  messagingSenderId: "1095647998196",
  appId: "1:1095647998196:web:7bbee77f52a04d286c2ea1",
  measurementId: "G-2VYYRXBD02",
};

const app = initializeApp(firebaseConfig);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
export const auth = getAuth(app);
export const db = getFirestore(app);
