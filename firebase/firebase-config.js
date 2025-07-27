// firebase/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// ✅ Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBjYpitXbWYVksSFPYxcJKjvxahdGUd5M8",
  authDomain: "umpohliewguesthouse-bd81e.firebaseapp.com",
  projectId: "umpohliewguesthouse-bd81e",
  storageBucket: "umpohliewguesthouse-bd81e.appspot.com",
  messagingSenderId: "579183469693",
  appId: "1:579183469693:web:5659816e5a0e4addc97d14",
  measurementId: "G-DDL5PK9S8Z"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ✅ Export required Firebase methods and instances
export {
  auth,
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
  sendPasswordResetEmail,
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  query,
  where
};
