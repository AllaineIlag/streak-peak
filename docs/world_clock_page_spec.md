# StreakPeak — World Clock UI Specification

> Analyzed from screenshots provided in the `/home` folder on 2026-08-14.
> This feature is accessed via the "Clock" card on the Home screen ("Global timezones").

---

## 1. Main View

### Header
- **Left**: `<` Back button.
- **Center**: `WORLD CLOCK` (Uppercase, letter-spaced text).
- **Right**: `+ Add` button (Dark pill shape).

### Local Time Card
- A large, prominent dark card at the top.
- **Label**: `LOCAL` (Small, gray, uppercase).
- **Time**: Very large format `10:44` with smaller, slightly dimmer seconds `20` appended.
- **Date**: `Fri, Aug 14` (Bottom left).
- **Status Indicator**: A pill in the bottom right indicating time of day.
  - Example: `Day` (with a yellow sun icon ☀️).

### Saved Cities Section
- **Header**: `SAVED CITIES` (Small, gray, uppercase).
- **List Items**: Each saved city is a dark, rounded card.
  - **Left Side**:
    - Icon: Moon icon (🌙 blue) or Sun icon (☀️ yellow) depending on the city's current time.
    - Name: `UTC` (Bold white).
    - Subtext 1: Region/Timezone offset, e.g., `Universal · UTC+0`.
    - Subtext 2: Date, e.g., `Fri, Aug 14`.
  - **Right Side**:
    - Time: Large format `02:44` with smaller seconds `20`.
  - **Controls (Far Right)**:
    - Top: `⊖` (Minus icon) to remove the city.
    - Bottom: `=` (Two horizontal lines) drag handle to reorder the list.

---

## 2. Add City Bottom Sheet

Opens when the `+ Add` button in the header is tapped.

### Header & Search
- **Drag Handle**: Small horizontal line at the top.
- **Title**: `Add City` (Bold, white).
- **Close Action**: `×` button in a dark circular background on the top right.
- **Search Bar**: 
  - Magnifying glass icon.
  - Placeholder: `Search city or timezone...`
  - Dark background, rounded rectangle.

### City List
- A vertically scrolling list of available cities/timezones.
- Each item is a dark card containing:
  - **Primary Text**: City Name (e.g., `New York`).
  - **Secondary Text**: Country/Region (e.g., `United States`).
  - **Right Action**:
    - `+` (Plus icon) if the city can be added.
    - `✓` (Blue checkmark) if the city is already in the saved list (e.g., `UTC`).

---

## Open Questions

> [!NOTE]
> 1. **Timezone Data**: Do we want to use a local library (like `date-fns-tz` or standard `Intl.DateTimeFormat`) for calculating world times, or an external API for the city search?
> 2. **Day/Night Logic**: The Local card shows a Sun, and the UTC card shows a Moon. We'll need a simple logic (e.g., 6 AM to 6 PM is Day) to determine which icon to show.
> 3. **Live Seconds**: The seconds (`20`) imply the clock is ticking live on the screen. We'll need a `setInterval` or `requestAnimationFrame` hook to keep the UI clocks updating in real-time.
