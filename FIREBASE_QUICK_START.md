# Firebase Quick Start - 5 Minute Setup

## What You'll Get
- ☁️ Save matches to cloud (not just browser)
- 📱 Access from any device
- 🔒 Secure, persistent storage

---

## Quick Setup (5 Steps)

### 1. Create Firebase Project (2 min)
```
1. Go to: https://console.firebase.google.com/
2. Click "Add project"
3. Name it: "cricket-scorer-pro"
4. Disable Analytics (simpler)
5. Click "Create project"
```

### 2. Add Web App (1 min)
```
1. Click Web icon (</>)
2. Nickname: "Cricket Scorer"
3. Click "Register app"
4. COPY the firebaseConfig object
```

You'll get something like:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBxxx...",
  authDomain: "cricket-scorer-pro.firebaseapp.com",
  projectId: "cricket-scorer-pro",
  // ... more fields
};
```

### 3. Enable Firestore (1 min)
```
1. Click "Firestore Database" in sidebar
2. Click "Create database"
3. Select "Start in test mode"
4. Choose location (e.g., us-central1)
5. Click "Enable"
```

### 4. Update App Code (1 min)
```
1. Open: public/index.html
2. Find lines 47-54
3. Replace YOUR_API_KEY_HERE with real values from Step 2
4. Save file
```

**BEFORE:**
```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",  // ← Replace this
    // ...
};
```

**AFTER:**
```javascript
const firebaseConfig = {
    apiKey: "AIzaSyBxxx...",  // ← Your real key
    authDomain: "cricket-scorer-pro.firebaseapp.com",
    projectId: "cricket-scorer-pro",
    storageBucket: "cricket-scorer-pro.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};
```

### 5. Test It! (30 sec)
```
1. Refresh your app
2. Open browser console (F12)
3. Look for: "✅ Firebase initialized successfully"
4. In app, toggle to "☁️ Cloud" mode
5. Save a match
6. Check Firebase Console → Firestore Database
```

---

## Using Cloud Storage

### Save to Cloud
1. Toggle storage mode to **☁️ Cloud**
2. Click **💾 Save ☁️**
3. Enter match name
4. See: "✅ Match saved to cloud"

### Load from Cloud
1. Make sure you're in **☁️ Cloud** mode
2. Click **📂 Load**
3. See purple header: "☁️ Loading from Firebase Cloud"
4. Click **▶️ Load** on any match

### Switch Between Local & Cloud
- **💻 Local**: Browser only (fast, offline)
- **☁️ Cloud**: Firebase (accessible everywhere)

---

## Troubleshooting

**"Firebase not configured" alert?**
→ Check Step 4: Update the config in index.html

**Console shows error?**
→ Verify you copied ALL fields from firebaseConfig

**Can't save to cloud?**
→ Check Firestore rules allow write: `allow write: if true;`

**Test mode expired?**
→ Update Firestore rules (see [FIREBASE_SETUP_GUIDE.md](FIREBASE_SETUP_GUIDE.md))

---

## Visual Guide

### Storage Mode Toggle
```
┌─────────────────┐
│ Storage Mode    │
├────────┬────────┤
│ 💻 Local│☁️ Cloud│  ← Click to switch
└────────┴────────┘
```

### Save Button Changes Color
- Local mode: Blue button "💾 Save 💻"
- Cloud mode: Purple button "💾 Save ☁️"

### Load Modal Shows Mode
- Local mode: Green/Blue header "💻 Loading from Local Storage"
- Cloud mode: Purple header "☁️ Loading from Firebase Cloud"

---

## What Gets Saved?

Everything:
- Team names and players
- All runs, wickets, overs
- Ball-by-ball history
- Batting/bowling statistics
- Partnerships and fall of wickets
- Match format and settings
- 140+ state variables

---

## Firebase Free Tier Limits

✅ **More than enough for personal use:**
- 1 GB storage (~10,000 matches)
- 50,000 reads/day
- 20,000 writes/day

You won't hit these limits unless you have thousands of users.

---

## Complete Documentation

For detailed setup, security rules, and advanced features:
→ See [FIREBASE_SETUP_GUIDE.md](FIREBASE_SETUP_GUIDE.md)

---

**That's it! Enjoy cloud-powered cricket scoring! 🏏☁️**
