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

## Setup Instructions

### 1. Create a GitHub Personal Access Token

1. Go to [GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Give it a name like "1356-progress-tracker"
4. Select the `repo` scope (full control of private repositories)
5. Click "Generate token"
6. **Copy the token immediately** (you won't be able to see it again)

### 2. Install Dependencies

```bash
npm install
```

### 3. Deploy to Netlify

1. Push this project to a GitHub repository
2. Go to [Netlify](https://app.netlify.com/) and click "Add new site"
3. Choose "Import an existing project"
4. Connect to your GitHub account and select this repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

### 4. Configure Environment Variables in Netlify

Go to your Netlify site dashboard → **Site configuration** → **Environment variables** and add the following:

| Variable Name | Value | Description |
|---------------|-------|-------------|
| `GITHUB_TOKEN` | `ghp_xxxxxxxxxxxxx` | Your GitHub Personal Access Token (created in step 1) |
| `REPO_OWNER` | `your-github-username` | Your GitHub username or organization name |
| `REPO_NAME` | `your-repo-name` | The name of your GitHub repository |
| `BRANCH` | `main` | The branch to update (optional, defaults to `main`) |

**Note**: Password protection is built-in with SHA-256 hashing for security.

### 5. Enable Automatic Deployments

In Netlify, make sure automatic deployments are enabled:
- Go to **Site configuration** → **Build & deploy** → **Continuous deployment**
- Ensure "Auto publishing" is enabled for your main branch

### 6. Test the Site

1. Visit your deployed Netlify URL
2. Check off some goals, update the Coursera course name, or write in the daily notes
3. Wait 2 seconds - you'll see "Syncing..." then "✓ Synced successfully!"
4. Check your GitHub repository - you should see a new commit updating `src/data/progress.json`
5. Wait 1-2 minutes for Netlify to rebuild automatically
6. Refresh the page - your progress should be saved!

Each day you visit, you'll see a new date and can track that day's progress separately.

## Local Development

To run the site locally:

```bash
npm run dev
```

**Note:** The API route requires environment variables to work. For local testing, you can create a `.env` file (not committed to git):

```env
GITHUB_TOKEN=your_token_here
REPO_OWNER=your_username
REPO_NAME=1356
BRANCH=main
```

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

## Data Structure

The [src/data/progress.json](src/data/progress.json) file contains:
- `currentCourse`: The current Coursera course name (persists across days)
- `dailyEntries`: Array of daily progress entries, each containing:
  - `date`: YYYY-MM-DD format
  - `training`, `coursera`, `duolingo`, `meditation`: Boolean completion status
  - `comment`: Daily notes/reflection text

## Troubleshooting

### "Missing environment variables" error
- Double-check that all 3 required environment variables are set in Netlify
- Make sure there are no extra spaces in the values
- Redeploy the site after adding variables

### Changes not persisting
- Check that the GitHub token has `repo` scope
- Verify the `REPO_OWNER` and `REPO_NAME` are correct (use `blagoje7` and `1356`)
- Check Netlify deploy logs for errors
- Ensure automatic deployments are enabled in Netlify
- Wait at least 2 seconds after making changes for auto-sync to trigger

### Auto-sync not working
- Check the browser console for JavaScript errors
- Ensure you're making actual changes (checkboxes, text input)
- The sync triggers 2 seconds after the last change (debounced)
- Look for the "Syncing..." status message

### Site not rebuilding after sync
- Check your Netlify deploy settings
- Verify the GitHub webhook is configured (should happen automatically)
- Look for failed builds in the Netlify dashboard

## Credits

Built with [Astro](https://astro.build/) and deployed on [Netlify](https://www.netlify.com/).
