import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDzlzL5Vbs9aMI82nmxwUwGkO4q3lB_OAw",
  authDomain: "omnicar-80e07.firebaseapp.com",
  projectId: "omnicar-80e07",
  storageBucket: "omnicar-80e07.firebasestorage.app",
  messagingSenderId: "639304261484",
  appId: "1:639304261484:web:89799230c1c5f7c54a5d49"
};

export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);

export const storage = getStorage(app);