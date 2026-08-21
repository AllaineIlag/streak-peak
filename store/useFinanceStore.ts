import { create } from "zustand";
import { FinanceCategory, FinanceTransaction } from "@/actions/finance";

interface FinanceState {
  categories: FinanceCategory[];
  transactions: FinanceTransaction[];
  isHydrated: boolean;
  setInitialData: (categories: FinanceCategory[], transactions: FinanceTransaction[]) => void;
  
  // Category Actions
  addCategory: (category: FinanceCategory) => void;
  updateCategory: (id: string, updates: Partial<FinanceCategory>) => void;
  removeCategory: (id: string) => void;
  
  // Transaction Actions
  addTransaction: (transaction: FinanceTransaction) => void;
  updateTransaction: (id: string, updates: Partial<FinanceTransaction>) => void;
  removeTransaction: (id: string) => void;
}

export const useFinanceStore = create<FinanceState>((set) => ({
  categories: [],
  transactions: [],
  isHydrated: false,
  
  setInitialData: (categories, transactions) => set({ categories, transactions, isHydrated: true }),
  
  addCategory: (category) => set((state) => ({
    categories: [...state.categories, category].sort((a, b) => a.name.localeCompare(b.name))
  })),
  
  updateCategory: (id, updates) => set((state) => ({
    categories: state.categories.map((c) => 
      c.id === id ? { ...c, ...updates, updated_at: new Date().toISOString() } : c
    )
  })),
  
  removeCategory: (id) => set((state) => ({
    categories: state.categories.filter((c) => c.id !== id),
    // Nullify category in existing transactions
    transactions: state.transactions.map(t => 
      t.category_id === id ? { ...t, category_id: null } : t
    )
  })),
  
  addTransaction: (transaction) => set((state) => ({
    transactions: [transaction, ...state.transactions].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime() || 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  })),
  
  updateTransaction: (id, updates) => set((state) => ({
    transactions: state.transactions.map((t) =>
      t.id === id ? { ...t, ...updates, updated_at: new Date().toISOString() } : t
    ).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime() || 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  })),
  
  removeTransaction: (id) => set((state) => ({
    transactions: state.transactions.filter((t) => t.id !== id)
  }))
}));
