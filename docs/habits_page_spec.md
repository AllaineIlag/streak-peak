# StreakPeak — Habits Page UI Specification

> Analyzed from screenshots 20-33 in the `/home` folder.

---

## Screen Layout & Navigation

The Habits feature has its own internal bottom navigation bar with 4 tabs:
- **Habits** (✓ checkmark in circle) — Active tab (blue pill shape)
- **Stats** (📊 bar chart)
- **Challenges** (🏆 trophy)
- **Info** (ℹ️ info circle)

### Header (Common across tabs)
- **Left**: `<` Back button
- **Title**: `HABITS` (or `STATS`, `CHALLENGES` depending on tab) — uppercase, letter-spaced
- **Right (Habits tab only)**:
  - ⊞ Grid/List view toggle icon
  - ≡ Sort/Filter icon (opens Sort bottom sheet)

---

## 1. Habits Tab (Screenshots 20, 31-33)

### Progress Card (Top)
- Dark card with a subtle border.
- **Greeting**: `Good morning ☀️`
- **Stats**: Large `0` / small `0` followed by `habits completed`.
- **Chart**: Circular progress ring `0%` on the right side.
- **Today's Intention**: Input field with a lightbulb (💡) icon, placeholder "Today's intention...", and a `✓` submit button.

### Category Filters (Horizontal Scrollable)
Pill buttons for filtering habits by category:
- **All** (white background when active)
- **General** (✓ icon)
- **Health** (❤️ icon)
- **Fitness** (🏋️ icon)
- **Mindfulness** (🕉️ icon)
- **Learning** (📘 icon)
- **Productivity** (🎯 icon)
- **Nutrition** (🍴 icon)
- **Sleep** (🌙 icon)
- **Social** (👥 icon)
- **Finance** (💰 icon)
- *Inactive state: dark background, muted text.*

### Habit List Section
- **Header**: `TODAY'S HABITS` (left), count `0/0` (right, blue text).
- **Empty State**:
  - Refresh/loop icon (🔄) in a circle.
  - Title: `No habits yet` (bold, white).
  - Subtitle: `Start your consistency journey by picking a template below or creating a custom habit to track your daily progress.` (muted text).
  - **Primary Action**: `✦ Browse Templates` (blue button with sparkle icon).
  - **Secondary Action**: `+ Create custom habit` (dark button).

---

## 2. Sort By Bottom Sheet (Screenshot 21)

Opens when tapping the sort icon in the top right.
- **Title**: `Sort by`
- **Options** (single select, blue outline and checkmark for active):
  - **Default**
  - **Streak**
  - **Completion**
  - **Category**

---

## 3. Stats Tab (Screenshot 22)

- **Empty State**:
  - Calendar icon (📅) in a circle.
  - Title: `No habits to show`
  - Subtitle: `Add habits first to track monthly progress.`

---

## 4. Challenges Tab (Screenshot 23)

Global/community challenges users can join.
- **Challenge Card**:
  - Left: Graphic/Icon (e.g., Sunrise, Sleeping Face, Books, Person walking).
  - Center: Title (e.g., `Awake at 7:00 AM`), Description (`Start your day early and fresh.`), Participant count (`👥 250 joined`).
  - Right: `Join` button (blue/purple).

### Info Bottom Sheet (Screenshot 24)
Opens when tapping the Info tab (ℹ️).
- **Icon**: ⭐ Star in a gold circle.
- **Title**: `Habit Tracker`
- **Description**: `Track your daily habits, view detailed monthly statistics, and join global challenges to stay motivated!`
- **Action**: `Got it` (blue button).

---

## 5. Habit Templates (Screenshots 25-30)

Opens as a bottom sheet from "Browse Templates".

### Search & Layout
- **Header**: `Habit Templates` | `Pick a template to start faster` | `✕` close button.
- **Search**: `Search templates...` input bar.
- Two-column grid layout.

### Free Templates (Badge: 4)
- Drink Water (💧)
- Read a Book (📚)
- Workout (💪)
- Meditate (🧘)

### Pro Templates (Badge: 6, ⭐ gold star)
- Wake Up Early (🌅)
- Eat Greens (🥗)
- Journaling (✍️)
- Learn a Skill (🧠)
- Sleep 8 Hours (😴)
- 10k Steps (🚶)

---

## 6. Template Detail Bottom Sheet (Screenshots 27-30)

When a template is tapped, a detail sheet slides up.
- **Header**: Large icon + Title + Subtitle. (Pro badge shown if applicable).
- **Default Settings Card**:
  - `Category` (e.g., Health, Learning, Nutrition).
  - `Target` (e.g., 7 days/week, 5 days/week).
  - `Goal` (e.g., 8 times/day, 20 min/day, Check off).
- **Actions**:
  - `Cancel` (dark button).
  - `Use Template` (teal/green gradient button).

---

## Design Tokens (Habits-specific)

| Token | Value | Usage |
|---|---|---|
| Primary Button | `~#4A5AEF` blue/purple | Active tabs, Join buttons, Sort active |
| Use Template Button | Teal/Green gradient | Confirming template selection |
| Category pill active | `#FFFFFF` | Selected category tab |
| Pro badge | `~#C5A84D` gold | Pro templates identifier |
| Stats/Numbers | Blue text | Completion counts like `0/0` |

---

## Open Questions

> [!NOTE]
> 1. **Grid vs. List View**: The header has a view toggle icon. How does the grid view look compared to the list view for actual habits?
> 2. **Custom Habit Form**: What fields are included when "Create custom habit" is tapped? (We can assume Title, Category, Target, Goal based on the template details, but are there more?)
> 3. **Challenges**: Do we want to implement fake/real global challenges in StreakPeak, or skip this feature for the MVP?
> 4. **Stats**: What do the actual monthly statistics look like once habits are added? (A calendar view? Bar charts?)
