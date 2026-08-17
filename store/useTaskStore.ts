import { create } from "zustand";
import { Database } from "@/lib/database.types";

export type Task = Database["public"]["Tables"]["tasks"]["Row"];
export type Subtask = Database["public"]["Tables"]["subtasks"]["Row"];

interface TaskState {
  tasks: Task[];
  subtasks: Subtask[];
  isHydrated: boolean;

  setInitialData: (tasks: Task[], subtasks: Subtask[]) => void;
  
  // Optimistic UI Actions
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  
  addSubtask: (subtask: Subtask) => void;
  updateSubtask: (subtaskId: string, updates: Partial<Subtask>) => void;
  deleteSubtask: (subtaskId: string) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  subtasks: [],
  isHydrated: false,

  setInitialData: (tasks, subtasks) => set({ tasks, subtasks, isHydrated: true }),

  addTask: (task) => set((state) => ({ 
    tasks: [task, ...state.tasks] 
  })),

  updateTask: (taskId, updates) => set((state) => ({
    tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t))
  })),

  deleteTask: (taskId) => set((state) => ({
    tasks: state.tasks.filter((t) => t.id !== taskId),
    subtasks: state.subtasks.filter((s) => s.task_id !== taskId)
  })),

  addSubtask: (subtask) => set((state) => ({
    subtasks: [...state.subtasks, subtask]
  })),

  updateSubtask: (subtaskId, updates) => set((state) => ({
    subtasks: state.subtasks.map((s) => (s.id === subtaskId ? { ...s, ...updates } : s))
  })),

  deleteSubtask: (subtaskId) => set((state) => ({
    subtasks: state.subtasks.filter((s) => s.id !== subtaskId)
  })),
}));
