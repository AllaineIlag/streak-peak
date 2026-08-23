import { AddHabitForm } from "@/components/habits/AddHabitForm";
import { HabitsList } from "@/components/habits/HabitsList";

export default function HabitsPage() {
  return (
    <div className="container py-8 max-w-4xl mx-auto space-y-8">
      <AddHabitForm />
      <HabitsList />
    </div>
  );
}
