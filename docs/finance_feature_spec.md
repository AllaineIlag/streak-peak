# StreakPeak — Finance Tracker UI Specification

> Analyzed from screenshots provided in the `/home` folder on 2026-08-14.
> This feature is accessed via the "Finance" card on the Home screen ("Budget & expenses").

---

## Overview
The Finance Tracker is a comprehensive module composed of three main tabs, navigated via a floating pill-shaped bottom navigation bar.

**Bottom Navigation Bar (Floating Pill)**
- **Setup** (Wallet icon) - Manage budget and expenses.
- **Dashboard** (Pie chart icon) - Analytics and trends.
- **Lab** (Beaker icon) - Interactive financial simulators.
- **Info** `(i)` icon - Opens a "How to use" modal.

*Note: The active tab expands to show its text label next to the icon (e.g., `[Wallet icon] Setup`), while inactive tabs only show their icons.*

---

## 1. Setup Tab (Default View)

### Header
- Left: `<` Back button.
- Center: `SETUP` (Uppercase, letter-spaced).
- Right: Settings / Filters icon (sliders).

### Top Card: Budget Overview
- **Empty State**: 
  - `Set your monthly budget` (Tap to get started →).
- **Filled State**: 
  - `GOAL MET 🎯` (Top left).
  - Large text: `$5000` (of $5000 monthly budget).
  - Right side: Circular progress ring showing `100%`.
  - Bottom row: `Savings goal: $1000` with a linear progress bar (`100%`).
  - Below progress: `Projected: $0` (On track) inside a gold-outlined box.
  - Action: `Edit budget` button (small dark pill).

### Expenses List
- **Header**: `EXPENSES` (Left) | `X items` (Right).
- **Controls**: 
  - Search bar (`Search expenses, tags, notes...`).
  - Filter pills (e.g., `All`).
- **Empty State**: Receipt icon, "No expenses yet", description text, and an `Add your first expense` button.
- **Floating Action Button**: A white pill button `+ Add Expense` floats near the bottom right.

---

## 2. Setup Configuration Sheets

### Budget Setup (Bottom Sheet)
- **Currency**: Custom dropdown (e.g., `PHP - Philippine Peso`). *Requires an external API or hardcoded list of major currencies.*
- **Monthly Budget**: Number input.
- **Savings Goal**: Number input (Optional).
- **Premium Features** (Separated by a gold ribbon divider):
  - **Spend Alert Threshold**: Pills to trigger alerts (`Off`, `50%`, `60%`, `70%`, `80%`, `90%`).
  - **End-of-month projection**: Toggle switch (Forecast spending based on current pace).
- **Action**: `Save Budget` (Full-width white button).

### New Expense (Bottom Sheet)
- **Expense Name**: Text input (`e.g. Netflix`).
- **Amount**: Number input (`$ 0`).
- **Frequency**: Pills (`Daily`, `Weekly`, `Monthly` - Active).
- **Category**: Cluster of icon+text pills (`Housing`, `Food`, `Transport`, `Health`, `Entertainment`, `Shopping`, `Utilities`, `Savings`, `Education`, `Other`).
- **Premium Features**:
  - **Fixed / Recurring**: Toggle switch (Mark as a fixed monthly cost).
  - **Note (Optional)**: Textarea.
  - **Tags (Optional)**: Input + Add button.
  - **Alert Threshold (Optional)**: Similar to the budget alert pills.
- **Action**: `Add Expense` (Full-width white button).

---

## 3. Dashboard Tab

### Header
- Center: `DASHBOARD`.

### Widgets
1. **Budget Allocation (Wide Card)**:
   - Header: `0% committed` (Blue text).
   - Details: `Committed $0` (Blue dot) vs `Free $5000` (Green dot).
2. **Metrics Row (3 Small Cards)**:
   - `Expenses` (Count).
   - `Top spend` (Category or Amount).
   - `Savings` (e.g., "Goal met!" in green).
3. **Monthly Trend (Large Card)**:
   - Line/Bar chart area.
   - Legend: `Spent` (Blue), `Budget` (Green).
   - X-Axis: Months (e.g., `Aug`).

---

## 4. Finance Lab Tab

### Header
- Center: `FINANCE LAB`. Subtitle: `Interactive tools to plan your financial future.`

### Interactive Simulators (Cards)
1. **Financial Health Score** (Shield icon):
   - Circular score out of 100 (e.g., `100` Green).
   - Rating text: `Excellent` (Based on savings rate and budget adherence).
2. **Affordability Checker** (Bag icon):
   - Input: `Enter cost`. Action: `Check` button.
   - Purpose: Checks if a purchase fits within the "Free" budget.
3. **Budget Simulator** (Sliders icon):
   - Slider: Adjust `Simulated Income` from -50% to +100%.
   - Output: Updates the `Resulting Free Cash` dynamically.
4. **Savings Planner** (Piggy bank icon):
   - Input: Target goal amount (e.g., `5000`).
   - Slider: Timeline (e.g., `12 months`).
   - Output: `Required Savings` (e.g., `$417 /mo`).
5. **Expense Impact Analysis** (Chart icon):
   - Slider: `Reduce flexible spending by: X%`.
   - Output: `Monthly Savings` and `Yearly Savings` based on the reduction.

---

## 5. Info Modal
Triggered by the `(i)` button in the floating nav bar.

- **Type**: Simple centered popup modal (Alert style).
- **Title**: `Finance Tracker`.
- **Content**: Bulleted list explaining the 3 tabs (Setup, Dashboard, Finance Lab).
- **Action**: `Got it` (Blue text).

---

## Open Questions

> [!NOTE]
> 1. **Currency Exchange Rates**: Are we just changing the display symbol (e.g., $ to ₱), or are we actively converting values using an exchange rate API? If no conversion is needed, we don't necessarily need an API, just a locale formatting list.
> 2. **Charts Component**: For the Dashboard `Monthly Trend`, we'll need a charting library. Recharts or Chart.js are good options for Next.js.
> 3. **Premium Features**: As with tasks, some features are gated behind "Premium" (e.g., tags, recurring toggle, end-of-month projections). How are we simulating "Premium" status in the MVP? (e.g., a simple global context toggle `isPremium = true`).
