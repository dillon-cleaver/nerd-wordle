import { initializeApp } from "firebase/app";

// Optionally import the services that you want to use
// import {...} from 'firebase/auth';
// import {...} from 'firebase/database';
// import {...} from 'firebase/firestore';
// import {...} from 'firebase/functions';
// import {...} from 'firebase/storage';

// Initialize Firebase
const firebaseConfig = {
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
