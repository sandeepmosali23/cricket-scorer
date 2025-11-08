# Extras Rules Implementation - Version 3.8.0

## Overview
Complete implementation of cricket extras rules for wides, no-balls, byes, and leg-byes, ensuring compliance with official cricket laws.

## Previous Issues (v3.7.0)

The previous version had **incorrect** implementation:
- ❌ **Wides** - Didn't count against bowler's runs
- ❌ **No-balls** - Didn't count runs off bat for batsman
- ❌ **No-balls** - Penalty run didn't count against bowler

## Cricket Laws for Extras

### 1. **WIDE BALL** (Law 22)

**What is a Wide?**
- Ball bowled too wide or high for batsman to hit with a normal cricket stroke
- Umpire signals wide by extending both arms horizontally

**Scoring:**
- ✅ 1 run added to team total (wide penalty)
- ✅ Any additional runs (if batsmen run) also added
- ✅ **All runs count against bowler** (wide + extras)
- ✅ Doesn't count as ball in the over
- ✅ Strike doesn't change
- ✅ Doesn't count as ball faced by batsman

**Implementation:**
```javascript
if (extra === 'wide') {
    isBall = false;                        // Doesn't count in over
    totalRuns = 1 + extraRuns;            // 1 + any runs
    bowlerRuns = totalRuns;               // ALL runs against bowler ✅
    // Strike doesn't change
}
```

**Examples:**
- **Wide (no runs):** WD → Team +1, Bowler +1
- **Wide + 2 runs:** WD+2 → Team +3, Bowler +3
- **Wide + 4 (overthrow):** WD+4 → Team +5, Bowler +5

---

### 2. **NO BALL** (Law 21)

**What is a No-Ball?**
- Illegal delivery (e.g., front foot over the line, bouncer too high, etc.)
- Umpire calls and signals no-ball

**Scoring:**
- ✅ 1 run added to team total (no-ball penalty)
- ✅ Runs scored off the bat count for the **batsman** (not as extras)
- ✅ **Only the 1-run penalty counts against bowler** (not runs off bat)
- ✅ Doesn't count as ball in the over
- ✅ Doesn't count as ball faced
- ✅ Strike changes on odd runs off the bat

**Implementation:**
```javascript
if (extra === 'noball') {
    isBall = false;                           // Doesn't count in over
    totalRuns = 1 + extraRuns;               // 1 + runs off bat

    if (extraRuns > 0) {
        updateBatsmanStats(striker, extraRuns, false); // Runs count for batsman ✅
        // Not counted as ball faced (false)
    }

    if (extraRuns % 2 !== 0) {
        // Swap strike on odd runs
        [newStriker, newNonStriker] = [nonStriker, striker];
    }

    bowlerRuns = 1;                          // Only penalty against bowler ✅
}
```

**Examples:**
- **No-ball (no runs):** NB → Team +1, Bowler +1, Batsman 0
- **NB + 1 run:** NB+1 → Team +2, Bowler +1, Batsman +1, Strike rotates
- **NB + 4 runs:** NB+4 → Team +5, Bowler +1, Batsman +4
- **NB + 6 runs:** NB+6 → Team +7, Bowler +1, Batsman +6

---

### 3. **BYE** (Law 23)

**What is a Bye?**
- Ball passes batsman without touching bat or body
- Batsmen run (or ball goes to boundary)

**Scoring:**
- ✅ Runs added to team total as "byes"
- ✅ Counts as legal delivery (ball in over)
- ✅ **Doesn't count against bowler**
- ✅ Counts as ball faced by batsman (no runs scored)
- ✅ Strike changes on odd runs

**Implementation:**
```javascript
if (extra === 'bye') {
    isBall = true;                           // Counts in over ✅
    totalRuns = extraRuns;
    bowlerRuns = 0;                          // Doesn't count against bowler ✅

    updateBatsmanStats(striker, 0, true);    // Ball faced, no runs ✅

    if (extraRuns % 2 !== 0) {
        // Swap strike on odd runs
        [newStriker, newNonStriker] = [nonStriker, striker];
    }
}
```

**Examples:**
- **1 Bye:** B1 → Team +1, Bowler 0, Batsman 0(1), Strike rotates
- **4 Byes:** B4 → Team +4, Bowler 0, Batsman 0(1)

---

### 4. **LEG BYE** (Law 23)

**What is a Leg Bye?**
- Ball hits batsman's body (not bat) and batsmen run
- Batsman must have attempted to play a shot or avoid the ball

**Scoring:**
- ✅ Runs added to team total as "leg byes"
- ✅ Counts as legal delivery (ball in over)
- ✅ **Doesn't count against bowler**
- ✅ Counts as ball faced by batsman (no runs scored)
- ✅ Strike changes on odd runs

**Implementation:**
```javascript
if (extra === 'legbye') {
    isBall = true;                           // Counts in over ✅
    totalRuns = extraRuns;
    bowlerRuns = 0;                          // Doesn't count against bowler ✅

    updateBatsmanStats(striker, 0, true);    // Ball faced, no runs ✅

    if (extraRuns % 2 !== 0) {
        // Swap strike on odd runs
        [newStriker, newNonStriker] = [nonStriker, striker];
    }
}
```

**Examples:**
- **1 Leg Bye:** LB1 → Team +1, Bowler 0, Batsman 0(1), Strike rotates
- **4 Leg Byes:** LB4 → Team +4, Bowler 0, Batsman 0(1)

---

## Complete Comparison Table

| Extra Type | Team Runs | Bowler Runs | Batsman Runs | Ball Faced? | Counts in Over? | Strike Rotates? |
|-----------|-----------|-------------|--------------|-------------|-----------------|-----------------|
| **Wide** | 1 + extra | 1 + extra ✅ | 0 | ❌ No | ❌ No | ❌ No |
| **No Ball** | 1 + runs off bat | 1 only ✅ | Runs off bat ✅ | ❌ No | ❌ No | ✅ On odd runs |
| **Bye** | Runs | 0 ✅ | 0 | ✅ Yes | ✅ Yes | ✅ On odd runs |
| **Leg Bye** | Runs | 0 ✅ | 0 | ✅ Yes | ✅ Yes | ✅ On odd runs |
| **Normal** | Runs | Runs | Runs | ✅ Yes | ✅ Yes | ✅ On odd runs |

---

## Undo Functionality

The undo function now correctly handles all extras:

### Wide Undo:
```javascript
if (lastBall.extra === 'wide') {
    runsToRemove = 1 + lastBall.extraRuns; // Remove from bowler
}
```

### No-Ball Undo:
```javascript
if (lastBall.extra === 'noball') {
    runsToRemove = 1; // Only penalty from bowler
    if (lastBall.extraRuns > 0) {
        strikerStats.runs -= lastBall.extraRuns; // Remove runs from batsman
    }
}
```

### Bye/Leg Bye Undo:
```javascript
if (lastBall.extra === 'bye' || lastBall.extra === 'legbye') {
    runsToRemove = 0; // Nothing to remove from bowler
    strikerStats.balls -= 1; // Restore ball faced
}
```

---

## Test Scenarios

### Wide Testing:
```
Scenario 1: Simple Wide
- Bowl: Wide (no runs)
- Expected: Team +1, Bowler +1, Batsman 0(0)
- Over: 0.0 → 0.0 (no change)
- Strike: No change

Scenario 2: Wide + Runs
- Bowl: Wide + 2 runs
- Expected: Team +3, Bowler +3, Batsman 0(0)
- Over: 0.0 → 0.0 (no change)
- Strike: No change
```

### No-Ball Testing:
```
Scenario 1: No-Ball (no runs)
- Bowl: No-Ball
- Expected: Team +1, Bowler +1, Batsman 0(0)
- Over: 0.0 → 0.0 (no change)
- Strike: No change

Scenario 2: NB + 1 run
- Bowl: No-Ball + 1
- Expected: Team +2, Bowler +1, Batsman +1
- Over: 0.0 → 0.0 (no change)
- Strike: ROTATES ✅

Scenario 3: NB + 4 runs
- Bowl: No-Ball + 4
- Expected: Team +5, Bowler +1, Batsman +4 (includes 1 four)
- Over: 0.0 → 0.0 (no change)
- Strike: No change (even runs)

Scenario 4: NB + 6 runs
- Bowl: No-Ball + 6
- Expected: Team +7, Bowler +1, Batsman +6 (includes 1 six)
- Over: 0.0 → 0.0 (no change)
- Strike: No change (even runs)
```

### Bye/Leg Bye Testing:
```
Scenario 1: 1 Bye
- Bowl: 1 Bye
- Expected: Team +1, Bowler 0, Batsman 0(1)
- Over: 0.0 → 0.1
- Strike: ROTATES ✅

Scenario 2: 4 Byes
- Bowl: 4 Byes
- Expected: Team +4, Bowler 0, Batsman 0(1)
- Over: 0.0 → 0.1
- Strike: No change (even runs)
```

### Over Completion with Extras:
```
Scenario: 6 legal balls + 2 wides
- Legal balls: 0, 1, 2, 3, 4, 6
- Extras: Wide, Wide
- Expected:
  - Over: 1.0 (only 6 legal balls)
  - Need to bowl 2 more legal balls for next over
  - Bowler stats: 1.0 overs, 17 runs (includes 2 wides)
```

---

## Version History

- **v3.8.0** - Fixed extras rules (wides count against bowler, no-ball runs count for batsman)
- **v3.7.1** - Fixed bowler change prompt at end of innings
- **v3.7.0** - Cricket rules compliance fixes
- **v3.6.0** - Match abandonment feature

---

## Impact on Existing Matches

**Breaking Changes:** None

Existing saved matches will continue to work. The new rules only apply to balls bowled after upgrading to v3.8.0.

---

## References

- ICC Cricket Laws: https://www.lords.org/mcc/the-laws-of-cricket
- Law 21: No Ball
- Law 22: Wide Ball
- Law 23: Byes and Leg Byes

---

## Acknowledgments

Thank you for the feedback to review extras rules! The app now fully complies with official cricket laws for all types of extras.
