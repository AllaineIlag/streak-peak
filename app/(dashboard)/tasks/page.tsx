import { AddTaskForm } from "@/components/tasks/AddTaskForm";
import { TasksList } from "@/components/tasks/TasksList";

export default function TasksPage() {
  return (
    <div className="container py-8 max-w-2xl mx-auto space-y-8">
      <AddTaskForm />
      <TasksList />
    </div>
  );
}
