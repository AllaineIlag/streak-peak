# StreakPeak — Mood (Morning Check-In) UI Specification

> Analyzed from screenshots provided in the `/home` folder on 2026-08-14.
> This feature is accessed via the "Mood" card on the Home screen ("Track feelings").

---

## Overview

Unlike other Arsenal features (like Pomodoro or Calendar), the **Mood** feature does not navigate to a new full-screen view. Instead, it triggers a **Bottom Sheet** directly on the Home screen to capture a quick daily check-in.

---

## 1. Morning Check-In (Bottom Sheet)

Opens when tapping the `Mood` card in Your Arsenal.

### Header
- **Drag Handle**: Standard horizontal line indicator.
- **Title**: `Morning Check-In` (Bold, white, centered).
- **Subtitle**: `How are you feeling?` (Gray, centered).

### Mood Selection (Feelings)
- A horizontal row of 5 emoji-based options.
- Options (Icon + Label below):
  - 😫 `Terrible`
  - 😔 `Bad`
  - 😐 `Okay`
  - 🙂 `Good`
  - 🤩 `Awesome`
- **Active State**: The selected mood (e.g., `Good`) is highlighted with a distinct blue rounded-rectangle border/glow (`~#4A5AEF`).

### Daily Intention
- **Header**: `Daily Intention` (Left-aligned, bold, white).
- **Options**: A flex-wrap cluster of pill buttons.
  - Examples: `Focus`, `Learn`, `Exercise`, `Relax`, `Social`, `Create`.
- **Active State**: The selected intention (e.g., `Focus`) changes to a light blue background (`~#E0E7FF` equivalent) with blue text, and a `✓` checkmark appears before the text.
- **Inactive State**: Dark gray pill with lighter gray text.

### Action
- **Primary Button**: `Done` (Full-width blue button, `~#4A5AEF`).

---

## 2. Duplicate Entry Prevention (Toast Notification)

If the user attempts to tap the `Mood` card again after they have already completed their check-in for the day, the bottom sheet does **not** open.

Instead, a top-down toast notification appears.

### Toast UI
- **Position**: Drops down from the very top of the screen, floating over the header/content.
- **Style**: Light gray / whitish background (appears to have a subtle glassmorphism or blur effect) with dark text. This contrasts heavily with the dark theme of the app.
- **Icon**: `(i)` Info circle (black).
- **Message**: `You have already set your morning intention today! Have a great day.`
- **Animation**: Presumably slides down from top, stays for ~3 seconds, then slides back up.

---

## Design Tokens

| Token | Value | Usage |
|---|---|---|
| Primary Accent | `~#4A5AEF` blue | Active mood border, Active Intention text, Done button |
| Active Intention BG | `~#1E293B` or similar | The background of the active intention pill is lighter/blue-tinted |
| Toast Background | Light / White | Contrasting background for the info toast |

---

## Open Questions

> [!NOTE]
> 1. **Data Visualization**: We are recording this mood data, but where is it viewed? Does it appear on a weekly stats page somewhere else, or is it purely for logging in the MVP?
> 2. **Toast Component**: For the Next.js web build, should we use a library like `react-hot-toast` or `sonner` for these top-down notifications to match this UI?
> 3. **Time Restriction**: Is this strictly a *Morning* check-in (e.g., only available before 12:00 PM), or is the title just a semantic naming convention for a "Daily" check-in?
