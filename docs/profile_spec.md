# Cognize / StreakPeak — Profile UI Specification

> Analyzed from 10 screenshots provided in the `/home` folder on 2026-08-14.
> Accessed via the "Profile" tab in the bottom navigation bar.

---

## 1. Top Section & Achievements

- **Header**: `Profile` (Centered). No top bar background.
- **User Card**: 
  - Large avatar with a colorful gradient ring.
  - Name (e.g., `llag,`) in bold white text.
  - Email (e.g., `sungjinwoo1515@gmail.com`) in muted gray text.
  
- **Achievements (`🏅 Achievements 1/6`)**:
  A horizontally scrollable row of cards tracking user milestones.
  - `First Steps`: Completed onboarding (Progress: 1/1, green check).
  - `On Fire`: Maintain a 7-day activity streak (Progress: 2/7).
  - `Focus Master`: Complete 10 Pomodoro focus sessions (Progress: 0/10).
  - `Task Terminator`: Complete 50 tasks in your checklist (Progress: 1/50).
  - `Habit Hero`: Complete 30 habit check-ins (Progress: 0/30).
  - `Community Champion`: Unlock Pro to join global community challenges (Progress: 0/1).
  - *Design*: Each card has an icon, title, description, and a progress bar with a numerical fraction.

---

## 2. Settings List

A vertical scrollable list of settings grouped into sections.

### ACCOUNT
- `Edit Profile`: Name & photo (Navigates to Edit Profile screen).
- `Create Vault PIN`: Secure your vault with a PIN (Navigates to Numpad screen).
- `Subscription`: Manage your plan.

### PREFERENCES
- `Analytics`: Help improve Cognize anonymously (Toggle switch).
- `Daily Summary`: 10:00 PM daily summary (Toggle switch).
- `Homepage Texture ✨`: Carbon Fiber, Nebula, Starry... (Navigates to Themes screen).
- `Home Widgets`: Habits, Streak, Tasks... (Navigates to OS Widgets info screen).

### COMMUNITY
- `Invite & Support`: A nested card with two buttons: `⭐ Rate Us` and `💬 Feedback`.
- `Invite Friends & Earn`: 0 friends joined.
- `What's New`: Latest updates & improvements.

### DANGER ZONE
- `Log Out`: Red icon and text.
- `Delete Account`: Red icon and text. "Permanently remove your data".

---

## 3. Sub-Screens

### Edit Profile
- Simple form with a large avatar (camera overlay icon to change picture).
- Single text input for `Name`.
- Full-width white sticky button at the bottom: `Update`.

### Create PIN (Vault)
- Lock icon and `Enter your PIN`.
- Four empty square boxes for a 4-digit PIN.
- A custom 9-key numpad (1-9, backspace, 0, checkmark) positioned in the lower half of the screen.

### Homepage Texture (Themes)
- A screen to change the app's background wallpaper.
- **Header**: `< Homepage Texture` with an `Apply` button in the top right.
- **Preview Area**: A large rectangle at the top showing a preview of the selected texture.
- **Grid Selection**:
  - `Solid Color` (Default black).
  - `Cosmic Twilight` (A starry sky image).
  - `Cognize One` (Premium locked with a `🔒 ONE` badge).
  - `Nebula` and others (Require tapping `Download` first).

### Home Widgets (OS-Level Widgets)
- A gallery of widgets available for the iOS/Android operating system home screen (not the in-app dashboard).
- **Instructions Card**: Explains how to long-press the OS home screen to add a widget.
- **5 Widgets Available**:
  - `Tasks`: Pending tasks, progress bar (2x2).
  - `Streak`: 7-day dot history, countdown (3x3).
  - `Habits`: Top 3 habits with emoji (2x2).
  - `Focus Timer`: Live Pomodoro status (2x2).
  - `Event Tracker`: Days left to any event (2x2).
  - *Implementation Note*: Since we are building a web app first, these OS-level widgets will not be applicable until we migrate to React Native (Expo) and build native widget extensions.

---

## Open Questions

> [!NOTE]
> 1. **Themes Implementation**: For the web version, `Homepage Texture` implies setting a global CSS background image on the `<body>`. We'll need high-res assets for "Cosmic Twilight", "Nebula", etc.
> 2. **OS Widgets**: As this is initially a Next.js web app, should we hide the "Home Widgets" menu item for now, or display a "Coming soon to iOS/Android" message when tapped?
