"use client";

import { useEffect, useState } from "react";
import { FinanceCategory, FinanceTransaction, getFinanceCategories, getFinanceTransactions, deleteFinanceTransaction, deleteFinanceCategory } from "@/actions/finance";
import { useFinanceStore } from "@/store/useFinanceStore";
import { format } from "date-fns";
import { Plus, ArrowUpRight, ArrowDownRight, Wallet, TrendingUp, TrendingDown, Edit2, Trash, Loader2 } from "lucide-react";
import { TransactionDialog } from "./TransactionDialog";
import { CategoryDialog } from "./CategoryDialog";
import { clsx } from "clsx";

interface FinanceClientProps {
  currentMonthStr: string;
}

export function FinanceClient({ currentMonthStr }: FinanceClientProps) {
  const { categories, transactions, isHydrated, setInitialData, removeTransaction, removeCategory } = useFinanceStore();

  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<FinanceTransaction | null>(null);

  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<FinanceCategory | null>(null);
  
  const [loading, setLoading] = useState(!isHydrated);

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      if (!isHydrated) setLoading(true);
      
      const [categoriesRes, transactionsRes] = await Promise.all([
        getFinanceCategories(),
        getFinanceTransactions(currentMonthStr)
      ]);
      
      if (isMounted) {
        if (categoriesRes.data && transactionsRes.data) {
          setInitialData(categoriesRes.data, transactionsRes.data);
        }
        setLoading(false);
      }
    }
    
    fetchData();
    
    return () => { isMounted = false; };
  }, [currentMonthStr, isHydrated, setInitialData]);

  if (loading && !isHydrated) {
    return (
      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="bg-muted h-32 rounded-xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-6 lg:col-span-1">
            <div className="bg-muted h-8 w-48 rounded" />
            <div className="bg-muted h-64 rounded-xl" />
          </div>
          <div className="space-y-6 lg:col-span-2">
            <div className="bg-muted h-8 w-48 rounded" />
            <div className="bg-muted h-64 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  // Calculate aggregates
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const netSavings = totalIncome - totalExpense;

  const handleEditTransaction = (t: FinanceTransaction) => {
    setSelectedTransaction(t);
    setIsTransactionDialogOpen(true);
  };

  const handleDeleteTransaction = async (id: string) => {
    if (confirm("Delete this transaction?")) {
      removeTransaction(id);
      await deleteFinanceTransaction(id);
    }
  };

  const handleEditCategory = (c: FinanceCategory) => {
    setSelectedCategory(c);
    setIsCategoryDialogOpen(true);
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm("Delete this category? Transactions using this category will lose it.")) {
      removeCategory(id);
      await deleteFinanceCategory(id);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 text-muted-foreground mb-2">
            <ArrowUpRight className="w-5 h-5 text-emerald-500" />
            <h3 className="font-medium">Income</h3>
          </div>
          <p className="text-3xl font-bold">${totalIncome.toFixed(2)}</p>
        </div>
        
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 text-muted-foreground mb-2">
            <ArrowDownRight className="w-5 h-5 text-rose-500" />
            <h3 className="font-medium">Expenses</h3>
          </div>
          <p className="text-3xl font-bold">${totalExpense.toFixed(2)}</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-3 text-muted-foreground mb-2 relative z-10">
            <Wallet className="w-5 h-5" />
            <h3 className="font-medium">Net Savings</h3>
          </div>
          <p className={clsx("text-3xl font-bold relative z-10", netSavings >= 0 ? "text-emerald-500" : "text-rose-500")}>
            ${Math.abs(netSavings).toFixed(2)}
          </p>
          {/* Decorative background */}
          <div className={clsx("absolute -bottom-6 -right-6 w-32 h-32 rounded-full blur-3xl opacity-20", netSavings >= 0 ? "bg-emerald-500" : "bg-rose-500")} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Budgets */}
        <div className="space-y-6 lg:col-span-1">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Budgets & Categories</h2>
            <button 
              onClick={() => { setSelectedCategory(null); setIsCategoryDialogOpen(true); }}
              className="p-2 hover:bg-muted rounded-md text-muted-foreground transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {categories.filter(c => c.type === 'expense').map(category => {
              const spent = transactions.filter(t => t.category_id === category.id && t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
              const budget = category.monthly_budget || 0;
              const percent = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
              const isOver = budget > 0 && spent > budget;

              return (
                <div key={category.id} className="bg-card border border-border rounded-xl p-4 group">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      <button onClick={() => handleEditCategory(category)} className="p-1 hover:bg-muted rounded"><Edit2 className="w-3.5 h-3.5 text-muted-foreground" /></button>
                      <button onClick={() => handleDeleteCategory(category.id)} className="p-1 hover:bg-destructive/10 rounded"><Trash className="w-3.5 h-3.5 text-destructive" /></button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm mb-2 text-muted-foreground">
                    <span>${spent.toFixed(2)} spent</span>
                    {budget > 0 && <span>${budget.toFixed(2)} budget</span>}
                  </div>
                  
                  {budget > 0 && (
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={clsx("h-full transition-all duration-500", isOver ? "bg-rose-500" : "")}
                        style={{ width: `${percent}%`, backgroundColor: !isOver ? category.color : undefined }}
                      />
                    </div>
                  )}
                </div>
              );
            })}

            {categories.filter(c => c.type === 'income').length > 0 && (
              <div className="pt-4 border-t border-border">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Income Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.filter(c => c.type === 'income').map(category => (
                    <div key={category.id} className="inline-flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full text-sm group">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: category.color }} />
                      {category.name}
                      <button onClick={() => handleEditCategory(category)} className="ml-1 opacity-0 group-hover:opacity-100 hover:text-foreground text-muted-foreground"><Edit2 className="w-3 h-3" /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {categories.length === 0 && (
              <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-xl border border-dashed border-border">
                <p>No categories yet.</p>
                <button onClick={() => { setSelectedCategory(null); setIsCategoryDialogOpen(true); }} className="text-sm text-primary hover:underline mt-2">Create one</button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Transactions */}
        <div className="space-y-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Recent Transactions</h2>
            <button 
              onClick={() => { setSelectedTransaction(null); setIsTransactionDialogOpen(true); }}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Transaction</span>
            </button>
          </div>

          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            {transactions.length > 0 ? (
              <div className="divide-y divide-border">
                {transactions.map(transaction => {
                  const category = categories.find(c => c.id === transaction.category_id);
                  const isIncome = transaction.type === 'income';

                  return (
                    <div key={transaction.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className={clsx("w-10 h-10 rounded-full flex items-center justify-center", isIncome ? "bg-emerald-500/10" : "bg-rose-500/10")}>
                          {isIncome ? <TrendingUp className="w-5 h-5 text-emerald-500" /> : <TrendingDown className="w-5 h-5 text-rose-500" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{transaction.description || 'Untitled'}</p>
                            {category && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full border" style={{ borderColor: category.color, color: category.color, backgroundColor: `${category.color}10` }}>
                                {category.name}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{format(new Date(transaction.date), 'MMM d, yyyy')}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <span className={clsx("font-medium", isIncome ? "text-emerald-500" : "")}>
                          {isIncome ? '+' : '-'}${transaction.amount.toFixed(2)}
                        </span>
                        
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEditTransaction(transaction)} className="p-1.5 hover:bg-muted rounded"><Edit2 className="w-4 h-4 text-muted-foreground" /></button>
                          <button onClick={() => handleDeleteTransaction(transaction.id)} className="p-1.5 hover:bg-destructive/10 rounded"><Trash className="w-4 h-4 text-destructive" /></button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
                <Wallet className="w-12 h-12 mb-4 opacity-20" />
                <p>No transactions found for this month.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      <TransactionDialog 
        open={isTransactionDialogOpen} 
        onOpenChange={setIsTransactionDialogOpen}
        transaction={selectedTransaction}
        categories={categories}
      />
      
      <CategoryDialog
        open={isCategoryDialogOpen}
        onOpenChange={setIsCategoryDialogOpen}
        category={selectedCategory}
      />
    </div>
  );
}
