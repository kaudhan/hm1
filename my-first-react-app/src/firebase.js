// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBPR1aGM29f-8_78PG8ty-b5ZcneR8YUwM",
  authDomain: "kj-hm1.firebaseapp.com",
  projectId: "kj-hm1",
  storageBucket: "kj-hm1.firebasestorage.app",
  messagingSenderId: "1018450115491",
  appId: "1:1018450115491:web:ffdcd449261fb1d084b816",
  measurementId: "G-6PTFQ75CHE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db  };
export default app;