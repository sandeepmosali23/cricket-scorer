# Match Abandonment Feature

## Overview
Version 3.6.0 introduces the ability to abandon matches that cannot be completed, with proper status tracking and reason documentation.

## Features

### 1. **Abandon Match Button** 🚫
- Located in the compact button bar at the bottom center of the scoring screen
- Only visible when match is in progress (not completed)
- Red circular button with 🚫 icon

### 2. **Abandon Reason Modal**
When you click the Abandon Match button, a modal appears with:

#### Available Reasons:
- ☔ **Rain/Weather** - Match stopped due to rain or bad weather
- 🌙 **Darkness/Bad Light** - Match stopped due to darkness or poor light conditions
- 🩹 **Player Injury** - Match stopped due to player injury
- 🤝 **Mutual Consent** - Both teams agreed to stop the match
- ⏰ **Time Constraint** - Ran out of time to complete the match
- 🏟️ **Ground Conditions** - Unsafe or unplayable ground conditions
- 📝 **Other Reason** - Any other reason not listed above

### 3. **Match Status Tracking**
All matches now have one of three statuses:
- **In Progress** - Match is currently being scored (yellow badge)
- **Completed** - Match finished normally (green badge)
- **Abandoned** - Match was stopped before completion (red badge)

### 4. **Status Display**
Status badges appear in:
- Match history list (Browse Matches)
- Match results viewer
- Recent matches on home page
- Saved match details

## How to Use

### Abandoning a Match:

1. During scoring, click the **🚫 Abandon Match** button in the bottom button bar
2. Select the reason for abandonment from the dropdown
3. Click **"Abandon Match"** button to confirm
4. The match will be marked as complete with "Abandoned" status
5. You'll be prompted to save the match (automatically includes "ABANDONED" in the name)
6. The current score and all player stats are saved with the abandoned status

### Viewing Abandoned Matches:

1. Abandoned matches appear in your match history with a **red "Abandoned" badge**
2. The reason for abandonment is displayed in the match result
3. Example: "Match Abandoned (Rain/Weather)"

## Technical Details

### State Variables
```javascript
matchStatus: 'in-progress' | 'completed' | 'abandoned'
abandonReason: 'rain' | 'darkness' | 'injury' | 'mutual' | 'time' | 'ground' | 'other' | ''
showAbandonModal: boolean
```

### Match Data Structure
Saved matches now include:
```javascript
{
  ...matchData,
  matchStatus: 'abandoned',
  abandonReason: 'rain' // or other reason code
}
```

### Result Display Function
The `getSavedMatchResult()` function checks for abandoned status first, before checking completion status.

## Benefits

1. **Proper Record Keeping** - Maintain accurate records of all matches, even incomplete ones
2. **Statistical Accuracy** - Clearly distinguish between completed and abandoned matches
3. **Context** - Know why matches were stopped (weather, injury, etc.)
4. **Resume Option** - Abandoned matches are saved with current state, can be reviewed later
5. **Mobile-Friendly** - Compact button design doesn't interfere with scoring

## User Experience

### Before Abandonment:
- Match is in progress
- All stats are being tracked normally
- Full scoring interface available

### During Abandonment:
1. Click 🚫 button
2. Modal appears with reason dropdown
3. Select reason (required)
4. Confirm abandonment
5. Auto-prompt to save

### After Abandonment:
- Match is marked complete (can't score further)
- Status shows as "Abandoned" with reason
- All current scores and stats are preserved
- Match appears in history with red badge

## Mobile Optimizations

The abandon button is part of the new compact button bar:
- **Position**: Bottom center (doesn't cover score panel)
- **Size**: 32px circular button
- **Visibility**: Only when match is in progress
- **Access**: Easy thumb reach on mobile devices

## Version History

- **v3.6.0** - Initial release of abandon match feature
  - Added match status tracking (in-progress, completed, abandoned)
  - Added abandon reason modal with 7 predefined reasons
  - Added status badges to all match displays
  - Updated save logic to store status and reason
  - Updated result display to show abandoned matches

## Future Enhancements (Potential)

- Filter matches by status (show only completed, only abandoned, etc.)
- Statistics exclusion option (exclude abandoned matches from player stats)
- Resume abandoned matches (continue scoring if conditions improve)
- Custom abandon reason text field
- Match report generation including abandonment details
