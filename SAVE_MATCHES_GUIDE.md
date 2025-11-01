# Save Matches Functionality - Implementation Guide

## TL;DR - How Easy Is It?

**Answer**: ⭐⭐⭐⭐ (4/5 - Pretty Easy!)

- **Time**: 30-60 minutes
- **Difficulty**: Beginner-Intermediate
- **Lines of Code**: ~150 lines
- **Files to Modify**: 1 (just the main HTML file)

---

## 3 Approaches (Easy to Advanced)

### 1. 🟢 **LocalStorage** (Easiest - Recommended)
**Complexity**: ⭐⭐ Easy
**Storage**: Browser only (5-10 MB)
**Persistence**: Stays after browser close
**Cost**: FREE
**Best For**: Personal use, offline functionality

### 2. 🟡 **IndexedDB** (Medium)
**Complexity**: ⭐⭐⭐ Moderate
**Storage**: Browser only (50+ MB)
**Persistence**: Stays after browser close
**Cost**: FREE
**Best For**: Many matches, better performance

### 3. 🔴 **Backend API** (Advanced)
**Complexity**: ⭐⭐⭐⭐⭐ Complex
**Storage**: Cloud database
**Persistence**: Cross-device sync
**Cost**: Varies (Firebase free tier available)
**Best For**: Multi-user, sharing matches

---

## Recommended: LocalStorage Implementation

### What You Get

✅ **Save Match** - Save current match with custom name
✅ **Load Match** - Resume any saved match
✅ **Match History** - List all saved matches
✅ **Delete Match** - Remove saved matches
✅ **Auto-save** - Save on every ball (optional)
✅ **Export/Import** - Download/upload match data

### What You Need to Add

#### 1. Save Functions (30 lines)

```javascript
// Save current match to localStorage
const saveMatch = (matchName) => {
    const matchData = {
        id: Date.now(),
        name: matchName || `Match ${new Date().toLocaleString()}`,
        savedAt: new Date().toISOString(),

        // Match details
        team1Name, team2Name, team1Players, team2Players,
        matchFormat, totalOvers,

        // Current state
        battingTeam, innings, runs, wickets, overs, balls,
        striker, nonStriker, bowler,

        // Statistics
        batsmanStats, bowlerStats,
        partnerships, fallOfWickets,
        ballHistory, overRuns, currentPartnership,
        extras, retiredBatsmen,

        // Previous innings
        innings1Data, innings2Data,
        target, matchComplete
    };

    // Get existing matches
    const matches = JSON.parse(localStorage.getItem('cricketMatches') || '[]');

    // Add new match
    matches.push(matchData);

    // Save to localStorage
    localStorage.setItem('cricketMatches', JSON.stringify(matches));

    alert(`✅ Match saved: ${matchName}`);
};

// Load a saved match
const loadMatch = (matchId) => {
    const matches = JSON.parse(localStorage.getItem('cricketMatches') || '[]');
    const match = matches.find(m => m.id === matchId);

    if (!match) {
        alert('❌ Match not found');
        return;
    }

    // Restore all state
    setTeam1Name(match.team1Name);
    setTeam2Name(match.team2Name);
    setTeam1Players(match.team1Players);
    setTeam2Players(match.team2Players);
    setMatchFormat(match.matchFormat);
    setTotalOvers(match.totalOvers);
    setBattingTeam(match.battingTeam);
    setInnings(match.innings);
    setRuns(match.runs);
    setWickets(match.wickets);
    // ... restore all other state

    alert(`✅ Match loaded: ${match.name}`);
};

// Get all saved matches
const getSavedMatches = () => {
    return JSON.parse(localStorage.getItem('cricketMatches') || '[]');
};

// Delete a match
const deleteMatch = (matchId) => {
    const matches = JSON.parse(localStorage.getItem('cricketMatches') || '[]');
    const filtered = matches.filter(m => m.id !== matchId);
    localStorage.setItem('cricketMatches', JSON.stringify(filtered));
    alert('✅ Match deleted');
};
```

#### 2. UI Components (50 lines)

Add to your JSX:

```jsx
{/* Save/Load Buttons */}
<div className="fixed bottom-4 right-4 flex gap-2 no-print">
    <button
        onClick={() => {
            const name = prompt('Enter match name:');
            if (name) saveMatch(name);
        }}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg">
        💾 Save Match
    </button>

    <button
        onClick={() => setShowMatchHistory(true)}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-lg">
        📂 Load Match
    </button>
</div>

{/* Match History Modal */}
{showMatchHistory && (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-96 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Saved Matches</h2>

            <div className="space-y-3">
                {getSavedMatches().map(match => (
                    <div key={match.id} className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
                        <div>
                            <div className="font-bold">{match.name}</div>
                            <div className="text-sm text-gray-600">
                                {match.team1Name} vs {match.team2Name}
                            </div>
                            <div className="text-xs text-gray-500">
                                Saved: {new Date(match.savedAt).toLocaleString()}
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    loadMatch(match.id);
                                    setShowMatchHistory(false);
                                }}
                                className="bg-green-600 text-white px-4 py-2 rounded">
                                Load
                            </button>
                            <button
                                onClick={() => deleteMatch(match.id)}
                                className="bg-red-600 text-white px-4 py-2 rounded">
                                Delete
                            </button>
                        </div>
                    </div>
                ))}

                {getSavedMatches().length === 0 && (
                    <p className="text-gray-500 text-center py-8">No saved matches</p>
                )}
            </div>

            <button
                onClick={() => setShowMatchHistory(false)}
                className="mt-4 w-full bg-gray-600 text-white py-2 rounded">
                Close
            </button>
        </div>
    </div>
)}
```

#### 3. State Management (10 lines)

Add this state:

```javascript
const [showMatchHistory, setShowMatchHistory] = useState(false);
```

#### 4. Auto-save (Optional - 5 lines)

```javascript
// Auto-save after every ball
useEffect(() => {
    if (setupComplete && ballHistory.length > 0) {
        saveMatch('Auto-save');
    }
}, [ballHistory]);
```

---

## Step-by-Step Implementation

### Step 1: Add Save Functions

Location: After line 608 (before the return statement)

```javascript
// Save/Load Functions
const saveMatch = (matchName) => { /* ... code above ... */ };
const loadMatch = (matchId) => { /* ... code above ... */ };
const getSavedMatches = () => { /* ... code above ... */ };
const deleteMatch = (matchId) => { /* ... code above ... */ };
```

### Step 2: Add State

Location: Line ~85 (with other useState declarations)

```javascript
const [showMatchHistory, setShowMatchHistory] = useState(false);
```

### Step 3: Add UI Buttons

Location: Before the closing `</div>` of the main container (around line 2200)

```jsx
{/* Save/Load Buttons */}
<div className="fixed bottom-4 right-4 flex gap-2 no-print">
    {/* ... buttons code ... */}
</div>
```

### Step 4: Add Match History Modal

Location: After the main tabs section, before Download Scorecard button

```jsx
{showMatchHistory && (
    <div className="fixed inset-0...">
        {/* ... modal code ... */}
    </div>
)}
```

### Step 5: Test!

1. Score a few balls
2. Click "Save Match"
3. Enter a name
4. Refresh the page
5. Click "Load Match"
6. Select your saved match
7. It should restore!

---

## Complete Code Snippet

Here's the complete code you need to add:

```javascript
// Add to state declarations (line ~85)
const [showMatchHistory, setShowMatchHistory] = useState(false);

// Add these functions (after line 608)
const saveMatch = (matchName) => {
    const matchData = {
        id: Date.now(),
        name: matchName || `Match ${new Date().toLocaleString()}`,
        savedAt: new Date().toISOString(),
        team1Name, team2Name, team1Players, team2Players,
        matchFormat, totalOvers, battingTeam, innings,
        runs, wickets, overs, balls, striker, nonStriker, bowler,
        batsmanStats, bowlerStats, partnerships, fallOfWickets,
        ballHistory, overRuns, currentPartnership, extras,
        retiredBatsmen, innings1Data, innings2Data, target, matchComplete
    };

    const matches = JSON.parse(localStorage.getItem('cricketMatches') || '[]');
    matches.push(matchData);
    localStorage.setItem('cricketMatches', JSON.stringify(matches));
    alert(`✅ Match saved: ${matchName}`);
};

const loadMatch = (matchId) => {
    const matches = JSON.parse(localStorage.getItem('cricketMatches') || '[]');
    const match = matches.find(m => m.id === matchId);

    if (!match) return alert('❌ Match not found');

    setTeam1Name(match.team1Name);
    setTeam2Name(match.team2Name);
    setTeam1Players(match.team1Players);
    setTeam2Players(match.team2Players);
    setMatchFormat(match.matchFormat);
    setTotalOvers(match.totalOvers);
    setBattingTeam(match.battingTeam);
    setInnings(match.innings);
    setRuns(match.runs);
    setWickets(match.wickets);
    setOvers(match.overs);
    setBalls(match.balls);
    setStriker(match.striker);
    setNonStriker(match.nonStriker);
    setBowler(match.bowler);
    setBatsmanStats(match.batsmanStats);
    setBowlerStats(match.bowlerStats);
    setPartnerships(match.partnerships);
    setFallOfWickets(match.fallOfWickets);
    setBallHistory(match.ballHistory);
    setOverRuns(match.overRuns);
    setCurrentPartnership(match.currentPartnership);
    setExtras(match.extras);
    setRetiredBatsmen(match.retiredBatsmen);
    setInnings1Data(match.innings1Data);
    setInnings2Data(match.innings2Data);
    setTarget(match.target);
    setMatchComplete(match.matchComplete);
    setSetupComplete(true);

    alert(`✅ Match loaded: ${match.name}`);
};

const getSavedMatches = () => {
    return JSON.parse(localStorage.getItem('cricketMatches') || '[]');
};

const deleteMatch = (matchId) => {
    const matches = getSavedMatches();
    localStorage.setItem('cricketMatches',
        JSON.stringify(matches.filter(m => m.id !== matchId)));
    setShowMatchHistory(false);
    setTimeout(() => setShowMatchHistory(true), 100); // Refresh list
};
```

Then add the UI components to your JSX.

---

## Storage Limits

### LocalStorage
- **Size**: ~5-10 MB per domain
- **Matches**: ~100-200 full matches
- **Per Match**: ~50-100 KB (depends on balls)

### Browser Support
- ✅ Chrome, Firefox, Safari, Edge (all modern browsers)
- ✅ Mobile browsers
- ✅ Works offline

---

## Enhanced Features (Optional)

### 1. Export Match to File

```javascript
const exportMatch = (matchId) => {
    const match = getSavedMatches().find(m => m.id === matchId);
    const blob = new Blob([JSON.stringify(match, null, 2)],
        { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${match.name}.json`;
    a.click();
};
```

### 2. Import Match from File

```javascript
const importMatch = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
        const match = JSON.parse(e.target.result);
        const matches = getSavedMatches();
        matches.push(match);
        localStorage.setItem('cricketMatches', JSON.stringify(matches));
        alert('✅ Match imported!');
    };
    reader.readAsText(file);
};
```

### 3. Share Match via URL

```javascript
const shareMatch = (matchId) => {
    const match = getSavedMatches().find(m => m.id === matchId);
    const compressed = btoa(JSON.stringify(match)); // Base64 encode
    const shareUrl = `${window.location.origin}?match=${compressed}`;
    navigator.clipboard.writeText(shareUrl);
    alert('✅ Share link copied to clipboard!');
};
```

---

## Pros & Cons

### LocalStorage ✅

**Pros**:
- ✅ Super easy to implement
- ✅ No server needed
- ✅ Works offline
- ✅ Instant save/load
- ✅ Free

**Cons**:
- ❌ Browser-specific (can't sync across devices)
- ❌ Can be cleared by user
- ❌ Limited to ~5-10 MB
- ❌ No sharing between users

---

## Alternative: Firebase (Cloud Save)

If you want cloud storage:

**Setup**: 30 minutes
**Cost**: FREE (up to 1 GB)
**Complexity**: ⭐⭐⭐⭐

```javascript
// Firebase setup (simplified)
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const saveToCloud = async (matchData) => {
    const db = getFirestore();
    await addDoc(collection(db, 'matches'), matchData);
};
```

---

## Recommendation

**For your use case, I recommend**:

### ✅ Start with LocalStorage
- Implement in 30-60 minutes
- Works great for personal use
- No costs, no servers
- Add cloud sync later if needed

### Next Steps
1. Add save/load buttons (15 min)
2. Add match history modal (20 min)
3. Test saving/loading (10 min)
4. Optional: Add auto-save (5 min)
5. Optional: Add export/import (15 min)

**Total Time**: 30-60 minutes

---

## Want Me to Implement It?

I can add the save/load functionality right now! It will:

✅ Add save/load buttons
✅ Create match history view
✅ Enable delete matches
✅ Add auto-save (optional)
✅ Add export/import (optional)

**Ready to add it? Let me know!** 🚀
