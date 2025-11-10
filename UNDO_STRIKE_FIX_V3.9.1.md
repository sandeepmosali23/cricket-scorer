# Undo Strike Rotation Fix - Version 3.9.1

## Issue
When undoing a ball, the striker and non-striker positions were not being restored correctly for regular balls. Strike rotation caused by odd runs or over completion was not being reversed during undo.

## Example Scenario

### Before Fix:
```
Ball 1: Striker = Player 0, Non-Striker = Player 1
Player 0 scores 3 runs → Strike rotates
Ball 2: Striker = Player 1, Non-Striker = Player 0

User clicks UNDO
Ball 1 stats restored (runs, balls) ✅
BUT: Striker = Player 1, Non-Striker = Player 0 ❌ (WRONG!)

Expected: Striker = Player 0, Non-Striker = Player 1 (original positions)
```

## Root Cause
The undo function (`undoLastBall()`) was only restoring striker/non-striker positions for **wicket balls**, but not for regular balls.

### Original Code (Lines 1189-1217):
```javascript
// Restore wickets
if (lastBall.wicket) {
    setWickets(prev => prev - 1);
    setFallOfWickets(prev => prev.slice(0, -1));
    setPartnerships(prev => prev.slice(0, -1));

    // Restore the dismissed batsman's stats
    if (lastBall.outPlayer !== null && lastBall.outPlayer !== undefined) {
        setBatsmanStats(prev => ({
            ...prev,
            [lastBall.outPlayer]: {
                ...prev[lastBall.outPlayer],
                isOut: false,
                dismissal: null,
                status: 'batting'
            }
        }));

        // CRITICAL: Restore both batsmen to their positions before the wicket
        // The dismissed batsman was the striker
        setStriker(lastBall.striker);  // ❌ Only done for wickets!
        // Restore the non-striker (who was also batting when wicket fell)
        if (lastBall.nonStriker !== null && lastBall.nonStriker !== undefined) {
            setNonStriker(lastBall.nonStriker);  // ❌ Only done for wickets!
        }

        console.log(`✅ Wicket undone: ${currentPlayers[lastBall.outPlayer]} restored to batting`);
    }
}
// ❌ No strike restoration for non-wicket balls!
```

**Problem:** Strike restoration was INSIDE the `if (lastBall.wicket)` block, so it only happened when undoing wickets. Regular balls with strike rotation were not handled.

## Solution
Move the striker/non-striker restoration **outside** the wicket check, so it applies to ALL balls (wicket or not).

### Fixed Code (Lines 1189-1219):
```javascript
// Restore wickets
if (lastBall.wicket) {
    setWickets(prev => prev - 1);
    setFallOfWickets(prev => prev.slice(0, -1));
    setPartnerships(prev => prev.slice(0, -1));

    // Restore the dismissed batsman's stats
    if (lastBall.outPlayer !== null && lastBall.outPlayer !== undefined) {
        setBatsmanStats(prev => ({
            ...prev,
            [lastBall.outPlayer]: {
                ...prev[lastBall.outPlayer],
                isOut: false,
                dismissal: null,
                status: 'batting'
            }
        }));

        console.log(`✅ Wicket undone: ${currentPlayers[lastBall.outPlayer]} restored to batting`);
    }
}

// CRITICAL: Restore striker and non-striker for ALL balls (wicket or not)
// This handles strike rotation caused by odd runs, overs completion, etc.
if (lastBall.striker !== null && lastBall.striker !== undefined) {
    setStriker(lastBall.striker);  // ✅ Restored for ALL balls!
}
if (lastBall.nonStriker !== null && lastBall.nonStriker !== undefined) {
    setNonStriker(lastBall.nonStriker);  // ✅ Restored for ALL balls!
}
console.log(`↩️ Strike restored: Striker=${currentPlayers[lastBall.striker]}, Non-striker=${currentPlayers[lastBall.nonStriker]}`);
```

## What This Fixes

### Scenario 1: Odd Runs (Strike Rotation)
**Before Fix:**
```
Ball: Player 0 (striker) scores 3 runs
→ Strike rotates to Player 1
Undo → Player 1 still striker ❌
```

**After Fix:**
```
Ball: Player 0 (striker) scores 3 runs
→ Strike rotates to Player 1
Undo → Player 0 back as striker ✅
```

### Scenario 2: Over Completion (Strike Rotation)
**Before Fix:**
```
Last ball of over: Player 0 (striker) scores 2 runs
→ Over complete, strike rotates to Player 1
Undo → Player 1 still striker ❌
```

**After Fix:**
```
Last ball of over: Player 0 (striker) scores 2 runs
→ Over complete, strike rotates to Player 1
Undo → Player 0 back as striker ✅
```

### Scenario 3: Bye/Leg Bye with Odd Runs
**Before Fix:**
```
Ball: 1 bye (striker = Player 0)
→ Strike rotates to Player 1
Undo → Player 1 still striker ❌
```

**After Fix:**
```
Ball: 1 bye (striker = Player 0)
→ Strike rotates to Player 1
Undo → Player 0 back as striker ✅
```

### Scenario 4: No-Ball + Runs
**Before Fix:**
```
Ball: No-ball + 3 runs (striker = Player 0)
→ Strike rotates to Player 1
Undo → Player 1 still striker ❌
```

**After Fix:**
```
Ball: No-ball + 3 runs (striker = Player 0)
→ Strike rotates to Player 1
Undo → Player 0 back as striker ✅
```

## Technical Details

### Ball Data Structure
Each ball in `ballHistory` stores the striker and non-striker:
```javascript
const newBallData = {
    runs: runsScored,
    wicket: false,
    extra: extra,
    extraRuns: extraRuns,
    totalRuns: totalRuns,
    outPlayer: null,
    text: ballText,
    over: overs,
    ball: balls,
    striker: striker,          // Batsman facing the ball
    nonStriker: nonStriker,    // Batsman at other end
    bowler: bowler
};
```

### Strike Rotation Points in Code
Strike rotation happens at these locations:
1. **Odd runs scored** - [index.html:1034](public/index.html#L1034)
2. **Bye odd runs** - [index.html:972](public/index.html#L972)
3. **Leg bye odd runs** - [index.html:995](public/index.html#L995)
4. **No-ball + odd runs** - [index.html:1016](public/index.html#L1016)
5. **Over completion** - [index.html:1056](public/index.html#L1056)

All these scenarios are now correctly handled by the undo function.

## Code Changes

### File: [public/index.html](public/index.html)

**Lines Changed:** 1189-1219

**What Changed:**
- Moved `setStriker()` and `setNonStriker()` outside the wicket check
- Now applies to ALL ball types (wicket, regular, extras)
- Added debug log for strike restoration

## Testing

### Test Scenarios:

#### Test 1: Undo Single Run (No Rotation)
```
1. Player 0 scores 2 runs (even)
2. Click Undo
3. ✅ Verify: Player 0 still striker (no rotation expected)
```

#### Test 2: Undo Odd Runs (Rotation)
```
1. Player 0 scores 1 run
2. Strike rotates to Player 1
3. Click Undo
4. ✅ Verify: Player 0 back as striker
```

#### Test 3: Undo Over Complete
```
1. Player 0 faces last ball of over, scores 0
2. Over complete, strike rotates to Player 1
3. Click Undo
4. ✅ Verify: Player 0 back as striker, ball count restored
```

#### Test 4: Undo Bye/Leg Bye
```
1. 1 bye scored (Player 0 striker)
2. Strike rotates to Player 1
3. Click Undo
4. ✅ Verify: Player 0 back as striker, bye removed
```

#### Test 5: Undo Wicket
```
1. Player 0 gets out, Player 2 comes in
2. Click Undo
3. ✅ Verify: Player 0 back as striker, Player 2 removed
```

### Status: **FIXED AND READY FOR TESTING** ✅

## Related Issues

This fix completes the undo functionality that was partially implemented in:
- **v3.7.0** - Initial comprehensive undo implementation
- **v3.8.1** - Undo wicket restoration (batsman positions)
- **v3.9.1** - **THIS FIX** - Undo strike rotation for all balls

## Files Modified

- **[public/index.html:1211-1219](public/index.html#L1211-L1219)** - Added strike restoration for all balls
- **[package.json:3](package.json#L3)** - Version updated to 3.9.1

## Related Documentation

- [BUGFIXES_V3.7.0.md](BUGFIXES_V3.7.0.md) - Initial undo implementation
- [UNDO_WICKET_FIX_V3.8.1.md](UNDO_WICKET_FIX_V3.8.1.md) - Wicket undo fix
- [TOSS_FEATURE_V3.9.0.md](TOSS_FEATURE_V3.9.0.md) - Toss functionality
- [TOSS_MODAL_FIX_V3.9.0.md](TOSS_MODAL_FIX_V3.9.0.md) - Toss modal placement fix

## Version History

- **v3.9.1** - Undo strike rotation fix (all balls)
- **v3.9.0** - Toss functionality + modal placement fix
- **v3.8.1** - Undo wicket restoration fix
- **v3.8.0** - Extras rules compliance
- **v3.7.1** - End of innings bowler prompt fix
- **v3.7.0** - Cricket rules compliance fixes

---

**Date:** 2025-11-10
**Fixed By:** Claude Code Session
**Status:** ✅ Fixed - Ready for Testing
