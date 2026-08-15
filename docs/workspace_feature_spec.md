# StreakPeak — Workspace UI Specification

> Analyzed from screenshots provided in the `/home` folder on 2026-08-14.
> This feature is accessed via the "Spaces" card on the Home screen ("Organized notes").

---

## Overview
Workspaces (or "Spaces") allow users to create isolated folders/groups for notes and collaborate with other users by inviting them to a workspace.

---

## 1. My Workspaces (Dashboard)

### Header
- **Left**: `<` Back button.
- **Center**: `My Workspaces` (Large, bold).
- **Right Action**: `+` (Create workspace) button inside a white circular background.
- **Search**: A full-width search bar `Search workspaces...` with a filter icon on the right.

### Content (Empty State)
- **Visual**: A 3D-style yellow/blue folder icon.
- **Text**: `No Workspaces Yet`.
- **Subtext**: `Create a workspace to collaborate with your team on shared notes.`
- **Action**: Full-width white button `+ Create Workspace`.

### Content (Filled State)
- Displays a vertical list of workspace cards.
- **Card UI**:
  - Title: Workspace Name (e.g., `StreakPeak`).
  - Members Preview: A cluster of overlapping member avatars (e.g., a blue circle with `SG` initials).
  - Footer: Member count (e.g., `👥 1 member`) aligned left, and the user's Role (e.g., `Admin`) aligned right.

---

## 2. Inside a Workspace

### Header
- **Left**: `<` Back button.
- **Center**: 📁 Folder icon + Workspace Name (e.g., `StreakPeak`), with a subtext of member count (`1 members`).
- **Right Icons**:
  - 👥 People icon (Navigates to Members management).
  - `⋮` More options (Vertical ellipsis).

### More Options Menu (`⋮`)
A dropdown or popover containing:
- `Edit Workspace` (Standard text).
- `Delete Workspace` (Red text).

### Content Area
- Functions similarly to the "My Notes" grid/list view, but scoped to this workspace.
- **Empty State**: 
  - Visual: 3D Pencil icon.
  - Text: `No notes yet` / `Tap the + button to add the first note.`
- **Action**: A floating `+` button (white squircle shape) in the bottom right corner.

---

## 3. Members Management

Accessed via the People icon in the Workspace header.

### Members List
- **Header**: `<` `Members`. Right action: 👤+ (Add Member icon).
- **Usage Pill**: Top-left pill indicating seat usage (e.g., `1/10 members` in a blue pill).
- **List Items**: 
  - Cards showing Avatar, Name, and Role (e.g., `You` with a blue `Owner` pill).

### Add Members (Bottom Sheet)
- **Header**: `Add members` (Title), `[Workspace Name] · 1 of 10 seats` (Subtitle).
- **Progress Bar**: Text `1 of 10 seats used` above a linear progress bar.
- **Search**: Input `Search by name or email...`

### 💡 User Modification: "Suggested" Accounts Redesign
*As requested by the user, the random "Suggested" accounts from the original design will be removed to avoid confusion.*

- **Updated Empty State**: If the user has not searched for an email or invited anyone yet, we will display a clean blank state instead of random profiles.
- **Suggested Text**: A simple prompt like "Invite Team Members by searching their email above."
- **Once Searched**: Displays the corresponding user profile to invite.

### Footer Actions
- `Cancel` (Dark/Transparent button).
- `Done` (Full-width blue button `~#4A5AEF`).

---

## Open Questions

> [!NOTE]
> 1. **Collaboration Mechanics**: Does the MVP actually require real-time collaboration (like Google Docs/WebSockets), or just shared read/write access to the notes within the workspace? Real-time syncing (via Yjs or Liveblocks) adds significant complexity.
> 2. **Seat Limits**: The UI shows `1/10 seats used`. Is this a hard limit we need to enforce in the database, or just a UI placeholder for a future premium tier?
