# 🚀 VS Code Development Setup

Complete guide for developing Cricket Scorer Pro in VS Code with Claude plugin.

## 📋 Prerequisites

### Required Software
- **VS Code** (latest version)
- **Node.js** 14+ and npm 6+
- **Git** (for version control)
- **Modern Browser** (Chrome/Edge recommended)

### Optional
- **Python 3** (for alternative local server)
- **PHP** (for alternative local server)

---

## 🔧 Initial Setup

### Step 1: Open Project in VS Code

```bash
# Navigate to project
cd cricket-scorer-dev

# Open in VS Code
code .
```

### Step 2: Install Recommended Extensions

When you open the project, VS Code will prompt:
**"Do you want to install the recommended extensions?"**
➡️ Click **"Install All"**

**Key Extensions:**
- ✅ **Claude Dev** - AI pair programming
- ✅ **Prettier** - Code formatting
- ✅ **ESLint** - Code linting
- ✅ **Tailwind CSS IntelliSense** - Tailwind autocomplete
- ✅ **Live Server** - Local development server
- ✅ **ES7 React Snippets** - React code snippets

### Step 3: Install Dependencies

```bash
# Install development dependencies
npm install

# This installs:
# - live-server (dev server)
# - prettier (formatting)
# - eslint (linting)
```

### Step 4: Start Development Server

```bash
# Option 1: Using npm (recommended)
npm start

# Option 2: Using Live Server extension
# Right-click public/index.html → "Open with Live Server"

# Option 3: Using Python
npm run serve

# Option 4: Using PHP
npm run serve:php
```

Your app should now be running at **http://localhost:3000** 🎉

---

## 🤖 Using Claude Dev Plugin

### Installation

1. Install **Claude Dev** extension from VS Code marketplace
2. Sign in with your Anthropic API key
3. Claude will appear in the sidebar

### Working with Claude

#### Open Claude Chat
- Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
- Type "Claude"
- Select "Claude: New Chat"

#### Common Development Tasks with Claude

**1. Understanding Code**
```
Claude, explain how the dismissal modal works in this app
```

**2. Adding Features**
```
Claude, help me add a feature to save match data to localStorage
```

**3. Fixing Bugs**
```
Claude, the undo button isn't working correctly for extras. Can you help debug?
```

**4. Code Review**
```
Claude, review the addBall function and suggest improvements
```

**5. Refactoring**
```
Claude, help me split the CricketScorer component into smaller components
```

### Claude Best Practices

**✅ DO:**
- Reference specific files: `@cricket-scorer-complete.html`
- Ask for explanations before making changes
- Request step-by-step guidance
- Ask Claude to explain its suggestions

**❌ DON'T:**
- Ask Claude to rewrite entire app at once
- Skip testing after changes
- Ignore Claude's explanations

---

## 📁 Project Structure

```
cricket-scorer-dev/
├── .vscode/                 # VS Code configuration
│   ├── settings.json       # Editor settings
│   ├── extensions.json     # Recommended extensions
│   └── launch.json         # Debug configuration
│
├── public/                  # Public files (served by web server)
│   └── index.html          # Main HTML file
│
├── src/                     # Source files
│   ├── components/         # React components (to be created)
│   ├── styles/            
│   │   └── main.css        # Custom CSS
│   └── cricket-scorer-complete.html  # Reference (full app)
│
├── docs/                    # Documentation
│   └── (to be added)
│
├── package.json            # Node.js project config
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

---

## 🎯 Development Workflow

### Daily Workflow

1. **Open VS Code**
   ```bash
   code cricket-scorer-dev
   ```

2. **Start Dev Server**
   ```bash
   npm start
   ```

3. **Make Changes**
   - Edit files in `src/`
   - Auto-reload in browser

4. **Use Claude for Help**
   - Open Claude chat
   - Reference specific files
   - Get code suggestions

5. **Test Changes**
   - Test in browser
   - Try different scenarios
   - Check mobile responsiveness

6. **Save & Commit**
   ```bash
   git add .
   git commit -m "Added feature X"
   ```

### Making a Feature

**Example: Add localStorage support**

1. **Plan with Claude**
   ```
   Claude, I want to save match data to localStorage so it persists on refresh. 
   What's the best approach? Reference @cricket-scorer-complete.html
   ```

2. **Get Implementation**
   Claude will suggest:
   - Where to add state persistence
   - How to load saved data
   - Error handling

3. **Implement Changes**
   - Follow Claude's guidance
   - Make changes incrementally
   - Test after each change

4. **Test Thoroughly**
   - Start a match
   - Refresh browser
   - Verify data persists
   - Test edge cases

5. **Refine with Claude**
   ```
   Claude, the saved data isn't loading correctly. 
   Here's the error: [paste error]
   ```

---

## 🧩 Breaking Down the Monolithic File

Currently, everything is in one file (`cricket-scorer-complete.html`). 
Let's modularize it for better development.

### Step 1: Extract Constants

Create `src/constants/matchFormats.js`:
```javascript
export const MATCH_FORMATS = [
  { name: 'T10', overs: 10, desc: 'Super fast format' },
  { name: 'T20', overs: 20, desc: 'Most popular format' },
  { name: 'ODI', overs: 50, desc: 'One Day International' },
  { name: 'Custom', overs: 20, desc: 'Set your own' }
];

export const DISMISSAL_TYPES = [
  { id: 'bowled', name: 'Bowled', needsFielder: false, icon: '🎯' },
  // ... more dismissals
];
```

### Step 2: Extract Components

Ask Claude:
```
Claude, help me extract the DismissalModal into a separate component.
Show me how to create src/components/DismissalModal.jsx
```

### Step 3: Extract Utilities

Create `src/utils/calculations.js`:
```javascript
export const calculateRunRate = (runs, overs, balls) => {
  const totalOvers = overs + (balls / 6);
  return totalOvers > 0 ? (runs / totalOvers).toFixed(2) : '0.00';
};

export const calculateStrikeRate = (runs, balls) => {
  return balls > 0 ? ((runs / balls) * 100).toFixed(2) : '0';
};
```

### Step 4: Use Modules

Update `public/index.html`:
```html
<script type="module" src="../src/app.js"></script>
```

---

## 🛠️ Common Development Tasks

### Task 1: Add a New Feature

**Example: Add match timer**

1. **Ask Claude**
   ```
   Claude, I want to add a timer showing match duration. 
   Where should I add this in the code?
   ```

2. **Implement**
   ```javascript
   // Claude will suggest adding state
   const [matchStartTime, setMatchStartTime] = useState(null);
   const [matchDuration, setMatchDuration] = useState(0);
   ```

3. **Test**
   - Start match
   - Watch timer
   - Pause/resume
   - Verify accuracy

### Task 2: Fix a Bug

**Example: Undo not working for wides**

1. **Ask Claude**
   ```
   Claude, when I undo a wide ball, the score doesn't revert correctly.
   Look at the undoLastBall function and help me fix it.
   ```

2. **Debug**
   - Add console.logs
   - Check state updates
   - Test edge cases

3. **Implement Fix**
   - Follow Claude's suggestions
   - Add comments
   - Test thoroughly

### Task 3: Improve UI

**Example: Make buttons larger on mobile**

1. **Ask Claude**
   ```
   Claude, the scoring buttons are too small on mobile.
   Help me make them larger and more touch-friendly.
   ```

2. **Update CSS**
   ```css
   @media (max-width: 640px) {
     .scoring-button {
       min-height: 70px;
       font-size: 1.5rem;
     }
   }
   ```

3. **Test on Mobile**
   - Use Chrome DevTools
   - Test on actual device
   - Verify touch targets

### Task 4: Add Tests

**Example: Test run rate calculation**

1. **Ask Claude**
   ```
   Claude, help me write unit tests for the run rate calculation.
   Which testing framework should I use?
   ```

2. **Setup Testing**
   ```bash
   npm install --save-dev jest
   ```

3. **Write Tests**
   ```javascript
   test('calculates run rate correctly', () => {
     expect(calculateRunRate(120, 20, 0)).toBe('6.00');
   });
   ```

---

## 🎨 Customization Examples

### Change Color Scheme

**Ask Claude:**
```
Claude, I want to change the primary color from green to blue throughout the app.
Show me all the places I need to update.
```

Claude will help you:
1. Find all `green-` classes
2. Replace with `blue-` classes
3. Update gradient colors
4. Test visual consistency

### Add New Match Format

**Ask Claude:**
```
Claude, I want to add "The Hundred" format (100 balls per innings).
Help me add this to the match formats.
```

### Modify Scorecard Layout

**Ask Claude:**
```
Claude, I want to reorganize the scorecard to show bowling first, then batting.
Help me reorder the components.
```

---

## 🐛 Debugging Tips

### Using Browser DevTools

1. **Open DevTools**
   - Press `F12` or `Ctrl+Shift+I`
   - Go to Console tab

2. **Check for Errors**
   - Red errors indicate problems
   - Click to see line number

3. **Debug State**
   ```javascript
   // Add temporary logging
   console.log('Current runs:', runs);
   console.log('Ball history:', ballHistory);
   ```

4. **React DevTools**
   - Install React DevTools extension
   - Inspect component state
   - Track prop changes

### Common Issues

**Issue: Changes not reflecting**
- Solution: Hard refresh (`Ctrl+Shift+R`)
- Clear browser cache
- Restart dev server

**Issue: "Cannot read property of undefined"**
- Check state initialization
- Verify player indices
- Add null checks

**Issue: Buttons not responding**
- Check event handlers
- Verify disabled state
- Test in different browser

---

## 📚 Learning Resources

### React Documentation
- [React Docs](https://react.dev/)
- [React Hooks](https://react.dev/reference/react)

### Tailwind CSS
- [Tailwind Docs](https://tailwindcss.com/docs)
- [Tailwind Cheatsheet](https://nerdcave.com/tailwind-cheat-sheet)

### JavaScript
- [MDN Web Docs](https://developer.mozilla.org/)
- [JavaScript.info](https://javascript.info/)

---

## 🚀 Next Steps

### Immediate Tasks

1. **Setup Environment**
   - [ ] Install VS Code extensions
   - [ ] Run `npm install`
   - [ ] Start dev server
   - [ ] Test app loads

2. **Learn Codebase**
   - [ ] Read through main component
   - [ ] Understand state management
   - [ ] Test all features
   - [ ] Ask Claude questions

3. **Make First Change**
   - [ ] Pick a small feature
   - [ ] Discuss with Claude
   - [ ] Implement
   - [ ] Test
   - [ ] Commit

### Future Enhancements

**Phase 1: Core Improvements**
- [ ] Add data persistence (localStorage)
- [ ] Improve mobile experience
- [ ] Add keyboard shortcuts
- [ ] Optimize performance

**Phase 2: New Features**
- [ ] Match history
- [ ] Player database
- [ ] Export to PDF/CSV
- [ ] Share scorecard

**Phase 3: Advanced**
- [ ] Tournament mode
- [ ] Live streaming
- [ ] Advanced analytics
- [ ] Backend integration

---

## 💡 Pro Tips

### Working with Claude

1. **Be Specific**
   - ❌ "Make the app better"
   - ✅ "Add validation to prevent negative runs"

2. **Reference Files**
   - Use `@filename` to reference specific files
   - Claude has full context of your code

3. **Ask for Explanations**
   - "Why does this work?"
   - "What are the trade-offs?"

4. **Iterate**
   - Start with simple implementation
   - Refine based on feedback
   - Test each iteration

### Code Quality

1. **Format Regularly**
   ```bash
   npm run format
   ```

2. **Add Comments**
   ```javascript
   // Calculate strike rate for batsman
   const strikeRate = (runs / balls) * 100;
   ```

3. **Use Meaningful Names**
   ```javascript
   // ❌ Bad
   const x = 100;
   
   // ✅ Good
   const targetRuns = 100;
   ```

4. **Keep Functions Small**
   - One function, one purpose
   - Extract complex logic

### Testing

1. **Test on Multiple Browsers**
   - Chrome, Firefox, Safari, Edge

2. **Test on Mobile**
   - Use DevTools device emulation
   - Test on real devices

3. **Test Edge Cases**
   - No wickets
   - All wickets
   - Extra balls
   - Match ties

---

## 🆘 Getting Help

### From Claude

```
Claude, I'm stuck on [problem]. I've tried [solution] but [result].
Can you help me understand what's wrong?
```

### From Community

- GitHub Issues (if you create a repo)
- Stack Overflow (React/JavaScript questions)
- Reddit (r/reactjs, r/cricket)

### Self-Help

1. **Read error messages carefully**
2. **Google the error**
3. **Check documentation**
4. **Review similar code**
5. **Take breaks!**

---

## 📝 Code Style Guide

### JavaScript
```javascript
// Use const for non-changing values
const MAX_OVERS = 50;

// Use let for changing values
let currentRuns = 0;

// Use meaningful names
const calculateRunRate = (runs, overs) => {
  return (runs / overs).toFixed(2);
};

// Add JSDoc comments for functions
/**
 * Calculates the current run rate
 * @param {number} runs - Total runs scored
 * @param {number} overs - Overs bowled
 * @returns {string} Run rate with 2 decimal places
 */
```

### React
```javascript
// Component names in PascalCase
function DismissalModal() {}

// Props destructuring
function Button({ label, onClick, disabled }) {
  return <button onClick={onClick} disabled={disabled}>{label}</button>;
}

// State naming
const [isModalOpen, setIsModalOpen] = useState(false);
```

### CSS
```css
/* Use BEM-like naming */
.scorecard {}
.scorecard__header {}
.scorecard__row--highlighted {}

/* Group related properties */
.button {
  /* Positioning */
  position: relative;
  
  /* Box model */
  display: flex;
  padding: 1rem;
  
  /* Visual */
  background: blue;
  color: white;
  
  /* Typography */
  font-size: 1rem;
  
  /* Misc */
  cursor: pointer;
}
```

---

## 🎓 Learning Path

### Week 1: Setup & Familiarization
- [ ] Setup development environment
- [ ] Explore codebase with Claude
- [ ] Make small CSS changes
- [ ] Test all features manually

### Week 2: Small Features
- [ ] Add localStorage persistence
- [ ] Improve mobile UI
- [ ] Add keyboard shortcuts
- [ ] Write documentation

### Week 3: Medium Features
- [ ] Break into modules
- [ ] Add player stats history
- [ ] Implement match export
- [ ] Add unit tests

### Week 4: Advanced Features
- [ ] Build tournament mode
- [ ] Add backend API
- [ ] Implement sharing
- [ ] Deploy to production

---

## 📊 Project Goals

### Short Term (1-2 weeks)
- ✅ Setup development environment
- ⏳ Understand codebase fully
- ⏳ Make first feature contribution
- ⏳ Add localStorage support

### Medium Term (1-2 months)
- ⏳ Modularize codebase
- ⏳ Add comprehensive tests
- ⏳ Improve mobile experience
- ⏳ Add player database

### Long Term (3+ months)
- ⏳ Tournament management
- ⏳ Backend integration
- ⏳ Advanced analytics
- ⏳ Mobile app version

---

## ✅ Checklist

### Before Starting
- [ ] VS Code installed
- [ ] Node.js installed
- [ ] Git configured
- [ ] Extensions installed
- [ ] Project dependencies installed
- [ ] Dev server running
- [ ] App loads in browser

### For Each Feature
- [ ] Discuss with Claude
- [ ] Write pseudocode
- [ ] Implement code
- [ ] Test manually
- [ ] Write tests (optional)
- [ ] Update documentation
- [ ] Commit changes
- [ ] Deploy (if needed)

---

**Happy Coding! 🎉**

Use Claude as your pair programming partner and don't hesitate to ask questions!

---

*Last Updated: November 2024*
*Version: 1.0.0*
