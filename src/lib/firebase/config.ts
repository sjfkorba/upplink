import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAOimU-9K0a8yE-ZtgGrcIqKdgUUcWtQLw",
  authDomain: "dealgaadiapp.firebaseapp.com",
  projectId: "dealgaadiapp",
  storageBucket: "dealgaadiapp.firebasestorage.app",
  messagingSenderId: "43973174382",
  appId: "1:43973174382:web:6561164e05ceed30d4b27f"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);
export const storage = getStorage(app);