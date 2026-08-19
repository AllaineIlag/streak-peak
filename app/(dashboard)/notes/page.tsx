import { getNotes } from "@/actions/notes";
import { NotesClient } from "@/components/notes/NotesClient";
import { NotesInitializer } from "@/components/notes/NotesInitializer";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export const metadata = {
  title: "Notes | StreakPeak",
  description: "Your knowledge base and personal notes.",
};

export default async function NotesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: notes, error } = await getNotes();

  if (error) {
    return (
      <div className="p-8 text-center text-destructive">
        Error loading notes: {error}
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 h-full flex flex-col">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Notes</h2>
      </div>
      <NotesInitializer notes={notes || []} />
      <NotesClient />
    </div>
  );
}
