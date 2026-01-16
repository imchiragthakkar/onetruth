// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDreUFGdg1fzViogOXpdtM0zhHHSbfZ8eo",
    authDomain: "onetruth-7a693.firebaseapp.com",
    projectId: "onetruth-7a693",
    storageBucket: "onetruth-7a693.firebasestorage.app",
    messagingSenderId: "734654289298",
    appId: "1:734654289298:web:fcbbcedf010862febe1d4b",
    measurementId: "G-6ZPPJWQ93N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
