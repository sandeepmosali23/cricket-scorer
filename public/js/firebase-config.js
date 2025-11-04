/**
 * Firebase Configuration and Initialization
 * Cricket Scorer Pro - v3.5.0
 *
 * This file handles all Firebase setup including:
 * - Configuration
 * - Initialization
 * - Firestore database connection
 * - Authentication setup
 */

// Firebase Configuration
// IMPORTANT: Replace with your Firebase project credentials
const firebaseConfig = {
    apiKey: "AIzaSyBzsz_Hn5PgQUUm80EFqoWi_65zlfeVleg",
    authDomain: "cricket-scorer-pro-95b9d.firebaseapp.com",
    projectId: "cricket-scorer-pro-95b9d",
    storageBucket: "cricket-scorer-pro-95b9d.firebasestorage.app",
    messagingSenderId: "354364037961",
    appId: "1:354364037961:web:228b5d906089b07f38d898",
    measurementId: "G-NFQRG4XNL5"
};

// Global Firebase variables
let db = null;
let auth = null;
let firebaseInitialized = false;

/**
 * Initialize Firebase
 * Sets up Firestore database and Authentication
 */
function initializeFirebase() {
    try {
        if (typeof firebase !== 'undefined' && firebaseConfig.apiKey !== 'YOUR_API_KEY_HERE') {
            firebase.initializeApp(firebaseConfig);
            db = firebase.firestore();
            auth = firebase.auth();
            firebaseInitialized = true;
            console.log('✅ Firebase initialized successfully (Firestore + Auth)');
            return true;
        } else {
            console.warn('⚠️ Firebase not configured. Using localStorage only. See firebase-config.js for setup instructions.');
            return false;
        }
    } catch (error) {
        console.error('❌ Firebase initialization error:', error);
        return false;
    }
}

// Auto-initialize on script load
initializeFirebase();
