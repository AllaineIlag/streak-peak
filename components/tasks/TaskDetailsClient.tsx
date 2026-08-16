"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Database } from "@/lib/database.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateTaskDetails, deleteTask } from "@/actions/tasks";
import { ArrowLeft, Trash2, Save } from "lucide-react";
import Link from "next/link";

type Task = Database["public"]["Tables"]["tasks"]["Row"];

export function TaskDetailsClient({ task }: { task: Task }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [priority, setPriority] = useState(task.priority || "none");
  const [dueDate, setDueDate] = useState(task.due_date || "");
  const [labelsStr, setLabelsStr] = useState((task.labels || []).join(", "));

  const handleSave = () => {
    startTransition(async () => {
      const labelsArray = labelsStr
        .split(",")
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

      await updateTaskDetails(task.id, {
        title,
        description: description || null,
        priority: priority === "none" ? null : priority,
        due_date: dueDate || null,
        labels: labelsArray.length > 0 ? labelsArray : null,
      });
      router.push("/tasks");
    });
  };

  const handleDelete = () => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    startTransition(async () => {
      await deleteTask(task.id);
      router.push("/tasks");
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <Link
          href="/tasks"
          className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to tasks
        </Link>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={isPending}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>

      <div className="space-y-6 bg-card p-6 rounded-lg border shadow-sm">
        <div className="space-y-2">
          <label className="text-sm font-medium">Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-medium"
            disabled={isPending}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Description</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add some details..."
            className="min-h-[120px]"
            disabled={isPending}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Priority</label>
            <Select
              value={priority}
              onValueChange={(val) => setPriority(val || "none")}
              disabled={isPending}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Due Date</label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              disabled={isPending}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Labels (comma-separated)</label>
          <Input
            value={labelsStr}
            onChange={(e) => setLabelsStr(e.target.value)}
            placeholder="e.g. work, personal, urgent"
            disabled={isPending}
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => router.push("/tasks")} disabled={isPending}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={!title.trim() || isPending}>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
