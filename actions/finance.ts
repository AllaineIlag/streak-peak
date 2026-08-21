"use server";

import { createClient } from "@/utils/supabase/server";
import { Database } from "@/lib/database.types";
import { revalidatePath } from "next/cache";

export type FinanceCategory = Database["public"]["Tables"]["finance_categories"]["Row"];
export type FinanceTransaction = Database["public"]["Tables"]["finance_transactions"]["Row"];

export async function getFinanceCategories() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { data: null, error: "Not authenticated" };

  const { data, error } = await supabase
    .from("finance_categories")
    .select("*")
    .order("name", { ascending: true });

  return { data, error };
}

export async function createFinanceCategory(name: string, type: "income" | "expense", monthly_budget: number = 0, color: string = "#6366f1") {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { data: null, error: "Not authenticated" };

  const { data, error } = await supabase
    .from("finance_categories")
    .insert([
      {
        user_id: user.id,
        name,
        type,
        monthly_budget,
        color
      }
    ])
    .select()
    .single();

  if (!error) revalidatePath("/finance");
  return { data, error };
}

export async function updateFinanceCategory(id: string, updates: Partial<FinanceCategory>) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("finance_categories")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (!error) revalidatePath("/finance");
  return { data, error };
}

export async function deleteFinanceCategory(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("finance_categories")
    .delete()
    .eq("id", id);

  if (!error) revalidatePath("/finance");
  return { error };
}

export async function getFinanceTransactions(monthStr?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { data: null, error: "Not authenticated" };

  let query = supabase
    .from("finance_transactions")
    .select("*")
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  if (monthStr) {
    // monthStr in format YYYY-MM
    const startDate = `${monthStr}-01`;
    // get last day of month
    const year = parseInt(monthStr.split("-")[0]);
    const month = parseInt(monthStr.split("-")[1]);
    const lastDay = new Date(year, month, 0).getDate();
    const endDate = `${monthStr}-${lastDay}`;
    
    query = query.gte("date", startDate).lte("date", endDate);
  }

  const { data, error } = await query;
  return { data, error };
}

export async function createFinanceTransaction(amount: number, date: string, type: "income" | "expense", category_id: string | null = null, description: string | null = null) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { data: null, error: "Not authenticated" };

  const { data, error } = await supabase
    .from("finance_transactions")
    .insert([
      {
        user_id: user.id,
        amount,
        date,
        type,
        category_id,
        description
      }
    ])
    .select()
    .single();

  if (!error) revalidatePath("/finance");
  return { data, error };
}

export async function updateFinanceTransaction(id: string, updates: Partial<FinanceTransaction>) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("finance_transactions")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (!error) revalidatePath("/finance");
  return { data, error };
}

export async function deleteFinanceTransaction(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("finance_transactions")
    .delete()
    .eq("id", id);

  if (!error) revalidatePath("/finance");
  return { error };
}
