"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { FinanceCategory, createFinanceCategory, updateFinanceCategory } from "@/actions/finance";
import { useFinanceStore } from "@/store/useFinanceStore";

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: FinanceCategory | null;
}

const COLORS = [
  "#6366f1", // Indigo
  "#ec4899", // Pink
  "#f43f5e", // Rose
  "#f97316", // Orange
  "#eab308", // Yellow
  "#22c55e", // Green
  "#14b8a6", // Teal
  "#0ea5e9", // Sky
  "#8b5cf6", // Violet
  "#64748b", // Slate
];

export function CategoryDialog({ open, onOpenChange, category }: CategoryDialogProps) {
  const { addCategory, updateCategory } = useFinanceStore();
  
  const [name, setName] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [budget, setBudget] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      if (category) {
        setName(category.name);
        setType(category.type);
        setBudget(category.monthly_budget.toString() || "");
        setColor(category.color);
      } else {
        setName("");
        setType("expense");
        setBudget("");
        setColor(COLORS[0]);
      }
    }
  }, [open, category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    const budgetNum = parseFloat(budget) || 0;

    if (category) {
      // Optimistic update
      updateCategory(category.id, { name, type, monthly_budget: budgetNum, color });
      onOpenChange(false);
      
      await updateFinanceCategory(category.id, { name, type, monthly_budget: budgetNum, color });
    } else {
      // Optimistic add (requires temp ID)
      const tempId = `temp-${Date.now()}`;
      addCategory({
        id: tempId,
        user_id: "",
        name,
        type,
        monthly_budget: budgetNum,
        color,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      onOpenChange(false);
      
      const res = await createFinanceCategory(name, type, budgetNum, color);
      if (res.data) {
        // Swap temp ID with real one
        useFinanceStore.setState(state => ({
          categories: state.categories.map(c => c.id === tempId ? (res.data as FinanceCategory) : c)
        }));
      }
    }
    
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {category ? "Edit Category" : "New Category"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-lg">
            <button
              type="button"
              onClick={() => setType("expense")}
              className={`py-1.5 text-sm font-medium rounded-md transition-colors ${type === "expense" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setType("income")}
              className={`py-1.5 text-sm font-medium rounded-md transition-colors ${type === "income" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
            >
              Income
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Category Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Groceries, Salary"
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              required
              autoFocus
            />
          </div>

          {type === "expense" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Monthly Budget (Optional)</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-muted-foreground">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-background border border-border rounded-md pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Color</label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform ${color === c ? "scale-110 border-foreground" : "border-transparent hover:scale-105"}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <DialogFooter className="pt-4 flex justify-end gap-3 sm:justify-end">
            <DialogClose render={<button type="button" className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-md transition-colors">Cancel</button>} />
            <button
              type="submit"
              disabled={!name.trim() || loading}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              Save Category
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
