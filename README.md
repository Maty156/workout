# CALIX — Premium Calisthenics Tracker

A fully offline, multi-page web app for tracking a high-performance 12-week calisthenics program. 
Zero dependencies, premium aesthetics, and complete data privacy.

---

## Key Features

- **Premium Design**: Modern Dark Mode with glassmorphism, fluid animations, and high-quality SVG icons.
- **Guided Sessions**: Step-by-step workout flow including warm-ups, rest timers with audio beeps, and cool-downs.
- **Progress Tracking**: 12-week heatmap, streak tracking, and monthly progression stats.
- **Data Privacy**: 100% offline. All data stays in your browser's `localStorage`.
- **Backup & Restore**: Export your progress to a JSON file and import it anytime to switch devices without losing data.

---

## File Structure

```
calix/
├── index.html          ← Main entry point
├── css/
│   ├── base.css        ← Design system (Glassmorphism, Typography)
│   ├── nav.css         ← Premium navigation bar
│   ├── home.css        ← Program overview & Hero section
│   ├── calendar.css    ← Calendar & heatmap tracking
│   ├── workout.css     ← Guided session UI
│   └── timer.css       ← Rest timer & stopwatch
├── js/
│   ├── icons.js        ← Dependency-free SVG Icon System
│   ├── data.js         ← 12-week program definitions
│   ├── store.js        ← Export/Import & LocalStorage logic
│   ├── stats.js        ← Progression calculations
│   ├── nav.js          ← SPA Routing
│   └── main.js         ← App bootstrap
└── pages/
    ├── home.js         ← Dashboard logic
    ├── calendar.js     ← Tracking & Backup logic
    ├── workout.js      ← Session engine logic
    └── timer.js        ← Standalone tools logic
```

---

## Usage

1. **Open** `index.html` in any modern browser.
2. **Set Start Date**: Go to **CALENDAR** and pick your program start date.
3. **Train**: Use **TODAY** to follow the guided session. Complete the checkboxes to track sets.
4. **Backup**: Periodically use the **EXPORT** button in the Calendar sidebar to save your progress as a file.

---

## Program Phases

| Phase | Duration | Frequency | Objective |
|-------|----------|-----------|-----------|
| **Foundation** | Weeks 1-4 | 3×/week | Basic movement patterns & conditioning. |
| **Intensity** | Weeks 5-8 | 4×/week | Upper/Lower splits & skill introductions. |
| **Mastery** | Weeks 9-12 | 5×/week | Advanced movements & peak performance. |

---

## Development

Created with a focus on simplicity and high-quality UX. No build step required. Just vanilla HTML, CSS, and JS.
