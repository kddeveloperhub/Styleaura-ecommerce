// src/firebase/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBrYxPp9_eT-ZhQW5mEwv1PdGZG_NSvbRI",
  authDomain: "style-aura-16.firebaseapp.com",
  projectId: "style-aura-16",
  storageBucket: "style-aura-16.appspot.com",
  messagingSenderId: "201585604407",
  appId: "1:201585604407:web:03c1142651964edc420cb2",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app); 

export default app;