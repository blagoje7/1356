# 1356 Progress Tracker

A static Astro site deployed on Netlify that tracks your daily goals with persistent state saved via the GitHub API.

## Features

- 🎯 Track 4 daily goals: Training, Coursera Course, Duolingo, and Meditation
- � Daily entries with dates - tracks your progress each day
- 📆 **Calendar view** - visualize your progress over time with color-coded days
- 💬 Daily comment/notes field for reflections- 🔒 **Password protection** - prevents unauthorized changes- 🔄 Auto-sync on every change (2 second debounce)
- 💾 State persistence without a database (using GitHub API)
- 🚀 Static site with automatic rebuilds via Netlify
- 📱 Beautiful, responsive dashboard UI

## Calendar View

The calendar provides a visual overview of your progress:
- **Color gradient**: Days are colored from red (#f44336 for 0%) to green (#00ff00 for 100%)
- **Percentage display**: Each day shows your completion percentage
- **Click for details**: Click any day to see:
  - All 4 goals with ✓ (completed) or ✗ (incomplete)
  - Daily notes/comments if available
- **Navigation**: Browse months with Previous/Next buttons or jump to Today
- **Today indicator**: Current day highlighted with a blue border

## How It Works

1. **Two views available**: Toggle between "Today" (for tracking current day) and "Calendar" (for viewing history)
2. In Today view: Check goals, update course name, or write notes - changes auto-sync after 2 seconds
3. In Calendar view: See all your past progress with color-coded completion percentages
4. Each change updates `src/data/progress.json` in your GitHub repository via the GitHub API
5. Netlify detects the commit and automatically rebuilds the site
6. Your daily progress is saved permanently - track your consistency over weeks and months

## Project Structure

```
1356/
├── src/
│   ├── data/
│   │   └── progress.json          # Daily entries + current course (updated by API)
│   └── pages/
│       ├── index.astro            # Main dashboard UI with auto-sync
│       └── api/
│           └── update.js          # GitHub API integration
├── astro.config.mjs               # Astro configuration
├── netlify.toml                   # Netlify configuration
├── package.json                   # Dependencies
└── README.md                      # This file
```