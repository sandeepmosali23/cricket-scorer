# Firebase Setup Guide - Cricket Scorer Pro

## Overview
This guide will help you set up Firebase Cloud Storage for your Cricket Scorer Pro app, enabling you to save and load matches from the cloud instead of just browser localStorage.

---

## Why Firebase?

### Benefits
- ☁️ **Cloud Storage**: Access your matches from any device
- 🔄 **Sync Across Devices**: Save on desktop, load on mobile
- 💾 **Persistent Storage**: Won't be lost if browser cache is cleared
- 🌐 **Shareable**: Can implement sharing matches via URL (future feature)
- 🔒 **Secure**: Firebase provides authentication and security rules
- 📊 **Real-time**: Can add real-time updates (future feature)

### LocalStorage vs Firebase

| Feature | LocalStorage | Firebase Cloud |
|---------|-------------|----------------|
| Storage Location | Browser only | Cloud (Firebase) |
| Device Access | Single device | Any device |
| Persistence | Can be cleared | Permanent |
| Storage Limit | 5-10 MB | 1 GB (free tier) |
| Setup Required | None | Yes (this guide) |
| Internet Required | No | Yes |
| Cost | Free | Free (up to limits) |

---

## Step-by-Step Setup

### Step 1: Create Firebase Project

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Sign in with your Google account

2. **Create New Project**
   - Click "Add project" or "Create a project"
   - Enter project name: `cricket-scorer-pro` (or your choice)
   - Click "Continue"

3. **Google Analytics (Optional)**
   - Enable or disable Google Analytics (recommended: disable for simplicity)
   - Click "Create project"
   - Wait for project creation (~30 seconds)
   - Click "Continue" when ready

---

### Step 2: Add Web App to Firebase Project

1. **Register Web App**
   - In Firebase Console, click the **Web icon** (`</>`)
   - App nickname: `Cricket Scorer Web App`
   - ✅ Check "Also set up Firebase Hosting" (optional, for deployment)
   - Click "Register app"

2. **Copy Configuration**
   - You'll see a `firebaseConfig` object like this:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyBxxx...",
     authDomain: "cricket-scorer-pro.firebaseapp.com",
     projectId: "cricket-scorer-pro",
     storageBucket: "cricket-scorer-pro.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcdef123456"
   };
   ```
   - **COPY THIS ENTIRE OBJECT** - you'll need it in Step 4

---

### Step 3: Enable Firestore Database

1. **Go to Firestore Database**
   - In Firebase Console left sidebar, click "Firestore Database"
   - Click "Create database"

2. **Choose Security Rules**
   - Select **"Start in test mode"** (for development)
     - This allows read/write without authentication
     - ⚠️ Warning: Test mode expires in 30 days
   - Click "Next"

3. **Choose Location**
   - Select a Cloud Firestore location near you:
     - `us-central1` (USA)
     - `europe-west1` (Europe)
     - `asia-south1` (India)
     - etc.
   - ⚠️ **Cannot be changed later**
   - Click "Enable"
   - Wait for database creation (~1 minute)

4. **Verify Database Created**
   - You should see Firestore Database dashboard
   - It will be empty initially

---

### Step 4: Configure Your App

1. **Open the Application Code**
   - Open `public/index.html` in your code editor
   - Find lines 47-54 (the Firebase configuration section)

2. **Replace Placeholder Config**
   - **BEFORE** (placeholder):
   ```javascript
   const firebaseConfig = {
       apiKey: "YOUR_API_KEY_HERE",
       authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
       projectId: "YOUR_PROJECT_ID",
       storageBucket: "YOUR_PROJECT_ID.appspot.com",
       messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
       appId: "YOUR_APP_ID"
   };
   ```

   - **AFTER** (your actual config from Step 2):
   ```javascript
   const firebaseConfig = {
       apiKey: "AIzaSyBxxx...",  // Your actual API key
       authDomain: "cricket-scorer-pro.firebaseapp.com",  // Your actual domain
       projectId: "cricket-scorer-pro",  // Your actual project ID
       storageBucket: "cricket-scorer-pro.appspot.com",  // Your actual bucket
       messagingSenderId: "123456789",  // Your actual sender ID
       appId: "1:123456789:web:abcdef123456"  // Your actual app ID
   };
   ```

3. **Save the File**
   - Save `public/index.html`
   - Also update `src/cricket-scorer-complete.html` with the same config

---

### Step 5: Test Firebase Connection

1. **Open the App**
   - Start your local server: `npm start`
   - Open browser: http://localhost:3000

2. **Check Browser Console**
   - Open Developer Tools (F12 or Cmd+Option+I)
   - Go to "Console" tab
   - Look for: `✅ Firebase initialized successfully`
   - ❌ If you see `⚠️ Firebase not configured`, check your config

3. **Test Save to Cloud**
   - Set up a quick match
   - Click the **Storage Mode** toggle
   - Switch from **💻 Local** to **☁️ Cloud**
   - Click **💾 Save ☁️** button
   - Enter a match name
   - You should see: `✅ Match saved to cloud: [name]`

4. **Verify in Firebase Console**
   - Go back to Firebase Console
   - Click "Firestore Database" in sidebar
   - You should see a collection: `cricketMatches`
   - Click it to see your saved match data

5. **Test Load from Cloud**
   - Click **📂 Load** button
   - Modal should show: `☁️ Loading from Firebase Cloud`
   - Your saved match should appear
   - Click **▶️ Load** to restore it

---

## Security Rules (Production)

### Current Rules (Test Mode)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

⚠️ **WARNING**: Test mode allows ANYONE to read/write your data. Only use for development!

### Recommended Rules (After 30 Days)

For a public app where anyone can save/load their own matches:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow anyone to read all matches
    match /cricketMatches/{matchId} {
      allow read: if true;
      allow write: if true;  // Or add authentication
    }
  }
}
```

### Secure Rules (With Authentication)

If you add Firebase Authentication later:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /cricketMatches/{matchId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null
        && request.auth.uid == resource.data.userId;
    }
  }
}
```

To update rules:
1. Go to Firebase Console → Firestore Database
2. Click "Rules" tab
3. Edit rules
4. Click "Publish"

---

## Features Enabled

### Storage Mode Toggle
- **💻 Local**: Save to browser localStorage (default)
- **☁️ Cloud**: Save to Firebase Firestore

### Cloud Save
- Saves complete match state to Firebase
- Auto-generates unique ID (timestamp)
- Stores all match data (140+ state variables)

### Cloud Load
- Fetches matches from Firebase
- Displays in modal with purple theme
- Shows "☁️ Cloud" badge on each match

### Cloud Delete
- Permanently removes match from Firebase
- Updates list automatically

### Visual Indicators
- Purple gradient for cloud storage UI
- Blue gradient for local storage UI
- Badge shows storage location
- Button text shows active mode

---

## Troubleshooting

### Issue 1: "Firebase not configured" Alert

**Cause**: Firebase config not updated in code

**Fix**:
1. Check `public/index.html` lines 47-54
2. Ensure you replaced placeholder values with your actual Firebase config
3. Refresh browser (hard refresh: Cmd+Shift+R or Ctrl+Shift+F5)

---

### Issue 2: Console shows Firebase initialization error

**Cause**: Invalid API key or project settings

**Fix**:
1. Go to Firebase Console → Project Settings → General
2. Scroll to "Your apps" section
3. Find your Web app
4. Click "Config" to see firebaseConfig again
5. Copy and paste again carefully
6. Ensure no extra quotes or commas

---

### Issue 3: "Permission denied" when saving

**Cause**: Firestore rules too restrictive

**Fix**:
1. Go to Firebase Console → Firestore Database → Rules
2. Verify rules allow write:
   ```javascript
   allow write: if true;
   ```
3. Click "Publish" if you made changes
4. Wait 1-2 minutes for rules to propagate

---

### Issue 4: Test mode expired (after 30 days)

**Message**: "Cloud Firestore: Missing or insufficient permissions"

**Fix**:
1. Update Firestore rules (see Security Rules section above)
2. Or extend test mode:
   ```javascript
   allow read, write: if request.time < timestamp.date(2025, 12, 31);
   ```

---

### Issue 5: Modal shows empty list in cloud mode

**Cause**: No matches saved to cloud yet

**Fix**:
1. Save a match while in Cloud mode
2. Or switch to Local mode to see localStorage matches

---

### Issue 6: Cannot switch to Cloud mode

**Alert**: "Firebase not configured. Please set up Firebase"

**Fix**:
1. Complete Step 4: Configure Your App
2. Replace placeholder Firebase config with real values
3. Refresh page

---

## Usage Tips

### Best Practices
1. **Use Local for Testing**: Practice matches, quick games
2. **Use Cloud for Important Matches**: Tournament games, records you want to keep
3. **Export Both**: Download CSV/PDF before clearing browser data
4. **Check Console**: Open DevTools to see Firebase connection status

### Storage Limits
- **LocalStorage**: 5-10 MB (about 100-200 matches)
- **Firebase Free Tier**:
  - 1 GB storage
  - 50,000 reads/day
  - 20,000 writes/day
  - Enough for thousands of matches

### When to Use Each Mode

| Scenario | Recommended Mode |
|----------|------------------|
| Practice match | 💻 Local |
| Quick scoring | 💻 Local |
| Tournament match | ☁️ Cloud |
| Want to share later | ☁️ Cloud |
| No internet | 💻 Local |
| Want multi-device access | ☁️ Cloud |

---

## Data Structure in Firebase

Each match is stored as a document in the `cricketMatches` collection:

```javascript
{
  id: "1704739200000",  // Timestamp
  name: "India vs Australia - 1/8/2025",
  savedAt: "2025-01-08T10:30:00.000Z",

  // Setup
  team1Name: "India",
  team2Name: "Australia",
  matchFormat: "T20",
  totalOvers: 20,

  // Current state
  innings: 2,
  runs: 156,
  wickets: 3,

  // Statistics
  batsmanStats: {...},
  bowlerStats: {...},

  // And 100+ more fields...
}
```

---

## Next Steps (Optional Enhancements)

### Phase 1: Authentication
- Add Firebase Authentication
- Let users sign in with Google
- Show "My Matches" vs "All Matches"

### Phase 2: Sharing
- Generate shareable URLs
- Allow viewing read-only matches
- Social media sharing

### Phase 3: Real-time Updates
- Live match updates across devices
- Spectator view mode
- Commentary feed

### Phase 4: Teams & Tournaments
- Create teams
- Organize tournaments
- Leaderboards and statistics

---

## Cost Estimation

### Firebase Free Tier (Spark Plan)
- ✅ **Firestore**: 1 GB storage, 50K reads/day, 20K writes/day
- ✅ **Hosting**: 10 GB storage, 360 MB/day transfer
- ✅ **Authentication**: Unlimited users

### Typical Usage
- **Single User**: FREE (well within limits)
- **100 Users**: FREE
- **1000 Users**: Likely FREE
- **10,000+ Users**: May need paid plan (~$25/month)

### Match Storage Size
- Average match: ~50-100 KB
- 1 GB = ~10,000-20,000 matches

---

## Support & Resources

### Official Documentation
- Firebase Docs: https://firebase.google.com/docs
- Firestore Guide: https://firebase.google.com/docs/firestore
- Security Rules: https://firebase.google.com/docs/firestore/security/rules-structure

### Firebase Console
- Console: https://console.firebase.google.com/
- Check usage: Project → Usage and billing
- Manage rules: Firestore Database → Rules

### Project Documentation
- Main README: [README.md](README.md)
- Analytics Guide: [ANALYTICS_FEATURES.md](ANALYTICS_FEATURES.md)
- Save/Load Guide: [SAVE_LOAD_USAGE.md](SAVE_LOAD_USAGE.md)

---

## Summary Checklist

- [ ] Created Firebase project
- [ ] Added Web app to Firebase
- [ ] Enabled Firestore Database
- [ ] Copied Firebase configuration
- [ ] Updated `public/index.html` with real config
- [ ] Started local server (`npm start`)
- [ ] Checked console for `✅ Firebase initialized successfully`
- [ ] Tested switching to Cloud mode
- [ ] Saved a test match to cloud
- [ ] Verified match appears in Firebase Console
- [ ] Loaded match from cloud successfully

---

## Congratulations! 🎉

You've successfully set up Firebase Cloud Storage for Cricket Scorer Pro!

You can now:
- ☁️ Save matches to the cloud
- 📱 Access matches from any device
- 🌐 Never lose your data to browser clearing
- 🔄 Sync across multiple devices

Enjoy cloud-powered cricket scoring! 🏏
