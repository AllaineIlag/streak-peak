# StreakPeak — My Tasks Page UI Specification

> Analyzed from screenshots 07-19 in `/home` folder (accessed from Home → Plan card).

---

## Page Header

- **Title**: `My Tasks` — large bold white text (top-left)
- **Top-right icons**:
  - 🔍 Search icon — opens search overlay
  - ⚙️ Sort/filter icon (slider bars) — opens Sort Tasks bottom sheet
- **Motivational bar** (below title):
  - Left: `Plan your day 🚀` — with rocket emoji
  - Right: `Let's build momentum! ⚡` — with lightning emoji
  - Thin progress line underneath (gold/amber colored)
- **Bottom nav**: Navigates to the **Checklist** tab (active)

---

## Filter Tabs (Horizontal scrollable)

| Tab | Icon | Description |
|---|---|---|
| **All** | ☰ list icon | All tasks (default, white bg when active) |
| **Active** | ○ circle | Incomplete/pending tasks |
| **Done** | ✅ checkmark | Completed tasks |
| **Today** | 📅 calendar | Tasks due today |
| **Pinned** | 📌 pin | Pinned/favorited tasks (gold border when active) |

- Active tab has **white background with black text**
- Inactive tabs have **dark background with muted text**
- Pinned tab has a **gold/amber border** when active

---

## Empty State (No tasks)

- **Centered illustration**: Circular icon with checklist/checkmarks
- **Title**: `No tasks yet` — bold, white, centered
- **Subtitle**: `Create it your way — start from scratch or choose a template` — muted, centered
- **CTA Button**: `✦ Browse Templates` — dark rounded button with sparkle icon

---

## Task Completion Progress (When tasks exist — Screenshot 19)

- **Label**: `Task Completion` — left-aligned
- **Counter**: `1 / 1` — right-aligned (completed / total)
- **Progress bar**: Full-width, filled based on completion ratio
  - Uses a **red/coral color** for the filled portion

---

## Task List (When tasks exist — Screenshot 19)

- **Section header**: `Today Tasks` with count badge `1/1` and chevron `>`
- **Task item card**:
  - ✅ Completed checkmark (white circle with check) — left side
  - **Task title**: ~~strikethrough~~ when completed, muted/grayed out
  - **Time**: `8:15 AM` — right side, muted
  - **Priority indicator**: Red double-chevron (⊻ High priority) — far right
  - Dark card background with subtle border

---

## Search Overlay (Screenshot 10)

- Replaces the header with a **search input field**
- Placeholder: `Search tasks, tags...`
- Blue/purple border when focused
- ✕ clear button on the right
- Filter tabs remain visible below
- Keyboard opens automatically

---

## Sort Tasks Bottom Sheet (Screenshot 09)

- **Title**: `Sort Tasks` — bold, white
- **Options** (radio-style, single select):

| Option | Active indicator |
|---|---|
| **Date ↑** | ✓ checkmark + blue/purple border (default selected) |
| Date ↓ | — |
| Priority | — |
| Label | — |

- Dark card rows, subtle borders
- Blue/purple outline on selected option

---

## New Task Form (Bottom Sheet — Screenshots 11-12)

Opens as a **full-height bottom sheet** (drag handle at top, ✕ close button).

### Form Fields (top to bottom):

#### Title
- Input: `What needs to be done?` placeholder
- Dark input with subtle border

#### Notes (optional)
- Textarea: `Add details, links...` placeholder
- Multi-line, expandable

#### Date & Time
- Shows current date/time pre-filled: `14/08/2026 8:15 AM`
- 📅 Calendar icon on the left
- Tapping opens a **date picker dialog** (Screenshot 15)

#### Premium Divider
- Horizontal line with `🏆 Premium` text centered (gold colored)
- Indicates features below may be premium-gated

#### Priority
- 4 pill/chip buttons in a row:

| Level | Icon | Style |
|---|---|---|
| None | — dash | Default/muted |
| Low | ≫ double chevron down | Muted |
| Medium | = equals | Muted |
| High | ⊻ double chevron up (red) | Muted |

#### Label Color
- 7 color circles in a row:
  - ✓ (gray/none — default, with checkmark)
  - 🔴 Pink/Red
  - 🟠 Orange
  - 🟡 Yellow/Gold
  - 🟢 Teal/Mint
  - 🔵 Blue/Periwinkle
  - 🟣 Purple/Lavender

#### Repeat
- Card with recurrence icon + `No repeat` text + chevron `>`
- Tapping opens **Set Recurrence** bottom sheet

#### Tags
- Input: `Add tag...` placeholder
- Blue `+` button on the right

#### Subtasks
- Input: `Add subtask...` placeholder
- Teal/green `+` button on the right

#### Submit Button
- **`Add Task`** — full-width, white background, black text, bold
- Prominent CTA at the bottom

---

## Date Picker Dialog (Screenshot 15)

- **Modal overlay** on top of the New Task sheet
- **Header**: `Select date`
- **Selected date display**: `Fri, Aug 14` — large bold text
- **Edit icon** (pencil) — allows manual date entry
- **Calendar grid**:
  - Month/year navigation: `August 2026 ▼` with `<` `>` arrows
  - Day headers: `S M T W T F S`
  - Current date highlighted with **white circle** (14)
  - Standard calendar layout
- **Actions**: `Cancel` | `OK` — bottom-right

---

## Set Recurrence Bottom Sheet (Screenshots 13-14)

- **Header**: Recurrence icon + `Set Recurrence`

### Frequency
- Horizontal pill buttons (scrollable):
  - **Daily** (calendar icon) — blue/purple when selected
  - Weekly (bars icon)
  - Monthly (calendar icon)
  - Custom (sliders icon) — visible when scrolled (Screenshot 14)

### Repeat every
- Stepper control: `−` `1 day` `+`
- Dark background with rounded buttons

### Ends
- 3 pill buttons:
  - **Never** — blue/purple when selected (default)
  - On date
  - After (X occurrences)

### Preview Card
- Shows summary: `Daily` with calendar icon
- Next occurrence: `Next: 15/8/2026 07:36`
- Blue/purple tinted background

### Submit
- **`Apply Recurrence`** — full-width, blue/purple gradient button, bold white text

---

## Task Templates (Screenshots 16-18)

Opens as a **full-height bottom sheet**.

### Header
- **Title**: `Task Templates` — large bold white
- **Subtitle**: `Pick a template to start faster` — muted
- ✕ close button (top-right)

### Search
- Input: `Search templates...` — dark input with search icon

### Free Templates (☆ star icon, green label)
2-column grid of cards:

| Template | Icon | Description | Subtasks |
|---|---|---|---|
| Morning Routine | ☀️ Sun | Start your day with intention | 5 subtasks |
| Grocery Run | 🛒 Cart | Never forget what you need | 5 subtasks |
| Workout Session | 🏋️ Fitness | Track your fitness goals | 5 subtasks |
| Study Session | 📖 Book | Focus and retain more | 5 subtasks |
| Work Day Tasks | 💼 Briefcase | Stay on top of your workload | 5 subtasks |

### Pro Templates (🏆 trophy icon, gold label + gold divider line)
2-column grid with **🏆 Pro badge** on each card:

| Template | Icon | Description | Subtasks |
|---|---|---|---|
| Weekly Review | 🚀 Rocket | Reflect, reset, and plan ahead | 7 subtasks |
| Trip Preparation | ✈️ Plane | Never miss a packing essential | 8 subtasks |
| Meeting Prep | 👥 People | Show up ready and confident | 6 subtasks |
| Health Check-in | ❤️ Heart | Monthly wellness audit | 7 subtasks |
| Deep Clean Home | 🏠 House | Full house reset checklist | 8 subtasks |
| Finance Review | 📋 Clipboard | Stay on top of your money | 7 subtasks |
| Project Launch | 🚩 Flag | Ship with confidence | 7 subtasks |
| Self-Care Day | 🧘 Meditation | Recharge and reset intentionally | 7 subtasks |

### Card Design
- Dark background with subtle border
- Colored accent blob in top-right corner (matches icon color)
- Icon in a colored circle (top-left)
- Pro badge icon (top-right, gold) for premium templates
- Title — bold white
- Description — muted gray
- Subtask count — small colored pill (green for free, various for pro)

---

## Design Tokens (Tasks-specific)

| Token | Value | Usage |
|---|---|---|
| Active tab bg | `#FFFFFF` | Selected filter tab |
| Active tab text | `#000000` | Selected filter tab text |
| Pinned tab border | `~#C5A84D` gold | Pinned tab active outline |
| Sort selected | `~#4A5AEF` blue/purple | Selected sort option border |
| Recurrence button | `~#5B6CF7` blue/purple | Active frequency, Apply button |
| Priority High | `~#FF4444` red | High priority chevrons |
| Progress bar | `~#FF5A5A` red/coral | Task completion progress |
| Label colors | pink, orange, gold, teal, blue, purple | 6 label color options |
| Template free label | `~#4ADE80` green | Free template subtask count |
| Template pro label | `~#C5A84D` gold | Pro section header |
| Completed task text | `~#4A4A4A` | Strikethrough muted text |

---

## Open Questions

> [!NOTE]
> 1. **Task swipe actions**: Can you swipe a task item to delete/pin/edit? If so, a screenshot would help.
> 2. **Task detail view**: What happens when you tap on an existing task? Does it open a detail/edit view?
> 3. **Premium gating**: Should we implement the Free vs Pro template distinction, or make all templates free in StreakPeak?
> 4. **Subtask behavior**: When you expand a task with subtasks, how do they appear? Nested list? Indented checkboxes?
