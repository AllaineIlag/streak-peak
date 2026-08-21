import { getFinanceCategories, getFinanceTransactions } from "@/actions/finance";
import { FinanceClient } from "@/components/finance/FinanceClient";

export const metadata = {
  title: "Finance Tracker - StreakPeak",
};

export default async function FinancePage() {
  // Fetch current month's transactions by default
  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  
  const [categoriesRes, transactionsRes] = await Promise.all([
    getFinanceCategories(),
    getFinanceTransactions(currentMonthStr)
  ]);

  if (categoriesRes.error) {
    console.error("Error fetching finance categories:", categoriesRes.error);
  }

  if (transactionsRes.error) {
    console.error("Error fetching finance transactions:", transactionsRes.error);
  }

  return (
    <div className="h-[calc(100vh-theme(spacing.16))] sm:h-screen flex flex-col overflow-hidden bg-background">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/50">
        <h1 className="text-2xl font-bold tracking-tight">Finance</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        <FinanceClient 
          initialCategories={categoriesRes.data || []}
          initialTransactions={transactionsRes.data || []}
          currentMonthStr={currentMonthStr}
        />
      </div>
    </div>
  );
}
