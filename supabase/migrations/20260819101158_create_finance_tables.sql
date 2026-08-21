-- Create finance_categories table
CREATE TABLE public.finance_categories (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name text NOT NULL,
    type text NOT NULL CHECK (type IN ('income', 'expense')),
    monthly_budget numeric DEFAULT 0,
    color text NOT NULL DEFAULT '#6366f1',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for finance_categories
ALTER TABLE public.finance_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own finance_categories"
    ON public.finance_categories FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own finance_categories"
    ON public.finance_categories FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own finance_categories"
    ON public.finance_categories FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own finance_categories"
    ON public.finance_categories FOR DELETE
    USING (auth.uid() = user_id);

-- Create finance_transactions table
CREATE TABLE public.finance_transactions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    category_id uuid REFERENCES public.finance_categories(id) ON DELETE SET NULL,
    amount numeric NOT NULL,
    date date NOT NULL,
    description text,
    type text NOT NULL CHECK (type IN ('income', 'expense')),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for finance_transactions
ALTER TABLE public.finance_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own finance_transactions"
    ON public.finance_transactions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own finance_transactions"
    ON public.finance_transactions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own finance_transactions"
    ON public.finance_transactions FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own finance_transactions"
    ON public.finance_transactions FOR DELETE
    USING (auth.uid() = user_id);

-- Create triggers to update 'updated_at' column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_finance_categories_modtime
    BEFORE UPDATE ON public.finance_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_finance_transactions_modtime
    BEFORE UPDATE ON public.finance_transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
