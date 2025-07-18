import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBbpSRmBF1jmYfZe0nsSGxRXXBtlVgHMUE",
    authDomain: "crowd-farming.firebaseapp.com",
    projectId: "crowd-farming",
    storageBucket: "crowd-farming.firebasestorage.app",
    messagingSenderId: "46943241274",
    appId: "1:46943241274:web:cf469090cd0435bd30a103",
    measurementId: "G-7B5LVWZRGK"
  };
  

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, signInWithPopup };
