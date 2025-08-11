import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "jireh-estate.firebaseapp.com",
  projectId: "jireh-estate",
  storageBucket: "jireh-estate.firebasestorage.app",
  messagingSenderId: "38309558134",
  appId: "1:38309558134:web:f2842bb8ebcd01b984ec57",
  measurementId: "G-S0QH4EJFW2",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
console.log("Firebase Analytics initialized:", analytics); // added just to not get assigned but never used error
