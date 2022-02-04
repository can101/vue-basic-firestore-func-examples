import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB-wlfmBLsGZeMUUoTir485aIJOsDMKZf8",
    authDomain: "fire-e0344.firebaseapp.com",
    databaseURL: "https://fire-e0344-default-rtdb.firebaseio.com",
    projectId: "fire-e0344",
    storageBucket: "fire-e0344.appspot.com",
    messagingSenderId: "144609587038",
    appId: "1:144609587038:web:ffaa4d66ea9bb95d33a9cf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);