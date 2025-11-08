# Toss Feature - Version 3.9.0

## Overview
Version 3.9.0 introduces a complete toss functionality that allows users to record which team won the toss and their decision (bat or bowl first), providing a more authentic cricket match experience.

## Features

### 1. Toss Modal
- Appears automatically after match setup (before first ball)
- Clean, intuitive interface with visual feedback
- Two-step selection process:
  1. **Select toss winner** (Team 1 or Team 2)
  2. **Select decision** (Bat First or Bowl First)

### 2. Batting Order Determination
The app automatically determines which team bats first based on the toss decision:
- **Bat First**: Toss winner bats in 1st innings
- **Bowl First**: Toss winner bowls in 1st innings (other team bats)

### 3. Toss Display in Scorecard
Toss information is prominently displayed in:
- **Live Scorecard Tab**: Shows toss result at the top
- **Match Results Viewer**: Displays toss details for saved matches
- **Saved Match Details**: Shows complete toss information

### 4. Data Persistence
Toss data is saved with the match in both:
- **Local Storage**: For offline matches
- **Firebase Cloud**: For cloud-saved matches

## User Flow

### Starting a New Match:

1. **Setup Match**
   - Enter team names
   - Add players (2-11 per team)
   - Select match format (T20, ODI, Test, Custom)
   - Click "Start Match"

2. **Toss Modal Appears**
   - Modal shows with title "Toss" and coin emoji
   - Question: "Which team won the toss?"
   - Two buttons: Team 1 Name | Team 2 Name

3. **Select Toss Winner**
   - Click on the team that won the toss
   - Selected team button turns yellow/orange
   - New question appears: "Decision?"

4. **Select Decision**
   - Two buttons: "Bat First" | "Bowl First"
   - Click the decision made by toss winner
   - Selected button turns yellow/orange

5. **Confirm & Start**
   - Click "Confirm & Start Match" button
   - App automatically sets batting order based on decision
   - Match begins with correct teams batting/bowling

### Viewing Toss Information:

**In Live Scorecard:**
- Switch to "Scorecard" tab
- Toss info displayed at top in yellow/orange banner
- Shows: "[Team Name] won the toss and chose to [Bat/Bowl] First"

**In Saved Matches:**
- Open "Browse Matches" or view match results
- Select any match
- Toss details shown below match result
- Same format: "[Team Name] won the toss and chose to [Bat/Bowl] First"

## Technical Details

### State Variables
```javascript
const [showTossModal, setShowTossModal] = useState(false);
const [tossWinner, setTossWinner] = useState(null); // 'team1' or 'team2'
const [tossDecision, setTossDecision] = useState(null); // 'bat' or 'bowl'
const [tossComplete, setTossComplete] = useState(false);
```

### Batting Team Assignment Logic
```javascript
// If toss winner chose to bat
if (tossDecision === 'bat') {
    setBattingTeam(tossWinner); // Toss winner bats first
}
// If toss winner chose to bowl
else {
    setBattingTeam(tossWinner === 'team1' ? 'team2' : 'team1'); // Other team bats
}
```

### Match Data Structure
```javascript
{
    // ... existing match data
    tossWinner: 'team1', // or 'team2'
    tossDecision: 'bat', // or 'bowl'
    tossComplete: true
}
```

### Save Functions Updated
Both `saveMatch()` (local) and `saveMatchToCloud()` (cloud) now include:
- `tossWinner`
- `tossDecision`
- `tossComplete`

### Load Functions Updated
Both `loadMatch()` (local) and `loadMatchFromCloud()` (cloud) now restore:
```javascript
setTossWinner(match.tossWinner || null);
setTossDecision(match.tossDecision || null);
setTossComplete(match.tossComplete || false);
```

## UI Components

### Toss Modal Design
- **Background**: Semi-transparent black overlay with backdrop blur
- **Modal**: White rounded card with shadow
- **Header**: Yellow-to-orange gradient with coin emoji
- **Team Buttons**: White with hover effect, selected state turns yellow
- **Decision Buttons**: Same styling as team buttons
- **Confirm Button**: Green gradient, disabled until both selections made

### Toss Display Card
- **Background**: Yellow-to-orange gradient (matching modal)
- **Border**: Yellow border
- **Layout**: Centered text with coin emoji
- **Text**: Bold team name and decision in readable format

## Benefits

1. **Authentic Cricket Experience**: Matches the real-world cricket process
2. **Automatic Batting Order**: No manual selection needed - app determines based on toss
3. **Complete Match Records**: Toss information saved for historical accuracy
4. **User-Friendly**: Simple two-step process with clear visual feedback
5. **Professional Presentation**: Toss displayed prominently in scorecards

## Code Locations

### State Variables
- **File**: [index.html:64-68](public/index.html#L64-L68)

### Toss Modal UI
- **File**: [index.html:5903-6018](public/index.html#L5903-L6018)
- Complete modal with team selection, decision selection, and confirmation

### Match Start Modified
- **File**: [index.html:2214](public/index.html#L2214)
- Changed from direct start to showing toss modal

### Local Save/Load
- **Save**: [index.html:1426-1429](public/index.html#L1426-L1429)
- **Load**: [index.html:1478-1481](public/index.html#L1478-L1481)

### Cloud Save/Load
- **Save**: [index.html:1559-1562](public/index.html#L1559-L1562)
- **Load**: [index.html:1626-1629](public/index.html#L1626-L1629)

### Scorecard Display
- **Live Scorecard**: [index.html:4012-4025](public/index.html#L4012-L4025)
- **Match Results Viewer**: [index.html:5668-5681](public/index.html#L5668-L5681)

## Examples

### Example 1: Team A wins toss and bats first
1. Toss modal: Select "Team A"
2. Decision: Select "Bat First"
3. Result: Team A bats in 1st innings, Team B bowls
4. Display: "Team A won the toss and chose to Bat First"

### Example 2: Team B wins toss and bowls first
1. Toss modal: Select "Team B"
2. Decision: Select "Bowl First"
3. Result: Team A bats in 1st innings, Team B bowls
4. Display: "Team B won the toss and chose to Bowl First"

## Testing Scenarios

### Scenario 1: Complete New Match
- [ ] Set up teams and players
- [ ] Click "Start Match"
- [ ] Verify toss modal appears
- [ ] Select toss winner
- [ ] Select decision
- [ ] Verify correct team bats first
- [ ] Check scorecard shows toss info

### Scenario 2: Save and Load
- [ ] Complete toss and start match
- [ ] Score some runs
- [ ] Save match (local or cloud)
- [ ] Load the match
- [ ] Verify toss data is restored
- [ ] Check toss displays correctly

### Scenario 3: Match Results Viewer
- [ ] Save completed match with toss data
- [ ] Go to "Browse Matches"
- [ ] View match details
- [ ] Verify toss information is displayed

### Scenario 4: Both Toss Decisions
- [ ] Test "Bat First" decision
- [ ] Test "Bowl First" decision
- [ ] Verify batting order is correct for both

## Version History

- **v3.9.0** - Toss functionality implementation
  - Added toss modal before match start
  - Automatic batting order determination
  - Toss data persistence (local and cloud)
  - Toss display in scorecards and match viewer

- **v3.8.1** - Undo wicket restoration fix
- **v3.8.0** - Extras rules compliance (wides/no-balls)
- **v3.7.1** - End of innings bowler prompt fix
- **v3.7.0** - Cricket rules compliance fixes

## Breaking Changes

None. Existing saved matches without toss data will continue to work normally.

## Future Enhancements (Potential)

- Add "neutral venue" option for toss
- Track toss statistics (how often teams bat/bowl first)
- Add toss outcome to match reports
- Include toss in PDF scorecard downloads
- Add "skip toss" option for practice matches

## Notes

- Toss modal cannot be bypassed - must make selections to start match
- Toss data is optional for old matches (backward compatible)
- Toss information is display-only after match starts (cannot be changed mid-match)
- If toss data is missing from old matches, toss card won't display
