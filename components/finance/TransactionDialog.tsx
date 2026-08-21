"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { FinanceTransaction, FinanceCategory, createFinanceTransaction, updateFinanceTransaction } from "@/actions/finance";
import { useFinanceStore } from "@/store/useFinanceStore";
import { format } from "date-fns";

interface TransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: FinanceTransaction | null;
  categories: FinanceCategory[];
}

export function TransactionDialog({ open, onOpenChange, transaction, categories }: TransactionDialogProps) {
  const { addTransaction, updateTransaction } = useFinanceStore();
  
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      if (transaction) {
        setType(transaction.type);
        setAmount(transaction.amount.toString());
        setDescription(transaction.description || "");
        setCategoryId(transaction.category_id || "");
        setDate(transaction.date);
      } else {
        setType("expense");
        setAmount("");
        setDescription("");
        setCategoryId("");
        setDate(format(new Date(), "yyyy-MM-dd"));
      }
    }
  }, [open, transaction]);

  // When type changes, clear category if it doesn't match the new type
  useEffect(() => {
    if (categoryId) {
      const cat = categories.find(c => c.id === categoryId);
      if (cat && cat.type !== type) {
        setCategoryId("");
      }
    }
  }, [type, categories, categoryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) return;

    setLoading(true);

    if (transaction) {
      // Optimistic update
      updateTransaction(transaction.id, { 
        amount: amountNum, 
        description, 
        category_id: categoryId || null,
        date,
        type
      });
      onOpenChange(false);
      
      await updateFinanceTransaction(transaction.id, { 
        amount: amountNum, 
        description, 
        category_id: categoryId || null,
        date,
        type
      });
    } else {
      // Optimistic add
      const tempId = `temp-${Date.now()}`;
      addTransaction({
        id: tempId,
        user_id: "",
        amount: amountNum,
        description,
        category_id: categoryId || null,
        date,
        type,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      onOpenChange(false);
      
      const res = await createFinanceTransaction(
        amountNum,
        date,
        type,
        categoryId || null,
        description || null
      );
      
      if (res.data) {
        useFinanceStore.setState(state => ({
          transactions: state.transactions.map(t => t.id === tempId ? (res.data as FinanceTransaction) : t)
        }));
      }
    }
    
    setLoading(false);
  };

  const filteredCategories = categories.filter(c => c.type === type);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {transaction ? "Edit Transaction" : "New Transaction"}
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
            <label className="text-sm font-medium">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-muted-foreground">$</span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-background border border-border rounded-md pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-lg font-medium"
                required
                autoFocus
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What was this for?"
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">No Category</option>
              {filteredCategories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              required
            />
          </div>

          <DialogFooter className="pt-4 flex justify-end gap-3 sm:justify-end">
            <DialogClose render={<button type="button" className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-md transition-colors">Cancel</button>} />
            <button
              type="submit"
              disabled={!amount || loading}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              Save Transaction
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
