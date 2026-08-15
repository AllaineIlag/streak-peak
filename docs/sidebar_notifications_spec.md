# Cognize / StreakPeak — Sidebar & Notifications UI Spec

> Analyzed from screenshots provided in the `/home` folder on 2026-08-14.
> These features are accessed via the Home screen header (☰ Hamburger menu and 🔔 Bell icon).

---

## 1. Notifications Screen

Accessed by tapping the bell icon (🔔) in the top right of the Home screen. A red dot appears on the bell if there are unread notifications.

### Header & Controls
- **Header**: `<` Back button, `Notifications` (Center title), `↓ Newest` (Sort/Filter button on the right).
- **Status Row**: 
  - Left: `[N] unread` (Purple pill badge).
  - Right: `Clear all` (Red text button).

### Notification Feed
- Grouped by time (e.g., `TODAY` small caps section header).
- **Notification Card**:
  - **Left Icon**: A gray circle containing an icon relevant to the notification type (e.g., a bell).
  - **Tag**: A small gray pill indicating the module (e.g., `CheckList`).
  - **Title**: Bold white text (e.g., `Morning Routine`).
  - **Subtitle**: Muted gray text (e.g., `New Task`).
  - **Time & Status**: Right-aligned muted text (e.g., `3h ago`) followed by a small colored dot (indicating it is unread).

---

## 2. Sidebar (Hamburger Menu)

Accessed by tapping the ☰ icon in the top left of the Home screen. It slides in from the left, dimming the rest of the screen.

### User Profile Section (Top)
- **Close Button**: `ⓧ` in the top right corner of the drawer.
- **Avatar**: Large circular profile picture, surrounded by a vibrant blue/pink/purple gradient ring (likely indicating premium status or a streak).
- **Name**: e.g., `llag,` (Large, bold).
- **Email**: e.g., `sungjinwoo1515@gmail.com` (Muted, gray).

### Main Navigation Links
Rendered as wide, dark cards with an icon on the left:
- `📄 Notes`
- `☑️ Checklist`
- `📅 Events`

### Free Tools Section
- **Header**: `FREE TOOLS` (Muted, uppercase).
- **Links**:
  - `⏱ Timer`
  - `🔐 Vault`
  - `🌐 World Clock`
  - `💳 Budget Tracker`

### Premium Tools Section
- **Header**: `PREMIUM TOOLS 🏆` (Muted, uppercase, with a small gold trophy icon).
- **Links** (Each item has a gold diamond/rhombus icon `🔸` on the far right, indicating it requires a premium subscription):
  - `🔄 Habits`
  - `🧠 Focus Mode`
  - `📚 WorkSpaces`

### Footer Actions
- **Logout**: `[→ Logout` (Red icon, red text) located at the bottom of the scrollable list.
- **Sticky CTA**: A floating button anchored to the bottom of the drawer: `[Cognize Logo] Join Premium` (Gradient or slight glow effect).

---

## Open Questions

> [!NOTE]
> 1. **Premium Gating**: The sidebar lists `Habits` and `WorkSpaces` as Premium Tools. In earlier mockups, Habits seemed like a core feature. Should Habits be strictly behind a paywall, or just advanced Habit features (like unlimited habits)?
> 2. **Notifications Logic**: What triggers a notification in this app? Are they purely local (e.g., habit reminders generated on the device) or pushed from the server (e.g., someone shared a Workspace note with you)?
