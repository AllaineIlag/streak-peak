# StreakPeak — Notes UI Specification

> Analyzed from screenshots provided in the `/home` folder on 2026-08-14.
> This feature is accessed via the "Notes" card on the Home screen ("Quick thoughts") or the "Notes" tab in the main bottom navigation.

---

## Overview
The Notes feature provides a robust, markdown-friendly text editor with categorization, theming (colors/gradients), and sharing capabilities.

---

## 1. Main Notes Screen (`My Notes`)

### Header
- **Title**: `My Notes` (Large, bold) followed by a small number indicating the total note count (e.g., `1`).
- **View Toggle**: A button on the right to toggle between Grid View (grid icon) and List View (list icon).

### Category / Filter Tabs
A horizontally scrolling list of pills/tabs:
- `All` (Active state is a solid dark gray pill with a grid icon).
- `Personal`, `Workspace`, `Shared with me`, `Shared` (Inactive states are just text with icons).

### Content Area
- **Grid View**: Notes are displayed as square/rectangular cards. Includes a dashed-border `+ Add Note` card.
- **List View**: Notes take up the full width. The `+ Add Note` card is hidden.
- **Note Card Details**:
  - Top Left Pill: Category (e.g., `Personal` in pink).
  - Title: Bold white text.
  - Body Snippet: Gray text showing the first few lines.
  - Bottom Right: Day (e.g., `Wed`) and an expand/chevron arrow.

### Floating Action Button (FAB)
- A large white circular button with a `+` icon, anchored to the bottom right (above the main app navigation bar).
- **Interaction**: Tapping the FAB opens a bottom sheet with two options:
  1. `Blank note` (Start from scratch) - Pencil icon.
  2. `Use a template` (14 templates available) - Grid icon.

---

## 2. Note Editor

### Header (Editing Mode)
- **Left**: `<` Back button.
- **Center**: (Empty when actively typing).
- **Right Icons**: 
  - Book Icon (Read mode / Preview).
  - Palette Icon (Theme settings).

### Header (Viewing Mode / Keyboard Closed)
- **Left**: `<` Back.
- **Center Status**: `• Saved just now` with a checkmark.
- **Right Icons**:
  - Pencil Icon (Edit mode, blue color).
  - Share Icon (Network dots).
  - Palette Icon (Theme settings).
  - `...` (More options).

### Editor Body
- **Category Picker**: `📁 Add category` dropdown at the top.
- **Title**: Large, bold input placeholder `New note`.
- **Body**: Standard text area `Start writing...`.
- **Footer Stats**: Shows word and character count at the bottom when keyboard is closed (e.g., `3 words · 5 characters`).

### Formatting Toolbar
Appears above the keyboard when typing:
- Align text, Checkbox, Bullet list, Divider line.
- **`+` Button (Right side)**: Opens the "Quick insert" bottom sheet.

---

## 3. Editor Bottom Sheets

### Quick Insert
Triggered by the `+` in the formatting toolbar. Provides block-level insertions:
- `Checklist item` (`- [ ] Task`)
- `Bullet list` (`• Item`)
- `Numbered list` (`1. Item`)
- `Divider` (`___`)
- `Date & time stamp` (`Today, HH:MM`)

### Palette (Theming)
Triggered by the Palette icon. Allows changing the note's background/card color.
- **Tabs**: `Colors` | `Gradients`.
- **Colors**: 8 solid color swatches (Dark Blue, Red, Green, Blue, Purple, Pink, Orange, Teal).
- **Gradients**: 6 named gradient swatches (`Aurora`, `Sunset`, `Forest`, `Midnight`, `Fire`, `Candy`).

### More Options (`...`)
- `Manage note` (Gear icon).
- `Delete note` (Red text, trash icon).

---

## 4. Manage Note (Sharing Settings)

Accessed via the `...` menu -> "Manage note".

### Note Information Card
- `Title`: Name of the note.
- `Status`: e.g., `Private` (Lock icon).
- `Created` & `Last Modified`: Timestamps (e.g., `Aug 14, 2026 11:09`).
- `Total Shared`: e.g., `0 user(s)`.

### User List
- Shows the owner's card: Avatar, Username, Email.
- Badges: `Owner` (Green pill), `You` (Blue pill), Gold Star icon.
- Empty state below: "No users shared with".
- Bottom accordion/dropdown: `Share with more people`.

---

## Open Questions

> [!NOTE]
> 1. **Editor Library**: For the Next.js web app, we'll need a rich text or block-based editor that supports Markdown shortcuts. `TipTap` or `Editor.js` are great candidates to match this block-insertion and formatting toolbar feel.
> 2. **Templates**: The "Use a template" button mentions 14 templates. Do we have designs or JSON structures for these, or should we hardcode a few generic ones for the MVP?
> 3. **Theming Scope**: Does changing the color/gradient in the Palette change the background of the *entire* editor screen, or just the background of the note's *card* on the main My Notes list screen?
