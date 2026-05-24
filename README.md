# CALIX — Calisthenics Tracker

A fully offline, multi-page web app for tracking a 3-month calisthenics program.
No server, no dependencies, no install — just open `index.html` in your browser.

---

## File Structure

```
calix/
├── index.html          ← Main entry point (open this)
├── css/
│   ├── base.css        ← Variables, reset, shared utilities
│   ├── nav.css         ← Top navigation bar
│   ├── home.css        ← Program overview page
│   ├── calendar.css    ← Calendar & heatmap page
│   ├── workout.css     ← Today's session page
│   └── timer.css       ← Rest timer & stopwatch page
├── js/
│   ├── data.js         ← All workout program data
│   ├── store.js        ← localStorage persistence layer
│   ├── stats.js        ← Streak & progress calculations
│   ├── nav.js          ← Page routing
│   └── main.js         ← App bootstrap
└── pages/
    ├── home.js         ← Program overview page logic
    ├── calendar.js     ← Calendar tracking page logic
    ├── workout.js      ← Today's session page logic
    └── timer.js        ← Rest timer & stopwatch logic
```

---

## Pages

| Page | Description |
|------|-------------|
| **PROGRAM** | Full 3-month schedule. Browse months 1–3, select day types (Upper / Lower / Skill), see all exercises with sets & reps. |
| **CALENDAR** | Monthly calendar with workout day markers. Click any day to toggle done/missed. 12-week heatmap. Set your program start date. |
| **TODAY** | Browse any program day using W1D1 buttons or arrows. Checklist per exercise, per-set dot tracker, mark session done. |
| **TIMER** | Rest timer with presets (30s–3m) and custom input. Beeps on finish. Stopwatch with lap tracking. |

---

## Usage

1. Open `index.html` in any modern browser (Firefox, Chrome, Brave — all work)
2. Go to **CALENDAR → PROGRAM START DATE** and set the date you began
3. Use **TODAY** to check off exercises and mark sessions complete
4. All data is saved automatically in `localStorage`

---

## Program Summary

| Phase | Weeks | Frequency | Focus |
|-------|-------|-----------|-------|
| Month 1 | 1–4  | 3×/week   | Full body foundation |
| Month 2 | 5–8  | 4×/week   | Upper/lower split + skill intro |
| Month 3 | 9–12 | 4–5×/week | Advanced movements + skill mastery |

**Skills trained:** Handstand, L-Sit, Muscle-Up progressions

---

## Data & Privacy

All data is stored locally in your browser's `localStorage`.
Nothing is sent anywhere. Works fully offline after first load (fonts cache).

To reset: go to **CALENDAR** and click **RESET ALL DATA**.
