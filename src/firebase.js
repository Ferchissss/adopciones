// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, PhoneAuthProvider, RecaptchaVerifier, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDBfZcI6bPNPWSgAL_27yc9qNGfhV0pPU0",
  authDomain: "adopciones-1f95b.firebaseapp.com",
  projectId: "adopciones-1f95b",
  storageBucket: "adopciones-1f95b.firebasestorage.app",
  messagingSenderId: "139170823730",
  appId: "1:139170823730:web:f1002f1b21bac2a852862b"
};

  
  const app = initializeApp(firebaseConfig);
  export const auth = getAuth(app);
  export const db = getFirestore(app);
  export const googleProvider = new GoogleAuthProvider();
  export const phoneProvider = new PhoneAuthProvider(auth);
  export { signInWithPopup, RecaptchaVerifier };