// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBvqvuSC9Ta6zIhdLIxOJmGvJfZiZxLUl8",
  authDomain: "overlayapp-cb8b5.firebaseapp.com",
  projectId: "overlayapp-cb8b5",
  storageBucket: "overlayapp-cb8b5.firebasestorage.app",
  messagingSenderId: "273980807792",
  appId: "1:273980807792:web:54c13fc0d6585c5aa8f2b5",
  measurementId: "G-DNBPEL0E1Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;

