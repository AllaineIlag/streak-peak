-- Drop old policies that depend on workspace_id
drop policy if exists "Users can view their own or workspace notes" on public.notes;
drop policy if exists "Users can insert notes" on public.notes;
drop policy if exists "Users can update notes" on public.notes;
drop policy if exists "Users can delete notes" on public.notes;

-- Drop old constraints and columns
alter table public.notes drop constraint if exists notes_owner_check;
alter table public.notes drop column if exists workspace_id;

-- Ensure user_id is not null now that workspaces are gone
alter table public.notes alter column user_id set not null;

-- Add tags column
alter table public.notes add column if not exists tags text[] not null default '{}'::text[];

-- Alter content to jsonb
alter table public.notes alter column content type jsonb using content::jsonb;

-- Default title if null
alter table public.notes alter column title set default 'Untitled Note'::text;

-- Update RLS policies
drop policy if exists "Users can view their own or workspace notes" on public.notes;
drop policy if exists "Users can insert notes" on public.notes;
drop policy if exists "Users can update notes" on public.notes;
drop policy if exists "Users can delete notes" on public.notes;

create policy "Users can view their own notes."
  on public.notes for select
  using (auth.uid() = user_id);

create policy "Users can insert their own notes."
  on public.notes for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own notes."
  on public.notes for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own notes."
  on public.notes for delete
  using (auth.uid() = user_id);
