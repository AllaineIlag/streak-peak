# StreakPeak

The core domain and architectural language for the StreakPeak application, defining our approach to productivity, tracking, and data fetching.

## Language

### Architecture & Data Flow

**Stale-While-Revalidate (SWR)**:
A data-fetching pattern where the UI instantly displays cached data (stale) while simultaneously fetching fresh data in the background to update the cache. Used for reading dashboard data (e.g., Weekly Review) to prevent loading screens. 
*UI Rule*: When a page loads using cached SWR data, all initial entry animations (fade-ins, slide-ins) MUST be disabled so the UI snaps into place instantaneously.
_Avoid_: Background syncing, optimistic loading, cache-first

**Optimistic UI**:
A mutation pattern where the UI is updated immediately upon user interaction before the server confirms the change. Used for writing data (e.g., checking off a task or habit) to make the app feel instantly responsive.
_Avoid_: Fake updates, client-side overrides

**Zustand Store**:
The in-memory client-side cache used to hold cross-page state (Tasks, Habits, Reviews). This is the source of truth for both SWR and Optimistic UI patterns.
_Avoid_: Local state, client cache, context provider
