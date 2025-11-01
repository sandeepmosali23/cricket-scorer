# 🤖 Claude Prompts for Cricket Scorer Development

Pre-written prompts to use with Claude Dev plugin in VS Code.

## 📚 Understanding the Codebase

### General Understanding
```
Claude, I'm new to this cricket scorer codebase. Can you give me a high-level overview 
of how the app is structured? Reference @cricket-scorer-complete.html
```

### Specific Features
```
Claude, explain how the dismissal modal system works. Show me the flow from clicking 
"OUT" to recording the wicket with all details.
```

```
Claude, walk me through the ball scoring logic. How does the app handle regular balls 
vs extras like wides and no-balls?
```

```
Claude, explain the state management. What are all the main state variables and what 
do they control?
```

### Component Analysis
```
Claude, analyze the DismissalModal section. What props does it need and how does it 
communicate back to the parent component?
```

```
Claude, explain how the partnership tracking works. When does a partnership start 
and end?
```

## 🛠️ Adding Features

### Data Persistence
```
Claude, I want to add localStorage support so match data persists on page refresh. 
Help me:
1. Identify what data needs to be saved
2. Show me where to add save/load logic
3. Handle edge cases and errors
```

### New Match Formats
```
Claude, I want to add "The Hundred" format (100 balls, not overs). Help me:
1. Add it to the format selector
2. Modify the ball counting logic
3. Update the display to show balls instead of overs
```

### Player Database
```
Claude, I want to create a simple player database that stores player info across matches.
Help me design:
1. The data structure
2. Where to store it (localStorage)
3. How to integrate with team selection
```

### Match History
```
Claude, I want to add a "Match History" feature that shows previous matches.
Help me:
1. Design the data structure for storing matches
2. Create a new tab for viewing history
3. Add ability to view old scorecards
```

### Export Features
```
Claude, I want to add export functionality to save scorecards as:
1. JSON (raw data)
2. CSV (for Excel)
3. PDF (formatted scorecard)

Help me implement each format.
```

### Keyboard Shortcuts
```
Claude, I want to add keyboard shortcuts for scoring (0-6 keys, W for wicket, etc.).
Help me:
1. Set up event listeners
2. Handle shortcuts during match
3. Show shortcut help modal
```

### Match Timer
```
Claude, add a match timer that shows:
1. Total match duration
2. Current innings time
3. Estimated finish time

Where should I add this in the UI?
```

## 🐛 Debugging and Fixes

### General Debugging
```
Claude, when I click [action], [unexpected behavior] happens. Help me debug this.
The console shows: [paste error]
```

### Specific Issues
```
Claude, the undo button doesn't work correctly for wide balls. When I undo a wide,
the runs don't revert properly. Can you analyze the undoLastBall function and fix it?
```

```
Claude, after 10 wickets, the app should end the innings, but it's not happening.
Help me debug the innings completion logic.
```

```
Claude, the strike rotation isn't working correctly when a batsman is out.
The non-striker should become striker but it's not happening. Fix please.
```

```
Claude, the Manhattan chart isn't displaying correctly when there are more than 
20 overs. Help me fix the visualization.
```

## 🎨 UI Improvements

### Mobile Optimization
```
Claude, the scoring buttons are too small on mobile devices. Help me:
1. Make them larger and more touch-friendly
2. Optimize the layout for small screens
3. Improve the scorecard table for mobile
```

### Better Animations
```
Claude, add smooth animations for:
1. Ball appearing in current over
2. Score updating
3. Tab transitions
4. Modal open/close

Keep performance in mind.
```

### Color Scheme
```
Claude, I want to change from green/blue theme to:
- Primary: [color]
- Secondary: [color]
- Accent: [color]

Help me find and replace all color classes and gradients.
```

### Improved Scorecard
```
Claude, redesign the scorecard layout to be more like official cricket scorecards.
Show me a better structure and help implement it.
```

## 🔧 Refactoring

### Component Extraction
```
Claude, the main component is too large (2500+ lines). Help me break it into:
1. Separate component files (DismissalModal, SetupScreen, LiveScore, etc.)
2. Utility functions
3. Constants file
4. Custom hooks

Show me step-by-step how to do this.
```

### Function Simplification
```
Claude, the addBall function is very complex. Help me:
1. Break it into smaller functions
2. Add better comments
3. Handle edge cases more clearly
4. Improve readability
```

### State Management
```
Claude, should I consider using Context API or a state management library for this app?
Analyze the current state structure and suggest improvements.
```

### Code Organization
```
Claude, help me create a better folder structure:
/src
  /components
  /hooks
  /utils
  /constants
  /styles

Show me what goes where and help migrate the code.
```

## 🧪 Testing

### Unit Tests
```
Claude, I want to add unit tests. Help me:
1. Choose a testing framework (Jest?)
2. Write tests for utility functions
3. Test the run rate calculation
4. Test strike rotation logic
```

### Integration Tests
```
Claude, write integration tests for:
1. Scoring a complete over
2. Taking a wicket
3. Innings transition
4. Match completion
```

### Test Scenarios
```
Claude, help me create test scenarios for:
1. All 10 wickets falling
2. Match reaching over limit
3. Team chasing target
4. Match tie
5. Retired batsman returning
```

## 📊 Advanced Features

### Analytics Dashboard
```
Claude, I want to add an analytics dashboard showing:
1. Scoring patterns (Manhattan chart improvements)
2. Batting average by position
3. Bowling economy comparison
4. Partnership analysis

Help me design and implement this.
```

### Live Sharing
```
Claude, I want to add live sharing so others can view the match in real-time.
What's the best approach? Should I use:
- WebSockets?
- Firebase Realtime Database?
- Something else?

Help me implement it.
```

### Backend Integration
```
Claude, I want to add a backend to store matches permanently. Help me:
1. Design the API endpoints
2. Choose a backend (Node.js/Express?)
3. Implement user authentication
4. Sync local and server data
```

### Tournament Mode
```
Claude, I want to add tournament management:
1. Create tournament with multiple teams
2. Manage fixtures/schedule
3. Points table
4. Knockout stages

Help me design the data structure and UI.
```

## 🎓 Learning and Improvement

### Code Review
```
Claude, review the current codebase and suggest:
1. Code quality improvements
2. Performance optimizations
3. Best practices to follow
4. Potential bugs to fix
```

### Best Practices
```
Claude, analyze my code and tell me if I'm following React best practices for:
1. State management
2. Component structure
3. Event handling
4. Performance
```

### Performance
```
Claude, help me optimize the app performance:
1. Identify slow operations
2. Suggest memoization opportunities
3. Reduce re-renders
4. Improve load time
```

### Accessibility
```
Claude, help me make the app more accessible:
1. Add ARIA labels
2. Improve keyboard navigation
3. Add screen reader support
4. Ensure color contrast
```

## 🚀 Deployment

### Build Process
```
Claude, help me create a production build process:
1. Minify the code
2. Optimize assets
3. Generate single HTML file
4. Create deployment script
```

### Environment Setup
```
Claude, help me set up different environments:
1. Development (with debug tools)
2. Staging (for testing)
3. Production (optimized)

Show me how to manage configs.
```

## 💡 Creative Ideas

### AI Features
```
Claude, I want to add AI-powered features:
1. Suggest bowling changes based on match situation
2. Predict match outcome
3. Analyze player performance
4. Recommend strategies

What's feasible and how would I implement it?
```

### Voice Input
```
Claude, I want to add voice commands for scoring:
- "Four runs"
- "Wicket caught"
- "Wide ball"

Help me implement speech recognition.
```

### Augmented Reality
```
Claude, could I add AR features like:
- Field placement visualization
- Wagon wheel in 3D
- Live score overlay

Is this feasible for a web app?
```

## 🎯 Task-Specific Prompts

### Quick Fixes
```
Claude, quick fix: [describe issue in 1 sentence]
```

### Feature Estimation
```
Claude, how long would it take to implement [feature]?
What are the main challenges?
```

### Code Explanation
```
Claude, explain this code block line by line:
[paste code]
```

### Alternative Approaches
```
Claude, I'm implementing [feature] this way: [describe].
Are there better approaches? What are the pros/cons?
```

## 📝 Template Prompts

### New Feature Template
```
Claude, I want to add [FEATURE NAME].

Requirements:
- [Requirement 1]
- [Requirement 2]
- [Requirement 3]

Help me:
1. Design the data structure
2. Plan the implementation
3. Identify files to modify
4. Write the code
5. Add tests
```

### Bug Fix Template
```
Claude, I found a bug:

What happens: [Describe actual behavior]
What should happen: [Describe expected behavior]
Steps to reproduce:
1. [Step 1]
2. [Step 2]
3. [Step 3]

Error message (if any): [Paste error]

Help me fix it.
```

### Code Review Template
```
Claude, review this code:

[Paste code]

Check for:
1. Bugs
2. Performance issues
3. Best practices
4. Readability
5. Edge cases

Suggest improvements.
```

## 🎉 Fun Experiments

```
Claude, let's make the app more fun! Add:
1. Sound effects for boundaries
2. Celebration animations for wickets
3. Commentary text that updates with score
4. Player of the match automatic selection

Help me implement these!
```

```
Claude, add Easter eggs:
1. Secret theme selector (Ctrl+Shift+T)
2. Retro mode (90s UI)
3. Funny commentary for milestones
4. Confetti for match wins
```

## 💬 Conversational Prompts

### Exploring Ideas
```
Claude, I'm thinking about adding [vague idea]. 
Let's brainstorm together. What would that look like?
What challenges might there be?
```

### Decision Making
```
Claude, I need to choose between:
1. [Option A]
2. [Option B]

Help me analyze the pros and cons of each.
```

### Learning
```
Claude, I don't understand [concept/code].
Can you explain it like I'm 5?
Then give me a practical example from this codebase.
```

## 🔄 Iterative Development

### Initial Implementation
```
Claude, let's implement [feature] in iterations:

Iteration 1 (MVP): [Basic functionality]
Iteration 2: [Improvements]
Iteration 3: [Polish]

Help me with iteration 1 first.
```

### Feedback Loop
```
Claude, I implemented [feature] based on your suggestion.
Here's what works: [Success]
Here's what doesn't: [Issues]

Help me improve it.
```

---

## 💡 Pro Tips

### Be Specific
❌ "Make it better"
✅ "Add validation to prevent negative run values in addBall function"

### Reference Files
Use `@filename` to give Claude context:
```
Claude, in @cricket-scorer-complete.html, the dismissal modal...
```

### Break Down Large Tasks
Instead of "Add tournament mode", do:
1. "Help me design tournament data structure"
2. "Create tournament setup UI"
3. "Implement match scheduling"
4. "Build points table"

### Iterate
Don't expect perfection first try. Refine with Claude:
```
Claude, that works but could be better. How about...
```

### Ask for Explanations
```
Claude, you suggested [solution]. Why is this better than [alternative]?
```

---

**Remember:** Claude is your pair programmer. Have conversations, ask questions, iterate on solutions!

---

*Last Updated: November 2024*
