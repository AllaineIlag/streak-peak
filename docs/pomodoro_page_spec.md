# StreakPeak — Pomodoro UI Specification

> Analyzed from screenshots provided in the `/home` folder on 2026-08-14.

---

## Screen Layout & Navigation

The Pomodoro feature uses an internal bottom navigation bar with 4 tabs:
- **Timer** (⏱️ stopwatch) — Active tab (blue pill shape)
- **Analytics** (📊 bar chart)
- **Settings** (⚙️ gear)
- **Info** (ℹ️ info circle)

### Header (Common)
- **Left**: `<` Back button
- **Title**: `POMODORO` (or `ANALYTICS`, `SETTINGS`) — uppercase, letter-spaced.

---

## 1. Timer Tab

### Top Section
- **Phase Indicator**: A pill button indicating the current phase, e.g., `● WORK`.
- **Session Goal**: Text input with placeholder `Add focus session goal...`
- **Social Proof / Global Stats**: A dark card with a stopwatch icon.
  - Text: `136 people focused today`
  - Subtext: `12.0kh logged all-time`

### Clock / Timer Display
- **Timer Ring**: A very large, thin dark circle taking up the center of the screen.
- **Time**: Large, highly legible numbers in the center (e.g., `01:00`).
- **Subtitle**: `FOCUS TIME` below the numbers.
- **Animation (When Running)**:
  - A bright white line draws along the ring path.
  - The leading edge of the line has a bright, glowing dot.
  - *(Note from Info sheet: Break phases use dashed lines instead of a solid line).*

### Controls
- **Left (Small)**: `Reset` (↺ circular arrow)
- **Center (Large)**:
  - **Start state**: Solid white circle with a black play icon (▶) and a soft white outer glow. Label: `Start`.
  - **Running/Pause state**: Outline circle with white pause icon (⏸), no fill, no glow. Label: `Pause`.
- **Right (Small)**: `Skip` (⏭ next track icon).

### Cycle Progress
- Text: `CYCLE PROGRESS`
- Visual indicator: A horizontal pill/dash. (e.g., one pink dash for cycle 1).
- Subtext: `0 / 1 cycles — long break in 1 more`.

---

## 2. Analytics Tab

Features a top toggle switch: **Simplified** vs **Detailed**.

### Simplified View
- **Card 1: DAILY GOAL**: `0 / 1 Sessions` (large), `1 sessions left to reach goal.` (small). Circular 0% progress ring on the right.
- **Card 2: Focus Time Today**: Hourglass icon, `0m` large text.
- **Card 3: Total Completed**: Checkmark icon, `0` large text.
- **Section: FOCUS BREAKDOWN**: A large empty state card `Complete focus cycles to see logs here`.

### Detailed View
- **Time Filters**: `Daily`, `Weekly` (active blue), `Monthly`, `Lifetime`.
- **Graph Area**: Large dark rounded rectangle. Empty state: `No history data yet`.
- **Section: FOCUS BREAKDOWN**: Same empty state card as Simplified view.

---

## 3. Settings Tab

Comprehensive configuration options categorized into sections, with a fixed "Session Summary" bottom sheet peeking at the very bottom.

### WORK
- **Focus duration**: Length of each work session.
  - Stepper: `−` `1m` `+` (Number is **Red**).
  - Presets (pills): `15m`, `25m - classic`, `30m`, `45m`, `50m - ultradian`, `60m`.

### BREAKS
- **Short break**: Rest between work cycles.
  - Stepper: `−` `1m` `+` (Number is **Teal/Green**).
  - Presets: `3m`, `5m - standard`, `10m`, `15m`.
- **Long break**: Rest after completing all cycles.
  - Stepper: `−` `1m` `+` (Number is **Blue**).
  - Presets: `10m`, `15m - standard`, `20m`, `30m`.

### CYCLES
- **Cycles before long break**: Work sessions before long rest.
  - Row of numbered circles 1 through 8. Active cycle (1) has a blue border.
  - Right-aligned button: `1x` (multiplier).
  - Subtext: `Full session ≈ 2m` (dynamically calculated).

### THEMES & CUSTOMIZATION
- **Customize Clock Style**: `Classic >` (navigates to another screen, not shown).

### ADVANCED SETTINGS
- **Do Not Disturb (DND) [PRO]**: Toggle switch. Subtext: `Silence notification disturbances`.
- **Auto Start Next Timer**: Toggle switch.
- **Use Backdrop Textures**: Toggle switch.
- **Daily Focus Goal**: Stepper `−` `1 cycles` `+`.
- **Vibration Pattern**: Dropdown (`Default`).
- **Alarm Ringtone**: Dropdown (`Default`).
- **Alarm Duration**: Slider (e.g., `5s`).

### Session Summary (Peeking Bottom Sheet)
- Floats above the navigation bar.
- Shows a breakdown of current settings:
  - Focus duration (`1m` red)
  - Short break (`1m` teal)
  - Long break (`1m` blue)
  - Cycles before long break (`1`)
  - **Full session** (`2m` dark pill)

---

## 4. Info Bottom Sheet (Pomodoro Guide)

Opens from the ℹ️ tab.
- **Header**: Pro badge (⭐) + `Pomodoro Guide`.
- **1. Focus Sessions**: Set a goal, block distractions, and focus during the Work phase.
- **2. Custom Ring Animation**: The timer rings glow during focus, and show break dash lines when relaxing.
- **3. Advanced Features**: Pro users can lock notification interruptions with DND mode, custom vibration patterns, and loop alarms.
- **Action**: `Got it` (blue button).

---

## Design Tokens

| Token | Value | Usage |
|---|---|---|
| Primary Accents | `~#4A5AEF` blue/purple | Active tabs, Toggles, Focus goals |
| Work Time Color | `~#FF4444` red | Focus duration settings text |
| Short Break Color | `~#4ADE80` teal/green | Short break settings text |
| Long Break Color | `~#4A5AEF` blue | Long break settings text |
| Start Button glow | White blur/drop-shadow | Active start button glow |

---

## Open Questions

> [!NOTE]
> 1. **Global Stats**: The "136 people focused today" metric — should we mock this data, or implement a real-time global counter in Supabase?
> 2. **Clock Styles**: Are there other clock styles besides "Classic" that we need to build for the MVP?
> 3. **Background Audio/DND**: Do we need to handle actual system Do Not Disturb (which requires native permissions in React Native) or just in-app muting for the web version?
