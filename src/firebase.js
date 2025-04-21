import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAg5nGd_gDWpSR5AW05DRNOu9ktTJWGxDY",
  authDomain: "events-management-system-d00f6.firebaseapp.com",
  projectId: "events-management-system-d00f6",
  storageBucket: "events-management-system-d00f6.firebasestorage.app",
  messagingSenderId: "1019576779274",
  appId: "1:1019576779274:web:2ee95a642213f3cbe115f3",
  measurementId: "G-48RN3MNX86"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);