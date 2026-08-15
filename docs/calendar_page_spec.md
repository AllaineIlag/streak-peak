# StreakPeak — Calendar (Events) UI Specification

> Analyzed from screenshots provided in the `/home` folder on 2026-08-14.
> Note: The "Calendar" card on the Home screen redirects to the **Events** tab in the main bottom navigation.

---

## Screen Layout & Navigation

This screen uses the primary global bottom navigation bar:
- **Home**
- **Notes**
- **Events** (Active: Calendar icon)
- **Checklist**
- **Profile**

---

## 1. Main Calendar View

### Top Calendar Grid
- **Header**: Large month text (`August`) with smaller year text (`2026`) directly underneath.
- **Navigation**: Right-aligned `<` (Previous Month) and `>` (Next Month) circular buttons.
- **Day Headers**: `S M T W T F S` (muted gray).
- **Date Grid**: Standard calendar layout.
  - The current day (e.g., 14) is highlighted with a **blue/purple circular background**.
  - Dates outside the current month are muted/dimmed.
- A horizontal divider line separates the calendar grid from the events list below.

### Events List
- **Today Section**:
  - Header: `Today` (bold, white).
  - Empty State: Calendar icon, `No events scheduled` (white), `Tap the + button to add your first event` (muted).
- **Upcoming Section**:
  - Header: `Upcoming (This Month)` (bold, white).
  - Empty State: `No upcoming events this month` (muted).

### Floating Action Button (FAB)
- Large white circular button with a black `+` icon, positioned in the bottom right corner (above the bottom nav).

---

## 2. New Event Bottom Sheet

Opens when the `+` FAB is tapped.

### Form Fields
- **Header**: Drag indicator (horizontal line) and `New Event` title.
- **Event Name**: Text input with placeholder `What's the event?`. Dark background, subtle border.
- **Time Selection**:
  - Two adjacent rectangular buttons separated by a small `→` arrow.
  - Left button: `STARTS` (label) / `11:00 AM` (value).
  - Right button: `ENDS` (label) / `12:00 PM` (value).
- **Date Selection**:
  - Full-width rectangular button.
  - Calendar icon (left), date text `Friday, August 14, 2026` (center), calendar edit icon (right).
- **Priority**:
  - Three pill buttons in a row: `High`, `Medium`, `Low`.
  - The active state (e.g., Medium) uses a **gold/amber border and text**.

### Actions
- **Secondary**: `Cancel` (dark button).
- **Primary**: `Add Event` (full-width blue/purple button).

---

## 3. Date Picker Sheet

Opens when the Date Selection field is tapped in the New Event form.

- **Style**: Mimics the native iOS spinning wheel picker (Wheel/Spinner).
- **Header Bar**:
  - Left: `Cancel` (gray text)
  - Center: `Select Date` (bold white text)
  - Right: `Done` (blue text)
- **Wheels**:
  - Month (e.g., `August`)
  - Day (e.g., `14`)
  - Year (e.g., `2026`)
  - The currently selected row has a lighter gray highlight overlay.

---

## Design Tokens

| Token | Value | Usage |
|---|---|---|
| Highlight Color | `~#4A5AEF` blue/purple | Current day highlight, Add Event button, 'Done' text |
| Medium Priority | `~#C5A84D` gold/amber | Active state for Medium priority button |

---

## Open Questions

> [!NOTE]
> 1. **Time Picker**: We see the Date picker (spinning wheels). Does the Time picker (STARTS/ENDS) use the exact same spinning wheel UI (Hours/Minutes/AM-PM)?
> 2. **Event List Items**: There are no events in the screenshots. When an event is added, how does it look in the list? (Does it show time, priority color, etc.?)
> 3. **Native vs Web UI**: The spinning wheel date picker is native to iOS. Since we are building for web (Next.js) first, should we implement a custom wheel picker, or use a standard calendar-based date picker for the web version?
