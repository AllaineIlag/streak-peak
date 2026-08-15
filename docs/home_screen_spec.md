# Cognize / StreakPeak — Home Screen UI Specification

> Analyzed from screenshots provided in the `/home` folder on 2026-08-14.

---

## 1. Core Concept: A Modular Dashboard

The Home Screen is a vertically scrollable, fully modular dashboard. Instead of a fixed layout, the screen is composed of various **Widgets** and **Sections** that the user can reorder, hide, or customize.

### Global Edit Mode
- **Trigger**: Long-pressing anywhere on the home screen, or tapping the "Edit" button in the Arsenal section.
- **State Change**: The entire screen enters a customization mode.
- **Save Action**: Tapping a `✓ Done` button (which replaces the Edit button) saves the layout and triggers a full-screen confetti animation and success toast.

---

## 2. Dashboard Widgets (The Reorderable Sections)

When in Global Edit Mode, scrolling to the bottom reveals a `◫ DASHBOARD WIDGETS` list manager. This allows the user to reorder the main vertical sections of the home screen using drag handles (`⸬`) and remove them with red minus (`−`) buttons.

The available modular sections include:

### TODAY AT A GLANCE (Fixed/Non-removable)
- **Stats row**: 3-column card displaying `Day streak`, `Focus cycles`, and `Tasks done`. Numbers are large and bold, labels are small.

### YOUR ARSENAL (Customizable Quick Access)
- The user's primary quick-launch grid.
- **Front & Center**: The first item placed in the Arsenal gets a special expanded card treatment (large icon, title, subtitle).
- **Grid Items**: The remaining items form a two-column grid.
- **Edit Mode details**:
  - Items get a red `−` remove badge.
  - A slot indicator (blue dashes) shows how many slots are used. **Limit: 6 slots** (Wait, the user requested 7 previously, but the new UI mockups show 6 dashes and "Quick access is full". We will stick to the user's explicit request of **7 by default** as noted in previous specs).
  - Below the grid, an `ADD TO QUICK ACCESS` drawer appears, listing `PRIMARY` (Tasks, Habits, Templates) and `UTILITIES` (Pomodoro, Timer, World Clock, Budget, Notes, Vault, Workspaces, Focus Mode) as pills that can be tapped to add to the Arsenal.

### DAILY QUOTE
- Dark card with subtle green/teal tinted border.
- Gold quotation marks, large bold white quote text, and small muted attribution.

### UP NEXT (Tasks)
- Displays a preview of pending tasks.
- If empty: `--:-- | No tasks pending for today`.
- Contains a full-width `Plan your day` CTA button.

### HABITS
- Displays a preview of daily habits.
- If empty: `⊕ No habits yet — tap to add one`.

### MORE TOOLS
- A grouped section for tools not in the Arsenal.
- Split into `⚡ PRIMARY` and `🔧 UTILITIES`.
- Includes a `^ Collapse` toggle.

### CALENDAR
- A horizontal weekly strip (M T W T F S S) with the current date highlighted in a blue circle.
- Action: `⊕ Tap to add an event`.

### POMODORO
- A widget to quickly start a session.
- Subtitle: `Ready to start your first focus block? ⏱`
- Button: `Begin →` (Blue).
- Icon: A 3D tomato.

### AI BRIEFING
- A premium feature banner offering an AI summary of the day.

### WORKSPACES
- Displays a preview card of the user's active workspace (e.g., `StreakPeak`, `1 member`, `Owner` pill).

---

## 3. Fixed UI Elements

These elements are persistent and frame the modular dashboard.

### Header Bar (Sticky)
- **Left**: Hamburger menu icon (☰)
- **Center-left**: App logo + **"Cognize"** text
- **Right**: Bell/notification icon (🔔) with a red dot if there are notifications.
- **Below Header**: `FRIDAY, AUG 14` (small gray) + `Good morning, [Name],.` (large white).

### Footer (Below all widgets)
- A cluster of secondary action buttons:
  - `Send feedback` (chat bubble icon)
  - `Rate the app` (star icon)
  - `Weekly Review` (chart icon)
  - `Invite friends · Earn Pro` (person+ icon, blue text, `Stats →` button)

### Bottom Navigation Bar (Sticky)
- 5 tabs: `Home` (Active), `Notes`, `Events`, `Checklist`, `Profile`.
- Active tab has a filled white icon and white text.
- Inactive tabs have outlined gray icons and text.

---

## Interactions & Behaviors

1. **Long-press to Customize**: Holding a touch anywhere activates Global Edit Mode.
2. **Reordering Arsenal**: Drag and drop cards within the Arsenal block to change quick-access layout. The first item becomes the "Front & Center" large card.
3. **Reordering Sections**: Scroll to `DASHBOARD WIDGETS` in edit mode to rearrange the macro layout (e.g., put Habits above Up Next).
4. **Confetti on Save**: Tapping "Done" triggers a `canvas-confetti` explosion and a success toast.

---

## Open Questions

> [!NOTE]
> 1. **Data Persistence**: Storing the customized layout (Arsenal item order + Widget section order) will require a `user_preferences` table in Supabase (likely stored as a JSON array of component IDs).
> 2. **Performance**: Rendering a completely dynamic list of heavy components (Calendar strips, Habit lists) might cause jank on drag-and-drop. We'll need a robust library like `@hello-pangea/dnd` (React Beautiful DnD fork) or `dnd-kit` for smooth animations.
