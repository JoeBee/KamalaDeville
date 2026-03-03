// Import the functions you need from the Firebase CDN (browser-compatible)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAfUF4K5mfcrmmJb1htD26-4XRP6NUs76A",
    authDomain: "kam-dev2.firebaseapp.com",
    projectId: "kam-dev2",
    storageBucket: "kam-dev2.firebasestorage.app",
    messagingSenderId: "961025667139",
    appId: "1:961025667139:web:0a3341fe19577f19f964f6",
    measurementId: "G-CD1CTQCRDN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app); // Initialize Firestore

// Export the app and db instances
export { app, db };