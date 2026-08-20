import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDU4tJ32e2LpSNBFiTPD5Nxw_-u_jpK6wY",
  authDomain: "operation-system-39b4f.firebaseapp.com",
  projectId: "operation-system-39b4f",
  storageBucket: "operation-system-39b4f.firebasestorage.app",
  messagingSenderId: "29005556401",
  appId: "1:29005556401:web:4b6d346f7468134079d090",
  measurementId: "G-5BHXJTY91F"
};

// Initialize Firebase app singleton
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
