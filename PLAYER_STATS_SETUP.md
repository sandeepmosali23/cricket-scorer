# Player Statistics Setup Guide

## Overview

The Player Statistics feature (v3.3.0) automatically tracks cumulative batting and bowling statistics for all players across all your saved matches.

---

## Features

### What Gets Tracked

**Batting Statistics:**
- Total Matches
- Total Innings
- Total Runs
- Balls Faced
- High Score
- Not Outs
- Fours
- Sixes
- Batting Average (calculated)
- Strike Rate (calculated)

**Bowling Statistics:**
- Wickets Taken
- Runs Conceded
- Balls Bowled
- Overs Bowled
- Bowling Average (calculated)
- Economy Rate (calculated)

### How It Works

1. **Automatic Updates**: Every time you save a match to Firebase Cloud, player statistics are automatically updated
2. **User-Specific**: Each user only sees statistics for their own matches
3. **Cumulative**: Stats accumulate across all matches
4. **Real-Time**: View updated stats immediately after saving a match

---

## Required Setup: Firestore Index

To use Player Statistics, you need to create a Firestore composite index.

### Option 1: Quick Setup (Recommended)

1. **Save a match** to Firebase Cloud (after logging in)
2. **Click "View Player Stats"** on the home page
3. If you see an error in the console, it will include a **clickable link** to create the index
4. **Click the link** - it will open Firebase Console with pre-filled index settings
5. **Click "Create Index"**
6. **Wait 1-2 minutes** for the index to build
7. **Refresh** the app and try again

### Option 2: Manual Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (e.g., "cricket-scorer-pro")
3. Click **"Firestore Database"** in the left sidebar
4. Go to the **"Indexes"** tab
5. Click **"Create Index"**
6. Configure the index:

```
Collection ID: playerStats

Fields to index:
┌──────────────┬───────────────┐
│ Field        │ Order         │
├──────────────┼───────────────┤
│ userId       │ Ascending     │
│ totalRuns    │ Descending    │
└──────────────┴───────────────┘

Query scope: Collection
```

7. Click **"Create"**
8. Wait for the index to build (status will change from "Building" to "Enabled")

### Alternative Indexes (Optional)

You can create additional indexes to sort by different stats:

**Sort by Wickets:**
```
Collection: playerStats
Fields:
  - userId (Ascending)
  - wickets (Descending)
```

**Sort by Batting Average:**
```
Collection: playerStats
Fields:
  - userId (Ascending)
  - battingAvg (Descending)
```

---

## How to Use Player Statistics

### Viewing All Players

1. **Log in** to your account
2. Go to the **home page**
3. Click **"Player Stats"** card (📈 icon)
4. The Player Stats modal opens

### Filter Options

- **All Players**: Shows all players with any stats
- **Batsmen**: Only shows players who have batted
- **Bowlers**: Only shows players who have bowled

### Viewing Player Details

1. In the Player Stats modal, **click on any player card**
2. The Player Detail modal opens
3. See comprehensive batting and bowling statistics

### What You'll See

**Player Stats List:**
- Player name
- Total matches
- Runs, average, strike rate (batting)
- Wickets, economy rate (bowling)

**Player Detail View:**
- Complete batting statistics
- Complete bowling statistics
- All calculated metrics

---

## Data Structure

### Firestore Collection: `playerStats`

**Document ID Format:**
```
{userId}_{playerName}
```
Example: `abc123def456_Virat Kohli`

**Document Fields:**
```javascript
{
  // Metadata
  userId: "abc123def456",
  playerName: "Virat Kohli",
  totalMatches: 5,
  totalInnings: 5,
  lastUpdated: Timestamp,

  // Batting Stats
  totalRuns: 245,
  totalBalls: 180,
  highScore: 78,
  notOuts: 1,
  fours: 28,
  sixes: 6,

  // Bowling Stats
  wickets: 3,
  runsConceded: 42,
  ballsBowled: 48
}
```

**Calculated Fields (computed on fetch):**
```javascript
{
  battingAvg: "61.25",      // totalRuns / (totalInnings - notOuts)
  strikeRate: "136.11",     // (totalRuns / totalBalls) * 100
  bowlingAvg: "14.00",      // runsConceded / wickets
  economy: "5.25"           // (runsConceded / ballsBowled) * 6
}
```

---

## Troubleshooting

### Error: "The query requires an index"

**Solution:** Follow the setup steps above to create the Firestore index

### Players Not Showing Up

**Cause:** You might be in Guest mode or haven't saved any matches

**Solution:**
1. Make sure you're logged in
2. Save at least one match to Firebase Cloud
3. Refresh and try again

### Stats Not Updating

**Cause:** Match might have been saved to Local Storage instead of Cloud

**Solution:**
1. Make sure you're in **☁️ Cloud** mode (not 💻 Local)
2. Save the match
3. Check that "Saved to cloud" message appears

### Empty Statistics

**Cause:** No players have batted or bowled in saved matches

**Solution:**
1. Play a complete match with runs and wickets
2. Save to Firebase Cloud
3. Stats will populate automatically

---

## Privacy & Data

- **User Isolation**: You only see statistics for players in YOUR saved matches
- **Cloud Storage**: Stats are stored in Firebase Firestore
- **Automatic Sync**: Stats sync across all your devices when logged in
- **No Cross-Contamination**: Player names are scoped to your user ID

---

## Examples

### Example: Opening the Player Stats

```
1. Click home button (🏠)
2. Scroll to "Player Stats" card
3. Click "View Player Stats" button
4. Filter by "Batsmen" to see top scorers
5. Click on a player to see detailed stats
```

### Example: Viewing Stats After a Match

```
1. Complete a match
2. Click "💾 Save ☁️" (in Cloud mode)
3. Enter match name and save
4. Stats are updated automatically
5. Click "Player Stats" to see updated statistics
```

---

## Firebase Free Tier

Player statistics are well within Firebase free tier limits:

**Storage:**
- Each player document: ~500 bytes
- 100 players: ~50 KB
- Free tier: 1 GB (plenty of space!)

**Reads:**
- Opening Player Stats: 1 read per player
- 100 players: 100 reads
- Free tier: 50,000 reads/day

**Writes:**
- Saving a match: 1 write per player in match
- 11 players per team: ~22 writes per match
- Free tier: 20,000 writes/day

You can save hundreds of matches without hitting limits.

---

## Version History

- **v3.3.0**: Player Statistics feature added
  - Cumulative stats tracking
  - Batting and bowling analytics
  - Filter and detail views
  - Automatic updates on match save

---

## Related Documentation

- [Firebase Quick Start](FIREBASE_QUICK_START.md)
- [Firebase Setup Guide](FIREBASE_SETUP_GUIDE.md)
- [Where to Find Firebase Features](WHERE_TO_FIND_FIREBASE.md)
- [Save/Load Usage Guide](SAVE_LOAD_USAGE.md)

---

**Enjoy tracking your cricket statistics! 🏏📈**
