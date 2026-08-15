# StreakPeak — Subtasks and Notes Templates Specification

> Analyzed from the 25 new screenshots uploaded on 2026-08-14.

---

## 1. Subtasks UI
When a user adds subtasks to a main task (e.g., "Exercise"):
- The main task expands to show a nested list.
- **Progress Indicator**: A small line below the main task title shows `0/3` (completed subtasks / total subtasks).
- **Subtask Items**: 
  - Indented slightly to the right.
  - Rendered as small circular radio buttons (empty circles).
  - Examples: `Squats`, `Pushups`, `Lunges`.
- Tapping a subtask fills the circle and strikes through the text.

## 2. Note Templates
The app provides 14 pre-built templates for the Notes module. They are structured as simple rich-text (Markdown) documents with emojis. 

*Sample Templates:*

### Template: My Daily Routine
```markdown
🌅 Morning (6-9 AM)
- Wake up & hydrate
- Exercise / stretch
- Review today's goals

💼 Work Block (9 AM-12 PM)
- Priority task 1:
- Priority task 2:

🍽️ Afternoon (12-3 PM)
- Lunch break
- Emails / messages

🌙 Evening (6-9 PM)
- Wind down
- Tomorrow's plan
- Reflection:
```

### Template: Meeting
```markdown
Meeting —

📅 Date:
👥 Attendees:
🎯 Agenda:
1.
2.

📝 Key Discussion Points:
-
-

✅ Action Items:
- [ ]
- [ ]

📌 Decisions Made:
-

🔜 Next Steps:
-
```

### Template: Idea
```markdown
Idea:

💡 The Idea:

🤔 Why it matters:

⚡ Quick wins to test it:
1.
2.

🚧 Potential blockers:
-

📚 Resources / references:
-

⭐ Excitement level: /10
```

## 3. Product Updates Based on Feedback
- **Finance**: We will add a feature to allow users to edit their monthly budget (addressing the current app's limitation).
- **Tasks**: We will build a dedicated "Task Management/Collection" page where users can click into a task to customize its details (subtasks, labels, priority), rather than just checking it off.
- **Premium Gating**: All premium features are unlocked for the MVP.
- **Web Constraints**: OS-level widgets, system Do Not Disturb overrides, and complex background service workers are skipped for the web MVP.
- **Workspace**: Real-time cursor syncing and global Pomodoro stats are removed to reduce MVP complexity.
