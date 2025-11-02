# Variable Team Size Support - v3.5.0

## Overview

Enhanced the cricket scorer to support teams of any size (typically 5-11 players), with automatic "all out" detection based on actual player count instead of hardcoded 10 wickets.

---

## Problem Statement

**Before v3.5.0:**
- All wicket logic assumed teams have exactly 11 players
- "All out" was hardcoded to 10 wickets
- Teams with 7 players would continue playing after 6 wickets (should be all out)
- Teams with 9 players would continue playing after 8 wickets (should be all out)
- Match results showed incorrect wickets remaining for smaller teams

**Example Issue:**
```
Team A: 7 players
Team A scores: 150/6
→ Should be "all out" (6 wickets = 7 players - 1)
→ Instead, game continued allowing 7th, 8th, 9th wickets
```

---

## Solution

### Dynamic Max Wickets Calculation

**Formula:** `maxWickets = totalPlayers - 1`

**Reasoning:** The last batsman cannot bat alone, so a team is "all out" when wickets = (total players - 1)

**Examples:**
- 11 players → All out at 10 wickets ✓
- 9 players → All out at 8 wickets ✓
- 7 players → All out at 6 wickets ✓
- 5 players → All out at 4 wickets ✓

---

## Implementation

### 1. Calculate Total Players and Max Wickets

**Location:** Lines 179-183

**Code:**
```javascript
// Calculate max wickets based on actual player count
// A team is "all out" when wickets = (total players - 1)
// E.g., 11 players → all out at 10 wickets, 7 players → all out at 6 wickets
const totalBattingPlayers = currentPlayers.filter(p => p.trim() !== '').length;
const maxWickets = totalBattingPlayers > 0 ? totalBattingPlayers - 1 : 10;
```

**How it works:**
1. Filters `currentPlayers` array to count non-empty player names
2. Calculates max wickets as `totalPlayers - 1`
3. Defaults to 10 if no players found (safety fallback)

**Example:**
```javascript
// Team with 7 players
currentPlayers = ['Alice', 'Bob', 'Charlie', 'Dave', 'Eve', 'Frank', 'Grace', '', '', '', '']
totalBattingPlayers = 7
maxWickets = 6
```

---

### 2. Updated All Out Detection in `processWicket()`

**Location:** Lines 873-880

**Before:**
```javascript
if (newWickets >= 10) {
    alert(`ALL OUT! ${teamName} all out for ${newRuns} runs`);
    endInnings(...);
}
```

**After:**
```javascript
if (newWickets >= maxWickets) {
    console.log(`🏁 ALL OUT! ${newWickets} wickets fallen (max: ${maxWickets})`);
    setTimeout(() => {
        alert(`🏁 ALL OUT! ${teamName} all out for ${newRuns} runs (${newWickets}/${totalBattingPlayers} players)`);
        endInnings(newRuns, newWickets, newOvers, newBalls);
    }, 100);
    return;
}
```

**Improvements:**
- Uses dynamic `maxWickets` instead of hardcoded 10
- Shows player count in alert: "all out for X runs (6/7 players)"
- Console logs actual vs max wickets for debugging

---

### 3. Updated Target Chase Wickets Calculation

**Location (processWicket):** Lines 896-898
**Location (addBall):** Lines 1060-1062

**Before:**
```javascript
const wicketsRemaining = 10 - newWickets;
```

**After:**
```javascript
const wicketsRemaining = maxWickets - newWickets;
```

**Impact:**
```
Example: 7-player team chases target
Team scores 150/4 to win
→ Before: "Won by 6 wickets" (10 - 4 = 6) ❌ WRONG
→ After: "Won by 2 wickets" (6 - 4 = 2) ✓ CORRECT
```

---

### 4. Updated Safety Check in `addBall()`

**Location:** Lines 1091-1098

**Before:**
```javascript
if (newWickets >= 10) {
    alert(`ALL OUT! ${teamName} all out for ${newRuns} runs`);
    endInnings(...);
}
```

**After:**
```javascript
if (newWickets >= maxWickets) {
    console.log(`🏁 ALL OUT! (Safety check - ${newWickets} wickets, max: ${maxWickets})`);
    setTimeout(() => {
        alert(`🏁 ALL OUT! ${teamName} all out for ${newRuns} runs (${newWickets}/${totalBattingPlayers} players)`);
        endInnings(newRuns, newWickets, newOvers, newBalls);
    }, 100);
    return;
}
```

---

### 5. Updated Match Result Calculation

**Location:** Lines 1174-1190

**Problem:** `getMatchResult()` function had hardcoded "10 - wickets" for displaying match result

**Before:**
```javascript
if (innings2Data.runs > innings1Data.runs) {
    return `${teamName} won by ${10 - innings2Data.wickets} wickets`;
}
```

**After:**
```javascript
const getMatchResult = () => {
    if (!innings1Data || !innings2Data) return '';

    // Determine which team batted second and calculate their max wickets
    const team2BattingPlayers = (battingTeam === 'team2' ? team2Players : team1Players).filter(p => p.trim() !== '');
    const team2MaxWickets = team2BattingPlayers.length > 0 ? team2BattingPlayers.length - 1 : 10;

    if (innings2Data.runs > innings1Data.runs) {
        const wicketsRemaining = team2MaxWickets - innings2Data.wickets;
        return `${teamName} won by ${wicketsRemaining} wicket${wicketsRemaining !== 1 ? 's' : ''}`;
    } else if (innings2Data.runs < innings1Data.runs) {
        const runsDiff = innings1Data.runs - innings2Data.runs;
        return `${teamName} won by ${runsDiff} run${runsDiff !== 1 ? 's' : ''}`;
    } else {
        return 'Match Tied';
    }
};
```

**Why complex:** This function runs after match completion when `battingTeam` might have switched, so we need to determine which team batted second and calculate their player count.

---

## Usage Examples

### Example 1: Standard 11-Player Team

```
Setup:
  Team A: 11 players
  Team B: 11 players

Behavior:
  Team A all out at: 10 wickets ✓
  Team B all out at: 10 wickets ✓
  Match result: "Team B won by 3 wickets" (if 10-7=3) ✓
```

### Example 2: 7-Player Teams

```
Setup:
  Team A: 7 players (Alice, Bob, Charlie, Dave, Eve, Frank, Grace)
  Team B: 7 players

Match:
  1st Innings:
    Team A: 120/6 in 20 overs
    → 6 wickets fallen
    → Alert: "🏁 ALL OUT! Team A all out for 120 runs (6/7 players)"
    → Innings automatically ends ✓

  2nd Innings:
    Team B chasing 121
    Team B: 122/4 in 18.3 overs
    → Target reached
    → Alert: "🎉 Team B won by 2 wickets with 9 balls remaining" ✓
    → Correct calculation: 6 - 4 = 2 wickets remaining ✓
```

### Example 3: Mixed Team Sizes

```
Setup:
  Team A: 11 players (full squad)
  Team B: 7 players (short-handed)

Match:
  1st Innings:
    Team A: 180/8 in 20 overs
    → 8 wickets, still 2 players available
    → Innings continues until overs complete ✓

  2nd Innings:
    Team B chasing 181
    Team B: 150/6 in 20 overs
    → 6 wickets = all out for 7-player team
    → Alert: "🏁 ALL OUT! Team B all out for 150 runs (6/7 players)"
    → Match result: "Team A won by 30 runs" ✓
```

### Example 4: Minimum Team (5 Players)

```
Setup:
  Team A: 5 players
  Team B: 5 players

Behavior:
  All out at: 4 wickets
  Example: Team A 80/4 → All out
  Match result calculation: Uses maxWickets = 4
```

---

## Edge Cases Handled

### 1. Empty Team Slots
```
Team Array: ['Alice', 'Bob', '', 'Charlie', '', '', '', '', '', '', '']
Actual Players: 3 (Alice, Bob, Charlie)
Max Wickets: 2
→ All out when 2 wickets fall ✓
```

### 2. All Empty (Safety)
```
Team Array: ['', '', '', '', '', '', '', '', '', '', '']
Actual Players: 0
Max Wickets: 10 (fallback default)
→ Prevents division by zero ✓
```

### 3. Single Batsman Remaining
```
7-player team: 5 wickets fallen
→ 2 batsmen at crease
→ 6th wicket falls
→ All out (last batsman can't bat alone) ✓
```

### 4. Last Ball All Out
```
7-player team, 19.5 overs, 5 wickets
→ Last ball of innings, 6th wicket falls
→ All out check triggers first
→ Innings ends (overs complete check skipped) ✓
```

---

## Testing Scenarios

### Test Case 1: 7-Player Team All Out

**Setup:**
```
Team: Alice, Bob, Charlie, Dave, Eve, Frank, Grace (7 players)
Expected maxWickets: 6
```

**Test Steps:**
1. Start match with 7-player team
2. Record 6 wickets
3. Verify alert shows "6/7 players"
4. Verify innings ends automatically
5. Verify no batsman selection modal shown

**Expected Result:**
✓ Alert: "🏁 ALL OUT! Team all out for X runs (6/7 players)"
✓ Innings ends
✓ No further scoring possible

---

### Test Case 2: 7-Player Team Wins

**Setup:**
```
Team A (11 players): 150/7 (20 overs)
Team B (7 players): Chasing 151
```

**Test Steps:**
1. Team B scores 151/3 in 18.2 overs
2. Verify win alert

**Expected Result:**
✓ Alert: "🎉 Team B won by 3 wickets with 10 balls remaining"
✓ Calculation: 6 - 3 = 3 wickets (correct for 7 players)

---

### Test Case 3: 9-Player Teams

**Setup:**
```
Team A: 9 players → maxWickets = 8
Team B: 9 players → maxWickets = 8
```

**Test Steps:**
1. Team A: 8 wickets fall
2. Verify all out
3. Team B: Chase target, 5 wickets fall, win
4. Verify result shows correct wickets

**Expected Result:**
✓ Team A all out at 8 wickets
✓ Match result: "Team B won by 3 wickets" (8-5=3)

---

## Files Modified

### `/public/index.html`
- **Lines 179-183:** Added dynamic `maxWickets` calculation
- **Lines 873-880:** Updated all-out check in `processWicket()`
- **Lines 896-898:** Updated wickets remaining in `processWicket()` target chase
- **Lines 1060-1062:** Updated wickets remaining in `addBall()` target chase
- **Lines 1091-1098:** Updated safety check in `addBall()`
- **Lines 1174-1190:** Updated `getMatchResult()` function

### `/package.json`
- **Version:** 3.4.0 → 3.5.0
- **Description:** Added "supporting variable team sizes (5-11 players)"

---

## Backward Compatibility

✅ **Fully backward compatible:**
- 11-player teams behave identically to before (maxWickets = 10)
- Existing saved matches load correctly
- No data migration required
- UI unchanged
- Only logic change: dynamic wickets calculation

---

## Limitations

### Minimum Team Size
**Practical Limit:** 2 players minimum (1 wicket to be all out)

**Note:** While technically the code supports down to 1 player, cricket rules require at least 2 batsmen on the field.

### Maximum Team Size
**Limit:** 11 players (standard cricket)

**Reason:** UI and match format designed for standard cricket with 11 players per team

### Dynamic Player Addition Mid-Match
**Current Behavior:** Player count calculated at start of innings

**Limitation:** Adding players mid-match via "Add Player" button doesn't recalculate `maxWickets`

**Workaround:** Restart innings or match if team size changes

---

## Future Enhancements

Potential improvements:

1. **Dynamic Recalculation**
   - Recalculate `maxWickets` when players added mid-match
   - Update on every ball to handle dynamic changes

2. **Minimum Player Warning**
   - Warn if team has fewer than 5 players
   - Suggest adding more players

3. **Visual Indicator**
   - Show "X/Y players" next to team name
   - Display max wickets in scoreboard

4. **Custom Team Sizes**
   - Allow setting team size manually (e.g., 6-a-side, 8-a-side)
   - Override auto-detection

---

## Benefits

### 1. Flexibility
- ✓ Supports friendly matches with limited players
- ✓ Handles practice matches with small squads
- ✓ Works for youth cricket (fewer players)
- ✓ Adapts to social cricket variations

### 2. Accuracy
- ✓ Correct all-out detection for any team size
- ✓ Accurate wickets remaining calculation
- ✓ Proper match result display
- ✓ Realistic game flow

### 3. User Experience
- ✓ No manual configuration needed
- ✓ Automatic detection from player list
- ✓ Clear alerts showing player count
- ✓ Prevents scoring errors

---

## Console Logging

For debugging, the following logs are added:

**All Out Detection:**
```javascript
console.log(`🏁 ALL OUT! ${newWickets} wickets fallen (max: ${maxWickets})`);
```

**Example Output:**
```
🏁 ALL OUT! 6 wickets fallen (max: 6)
🏁 ALL OUT! 8 wickets fallen (max: 8)
🏁 ALL OUT! 10 wickets fallen (max: 10)
```

---

## Conclusion

Version 3.5.0 successfully adds dynamic team size support, making the scorer flexible enough to handle:

✅ Standard 11-player teams
✅ Small-sided games (7-9 players)
✅ Practice matches (5-6 players)
✅ Mixed team sizes in same match
✅ Accurate all-out detection
✅ Correct wickets remaining calculation
✅ Proper match result display

The scorer now adapts automatically to the actual number of players, following proper cricket rules regardless of team size.

---

**Implementation Date:** November 3, 2025
**Version:** 3.5.0
**Feature:** Variable Team Size Support (5-11 players)
