import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA7P-Q9b9rj5V7o3G74uLzjxgbIoyB_ILo",
  authDomain: "isha-homes-301a8.firebaseapp.com",
  projectId: "isha-homes-301a8",
  storageBucket: "isha-homes-301a8.firebasestorage.app",
  messagingSenderId: "227101377940",
  appId: "1:227101377940:web:ead2ccbf5be861697b7b81",
  measurementId: "G-T8ZWX9P2Z0",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
