// Firebase Configuration for Cricket Scorer Pro
//
// SETUP INSTRUCTIONS:
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project or select existing project
// 3. Click "Add app" and select "Web" (</> icon)
// 4. Register your app with a nickname (e.g., "Cricket Scorer Pro")
// 5. Copy the firebaseConfig object and replace the placeholder below
// 6. Enable Firestore Database:
//    - Go to Firestore Database in Firebase Console
//    - Click "Create Database"
//    - Start in "Test Mode" (for development) or "Production Mode" (for production)
//    - Choose a Cloud Firestore location

// Import Firebase modules (using CDN in HTML file)
// This file is for reference - actual implementation will be in index.html

const firebaseConfig = {
    // REPLACE THESE VALUES WITH YOUR FIREBASE PROJECT CONFIG
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID" // Optional
};

// Firestore Database Rules (for development):
/*
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to all users (DEVELOPMENT ONLY)
    match /{document=**} {
      allow read, write: if true;
    }

    // For production, use authentication:
    // match /cricketMatches/{matchId} {
    //   allow read: if true;
    //   allow write: if request.auth != null;
    // }
  }
}
*/

// Export for use in application
export { firebaseConfig };
