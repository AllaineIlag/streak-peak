# StreakPeak — Alarms & Timers UI Specification

> Analyzed from screenshots provided in the `/home` folder on 2026-08-14.
> This feature is accessed via the "Timer" card on the Home screen ("Alarms & timers").

---

## 1. Mode Selection Screen
This acts as the entry point or routing screen for this module.

- **Header**: 
  - Left: `<` Back button.
  - Subtitle (dynamic color based on selection): `STOPWATCH` (Blue), `TIMER` (Purple), or `ALARM` (Green).
  - Title: `Choose your mode` (Large, centered).
- **Options (Cards)**:
  - Each option is a large rounded rectangle with an icon, title, subtext, and a radio button on the right.
  - When selected, the card gets a colored border and the radio button fills in with that color.
  - **Stopwatch**: Measure elapsed time (Blue `~#4A5AEF`).
  - **Timer**: Countdown to zero (Purple `~#8B5CF6`).
  - **Alarm**: Schedule a reminder (Green `~#10B981`).
- **Action**: Full-width `Continue →` button at the bottom (White/Silver gradient).

---

## 2. Stopwatch Mode

### Running State
- **Header**: `<` `STOPWATCH` (Centered, small letter-spaced text).
- **Display**: 
  - Subtext: `ELAPSED`
  - Large white timer format: `MM:SS:CS` (e.g., `00:01:78` where 78 is centiseconds).
- **Primary Controls**: Two large circular buttons side-by-side.
  - **Start** (Green background, white play icon) → Becomes **Stop** (Red background, white square icon) when running.
  - **Lap** (Blue background, white flag icon).
- **Secondary Control**: `↺ Reset` (Full-width dark gray button at the bottom of the screen).

---

## 3. Timer Mode

### Setup State
- **Header**: `<` `TIMER`.
- **Title**: `COUNTDOWN` / `Set duration`.
- **Picker UI**: A custom inline scrolling picker.
  - Columns: `HRS` | `MIN` | `SEC`.
  - The currently selected row is highlighted with a purple pill border (e.g., `05 : 00 : 00`).
- **Action**: `▶ Start Timer` (White/Silver gradient button at bottom).

### Running State
- **Header**: `<` `Timer`.
- **Display**: A large, thick circular ring (light purple) containing the countdown time `04:59:59` (HH:MM:SS format).
- **Controls**: Three solid white circular buttons at the bottom.
  - Left: **Reset** (↺)
  - Center: **Pause** (⏸) — presumably becomes Play when paused.
  - Right: **Stop** (⏹)

---

## 4. Alarm Mode

### Setup State
- **Header**: `<` `ALARM` (Centered). Right-aligned pill: `⏰ Active`.
- **Title**: `SCHEDULE` / `Set your reminder`.
- **Time Picker**: Similar to the Timer picker, but with columns: `HR` | `MIN` | `AM/PM`. Highlighted row uses a green border.
- **Configuration Options** (List items below picker):
  - `Repeat` → Shows current selection (e.g., `One time only` in green text).
  - `Alarm Sound` → Shows current selection (e.g., `Default` in green text).
- **Action**: `⏰ Set Alarm` (White/Silver gradient button).

### Repeat Config (Bottom Sheet)
- Drag handle + `Repeat` title.
- Pill buttons: `Every day`, `Weekdays`, `Once only` (Active state is green).
- Row of individual day toggles: `M`, `T`, `W`, `T`, `F`, `S`, `S`.
- `Done` button.

### Sound Picker Note
- The provided screenshot (`Screenshot_20260814_104210_SecSoundPicker.jpg`) shows a native Android/Samsung system ringtone picker (light theme, volume slider, list of system sounds like "Beep-Beep", "Chime"). 

### Alarm Set (Confirmation Screen)
- Appears after tapping "Set Alarm".
- **Visuals**: A glowing green circle with a checkmark-alarm icon in the center.
- **Details**: `ALARM SET`, large time (`10:51`), and `AM` (green).
- **Pill**: `🔁 One time only`.
- **Actions**:
  - `View all active alarms` (Card with a green icon, `1 alarm scheduled >`).
  - `Cancel this alarm` (Card with a red icon and red text).
- **Bottom Action**: `✓ Done` (White/Silver gradient button).

---

## Design Tokens

| Token | Value | Usage |
|---|---|---|
| Stopwatch Theme | `~#4A5AEF` blue | Stopwatch card border, Lap button |
| Timer Theme | `~#8B5CF6` purple | Timer card border, Time picker highlight, Timer ring |
| Alarm Theme | `~#10B981` green | Alarm card border, Time picker highlight, confirmation screen |
| Stop Action | `~#EF4444` red | Stop stopwatch, Cancel alarm |

---

## Open Questions

> [!NOTE]
> 1. **Time/Date Pickers**: We now have custom dark-mode scroll wheels for the Timer and Alarm, but earlier we saw a native iOS-style wheel for the Calendar. We should standardize on one custom web component for all scrolling wheel pickers.
> 2. **Ringtones**: The screenshot shows a native OS ringtone picker. For the web version, we will need to provide a few custom MP3 files and build an in-app selection UI, as web apps cannot access native OS ringtones.
> 3. **Background Alarms**: Web browsers aggressively throttle or sleep background tabs. When building the Next.js version, alarms and timers might be inaccurate or fail to ring if the user switches tabs or minimizes the browser. Do we want to implement Web Workers or Service Workers to attempt to mitigate this, or is this acceptable until the React Native build?
