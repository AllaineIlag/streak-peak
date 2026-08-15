-- streak-peak initial schema

create extension if not exists "uuid-ossp";

-- TASKS
create table public.tasks (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references auth.users(id) on delete cascade,
    title text not null,
    description text,
    status text not null default 'active',
    due_date date,
    priority text,
    labels text[],
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table public.tasks enable row level security;

create policy "Users can view their own tasks" on public.tasks
    for select to authenticated using (auth.uid() = user_id);

create policy "Users can insert their own tasks" on public.tasks
    for insert to authenticated with check (auth.uid() = user_id);

create policy "Users can update their own tasks" on public.tasks
    for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can delete their own tasks" on public.tasks
    for delete to authenticated using (auth.uid() = user_id);

-- SUBTASKS
create table public.subtasks (
    id uuid primary key default uuid_generate_v4(),
    task_id uuid not null references public.tasks(id) on delete cascade,
    title text not null,
    is_completed boolean not null default false,
    created_at timestamptz not null default now()
);

alter table public.subtasks enable row level security;

create policy "Users can view subtasks of their tasks" on public.subtasks
    for select to authenticated
    using (task_id in (select id from public.tasks where user_id = auth.uid()));

create policy "Users can insert subtasks to their tasks" on public.subtasks
    for insert to authenticated
    with check (task_id in (select id from public.tasks where user_id = auth.uid()));

create policy "Users can update subtasks of their tasks" on public.subtasks
    for update to authenticated
    using (task_id in (select id from public.tasks where user_id = auth.uid()))
    with check (task_id in (select id from public.tasks where user_id = auth.uid()));

create policy "Users can delete subtasks of their tasks" on public.subtasks
    for delete to authenticated
    using (task_id in (select id from public.tasks where user_id = auth.uid()));

-- HABITS
create table public.habits (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references auth.users(id) on delete cascade,
    title text not null,
    emoji text,
    frequency text,
    created_at timestamptz not null default now()
);

alter table public.habits enable row level security;

create policy "Users can view their own habits" on public.habits
    for select to authenticated using (auth.uid() = user_id);

create policy "Users can insert their own habits" on public.habits
    for insert to authenticated with check (auth.uid() = user_id);

create policy "Users can update their own habits" on public.habits
    for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can delete their own habits" on public.habits
    for delete to authenticated using (auth.uid() = user_id);

-- HABIT CHECK-INS
create table public.habit_checkins (
    id uuid primary key default uuid_generate_v4(),
    habit_id uuid not null references public.habits(id) on delete cascade,
    date date not null,
    status text not null,
    created_at timestamptz not null default now(),
    unique(habit_id, date)
);

alter table public.habit_checkins enable row level security;

create policy "Users can view checkins of their habits" on public.habit_checkins
    for select to authenticated
    using (habit_id in (select id from public.habits where user_id = auth.uid()));

create policy "Users can insert checkins to their habits" on public.habit_checkins
    for insert to authenticated
    with check (habit_id in (select id from public.habits where user_id = auth.uid()));

create policy "Users can update checkins of their habits" on public.habit_checkins
    for update to authenticated
    using (habit_id in (select id from public.habits where user_id = auth.uid()))
    with check (habit_id in (select id from public.habits where user_id = auth.uid()));

create policy "Users can delete checkins of their habits" on public.habit_checkins
    for delete to authenticated
    using (habit_id in (select id from public.habits where user_id = auth.uid()));

-- POMODORO SESSIONS
create table public.focus_sessions (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references auth.users(id) on delete cascade,
    duration_minutes integer not null,
    started_at timestamptz not null,
    ended_at timestamptz,
    status text not null default 'completed'
);

alter table public.focus_sessions enable row level security;

create policy "Users can view their own focus sessions" on public.focus_sessions
    for select to authenticated using (auth.uid() = user_id);

create policy "Users can insert their own focus sessions" on public.focus_sessions
    for insert to authenticated with check (auth.uid() = user_id);

create policy "Users can update their own focus sessions" on public.focus_sessions
    for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can delete their own focus sessions" on public.focus_sessions
    for delete to authenticated using (auth.uid() = user_id);

-- CALENDAR EVENTS
create table public.events (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references auth.users(id) on delete cascade,
    title text not null,
    description text,
    start_time timestamptz not null,
    end_time timestamptz not null,
    created_at timestamptz not null default now()
);

alter table public.events enable row level security;

create policy "Users can view their own events" on public.events
    for select to authenticated using (auth.uid() = user_id);

create policy "Users can insert their own events" on public.events
    for insert to authenticated with check (auth.uid() = user_id);

create policy "Users can update their own events" on public.events
    for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can delete their own events" on public.events
    for delete to authenticated using (auth.uid() = user_id);

-- WORKSPACES
create table public.workspaces (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    owner_id uuid not null references auth.users(id) on delete cascade,
    created_at timestamptz not null default now()
);

alter table public.workspaces enable row level security;

create policy "Workspace owners can view workspaces" on public.workspaces
    for select to authenticated using (auth.uid() = owner_id);
    
create policy "Users can insert workspaces" on public.workspaces
    for insert to authenticated with check (auth.uid() = owner_id);

create policy "Owners can update workspaces" on public.workspaces
    for update to authenticated using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create policy "Owners can delete workspaces" on public.workspaces
    for delete to authenticated using (auth.uid() = owner_id);

-- WORKSPACE MEMBERS
create table public.workspace_members (
    id uuid primary key default uuid_generate_v4(),
    workspace_id uuid not null references public.workspaces(id) on delete cascade,
    user_id uuid not null references auth.users(id) on delete cascade,
    role text not null default 'member',
    created_at timestamptz not null default now(),
    unique(workspace_id, user_id)
);

alter table public.workspace_members enable row level security;

create policy "Members can view members" on public.workspace_members
    for select to authenticated
    using (user_id = auth.uid() OR workspace_id in (select id from public.workspaces where owner_id = auth.uid()));

create policy "Owners can insert members" on public.workspace_members
    for insert to authenticated
    with check (workspace_id in (select id from public.workspaces where owner_id = auth.uid()));

create policy "Owners can update members" on public.workspace_members
    for update to authenticated
    using (workspace_id in (select id from public.workspaces where owner_id = auth.uid()))
    with check (workspace_id in (select id from public.workspaces where owner_id = auth.uid()));

create policy "Owners can delete members" on public.workspace_members
    for delete to authenticated
    using (workspace_id in (select id from public.workspaces where owner_id = auth.uid()));

-- Update Workspaces SELECT policy so members can see workspaces they are a part of
create policy "Members can view workspaces" on public.workspaces
    for select to authenticated
    using (id in (select workspace_id from public.workspace_members where user_id = auth.uid()));

-- NOTES
create table public.notes (
    id uuid primary key default uuid_generate_v4(),
    workspace_id uuid references public.workspaces(id) on delete cascade,
    user_id uuid references auth.users(id) on delete cascade,
    title text not null,
    content text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint notes_owner_check check (workspace_id is not null or user_id is not null)
);

alter table public.notes enable row level security;

create policy "Users can view their own or workspace notes" on public.notes
    for select to authenticated
    using (user_id = auth.uid() OR workspace_id in (select workspace_id from public.workspace_members where user_id = auth.uid()) OR workspace_id in (select id from public.workspaces where owner_id = auth.uid()));

create policy "Users can insert notes" on public.notes
    for insert to authenticated
    with check (user_id = auth.uid() OR workspace_id in (select workspace_id from public.workspace_members where user_id = auth.uid()) OR workspace_id in (select id from public.workspaces where owner_id = auth.uid()));

create policy "Users can update notes" on public.notes
    for update to authenticated
    using (user_id = auth.uid() OR workspace_id in (select workspace_id from public.workspace_members where user_id = auth.uid()) OR workspace_id in (select id from public.workspaces where owner_id = auth.uid()))
    with check (user_id = auth.uid() OR workspace_id in (select workspace_id from public.workspace_members where user_id = auth.uid()) OR workspace_id in (select id from public.workspaces where owner_id = auth.uid()));

create policy "Users can delete notes" on public.notes
    for delete to authenticated
    using (user_id = auth.uid() OR workspace_id in (select workspace_id from public.workspace_members where user_id = auth.uid()) OR workspace_id in (select id from public.workspaces where owner_id = auth.uid()));

-- MOOD LOGS
create table public.mood_logs (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references auth.users(id) on delete cascade,
    date date not null,
    rating integer not null check (rating >= 1 and rating <= 5),
    note text,
    created_at timestamptz not null default now(),
    unique(user_id, date)
);

alter table public.mood_logs enable row level security;

create policy "Users can view their own mood logs" on public.mood_logs
    for select to authenticated using (auth.uid() = user_id);

create policy "Users can insert their own mood logs" on public.mood_logs
    for insert to authenticated with check (auth.uid() = user_id);

create policy "Users can update their own mood logs" on public.mood_logs
    for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can delete their own mood logs" on public.mood_logs
    for delete to authenticated using (auth.uid() = user_id);

-- FINANCE BUDGETS
create table public.finance_budgets (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references auth.users(id) on delete cascade,
    month date not null,
    amount numeric not null default 0,
    created_at timestamptz not null default now(),
    unique(user_id, month)
);

alter table public.finance_budgets enable row level security;

create policy "Users can view their own finance budgets" on public.finance_budgets
    for select to authenticated using (auth.uid() = user_id);

create policy "Users can insert their own finance budgets" on public.finance_budgets
    for insert to authenticated with check (auth.uid() = user_id);

create policy "Users can update their own finance budgets" on public.finance_budgets
    for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can delete their own finance budgets" on public.finance_budgets
    for delete to authenticated using (auth.uid() = user_id);