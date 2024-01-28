import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-3e44c.firebaseapp.com",
  projectId: "mern-3e44c",
  storageBucket: "mern-3e44c.appspot.com",
  messagingSenderId: "460612590207",
  appId: "1:460612590207:web:c0013d30654b1ffb5bbd4a",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
