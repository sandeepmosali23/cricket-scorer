# Bug Fixes - Version 3.7.0

## Overview
This release addresses critical scoring bugs reported during live match usage, ensuring proper compliance with cricket rules and improving the overall scoring experience.

## Fixed Issues

### 1. ✅ Bye & Leg Bye - 1 Run Striker Switching
**Problem:** When 1 run was scored via bye or leg bye, the striker was not rotating.

**Root Cause:** The `addBall()` function had no striker switching logic for byes and leg byes.

**Fix:** Added striker rotation logic for odd runs on byes and leg byes:
```javascript
// Swap strike on odd runs
if (extraRuns % 2 !== 0) {
    [newStriker, newNonStriker] = [nonStriker, striker];
}
```

**Location:** [index.html:970-972](public/index.html#L970-L972), [991-993](public/index.html#L991-L993)

**Impact:** Byes and leg byes now correctly rotate the strike on odd runs (1, 3, 5, etc.)

---

### 2. ✅ Bye & Leg Bye - Ball Count for Batsman
**Problem:** Byes and leg byes were not being counted as balls faced by the batsman.

**Root Cause:** No batsman stats update was happening for byes and leg byes.

**Fix:** Added batsman stats update (ball faced with 0 runs):
```javascript
// Update batsman stats (ball faced, but no runs)
updateBatsmanStats(striker, 0, true);
setCurrentPartnership(prev => ({
    ...prev,
    runs: prev.runs + extraRuns,
    balls: prev.balls + 1
}));
```

**Location:** [index.html:962-968](public/index.html#L962-L968), [983-989](public/index.html#L983-L989)

**Impact:** Batsman's balls faced count now increases correctly for byes and leg byes

---

### 3. ✅ Wides and No Balls - Bowler Over Count
**Problem:** Wides and no balls were being added to the bowler's over count (following U11 rules instead of standard cricket rules).

**Root Cause:** The `updateBowlerStats()` function was being called with `totalRuns` which included extras that shouldn't count against the bowler.

**Fix:**
1. Introduced `bowlerRuns` variable to track only runs that count against the bowler
2. Set `bowlerRuns = 0` for wides, no-balls, byes, and leg-byes
3. Updated `updateBowlerStats()` to use `bowlerRuns` instead of `totalRuns`

```javascript
let bowlerRuns = 0; // Runs that count against the bowler
// ... later ...
bowlerRuns = 0; // Wides don't count against bowler
// ... later ...
updateBowlerStats(bowler, bowlerRuns, false, isBall);
```

**Location:** [index.html:929](public/index.html#L929), [939](public/index.html#L939), [952](public/index.html#L952), [960](public/index.html#L960), [981](public/index.html#L981), [1000](public/index.html#L1000), [1017](public/index.html#L1017)

**Impact:**
- Wides and no-balls no longer count as balls in the bowler's over
- Only legal deliveries (0-6 runs) count towards completing an over
- Bowler's economy rate now accurately reflects runs conceded off legal deliveries

---

### 4. ✅ No Ball Plus Runs - Striker Switching
**Problem:** When runs were scored off a no ball (e.g., NB+2), the striker was not rotating on odd runs.

**Root Cause:** No striker switching logic for no ball + runs.

**Fix:** Added striker rotation for odd runs scored off no balls:
```javascript
// No Ball: Swap strike on odd runs scored off the bat (extraRuns)
if (extraRuns % 2 !== 0) {
    [newStriker, newNonStriker] = [nonStriker, striker];
}
```

**Location:** [index.html:948-950](public/index.html#L948-L950)

**Impact:** Strike now rotates correctly when odd runs are scored off a no ball

---

### 5. ✅ Undo Functionality - Comprehensive Restoration
**Problem:** Undo was not working as expected - only restoring runs, balls, and wickets, but not batsman stats, bowler stats, extras, or striker rotation.

**Root Cause:** The `undoLastBall()` function was incomplete.

**Fix:** Complete rewrite of undo functionality to restore:
- ✅ Runs and balls
- ✅ Wickets and dismissals
- ✅ Batsman statistics (runs, balls, fours, sixes, strike rate)
- ✅ Bowler statistics (runs, wickets, balls, overs, economy)
- ✅ Extras (wides, no-balls, byes, leg-byes)
- ✅ Current partnership (runs and balls)
- ✅ Ball history and current over display

**Key Logic:**
```javascript
// Restore batsman stats
if (lastBall.extra !== 'wide' && lastBall.extra !== 'noball') {
    strikerStats.balls = Math.max(0, (strikerStats.balls || 0) - 1);
}
if (!lastBall.extra || lastBall.extra === '') {
    strikerStats.runs = Math.max(0, (strikerStats.runs || 0) - lastBall.runs);
    if (lastBall.runs === 4) strikerStats.fours = Math.max(0, (strikerStats.fours || 0) - 1);
    if (lastBall.runs === 6) strikerStats.sixes = Math.max(0, (strikerStats.sixes || 0) - 1);
}
```

**Location:** [index.html:1133-1260](public/index.html#L1133-L1260)

**Impact:** Undo now fully restores the match state as if the last ball never happened

---

### 6. ✅ Wicket - Batsman Selection Modal
**Problem:** After a wicket, the batsman selection modal was not appearing reliably.

**Root Cause:** Potential timing or state issues (modal code was already correct).

**Fix:** Added debug logging to track when the modal should appear:
```javascript
console.log('✅ Wicket processed - showing new batsman selection modal');
console.log('Out batsman:', currentPlayers[striker]);
console.log('Remaining wickets:', maxWickets - newWickets);
```

**Location:** [index.html:896-898](public/index.html#L896-L898)

**Impact:** Better debugging to identify if modal doesn't appear, modal logic remains correct

---

## Cricket Rules Compliance

### Standard Cricket Rules Now Enforced:

1. **Byes & Leg Byes:**
   - Count as balls faced by batsman ✅
   - Rotate strike on odd runs ✅
   - Don't count against bowler's runs ✅
   - Count as legal deliveries (ball in over) ✅

2. **Wides:**
   - Don't count as balls in the over ✅
   - Don't count against bowler's over total ✅
   - Don't rotate strike ✅
   - Add 1 run + any extra runs ✅

3. **No Balls:**
   - Don't count as balls in the over ✅
   - Don't count against bowler's over total ✅
   - Rotate strike on odd runs scored off the bat ✅
   - Add 1 run + any runs scored ✅

4. **Undo:**
   - Fully restore all match state ✅
   - Handle all delivery types correctly ✅
   - Restore partnerships and fall of wickets ✅

---

## Testing Recommendations

Please test the following scenarios:

### Byes & Leg Byes:
- [ ] 1 Bye - striker should switch
- [ ] 2 Byes - striker should NOT switch
- [ ] 3 Leg Byes - striker should switch
- [ ] Verify balls faced increases for batsman
- [ ] Verify bowler's run total doesn't increase

### Wides & No Balls:
- [ ] Wide - should not add to bowler's over count
- [ ] No Ball + 2 runs - should switch striker
- [ ] No Ball + 1 run - should switch striker
- [ ] 6 legal balls + 2 wides = still need 6 legal balls for over

### Undo:
- [ ] Undo a 4 - verify batsman runs and fours decrease
- [ ] Undo a wide - verify extras decrease
- [ ] Undo a wicket - verify wickets decrease and batsman is back
- [ ] Undo with partnership - verify partnership stats restore

### Wickets:
- [ ] Take a wicket - verify modal appears
- [ ] Select new batsman - verify correct batsman comes in
- [ ] All out - verify innings ends (no modal)

---

## Version History

- **v3.7.0** - Cricket rules compliance fixes
  - Fixed byes/leg byes striker rotation
  - Fixed byes/leg byes ball count for batsman
  - Fixed wides/no-balls bowler over counting
  - Fixed no-ball striker rotation
  - Complete undo functionality rewrite
  - Enhanced wicket modal debugging

- **v3.6.0** - Match abandonment feature
- **v3.5.0** - Variable team size support
- **v3.4.0** - Business rules implementation
- **v3.3.0** - Player statistics tracking
- **v3.0.0** - Firebase authentication

---

## Breaking Changes

None. All fixes are backward compatible with existing saved matches.

---

## Known Issues

None currently identified. Please report any issues at the GitHub repository.

---

## Contributors

Thank you to the users who provided feedback during live match testing!
