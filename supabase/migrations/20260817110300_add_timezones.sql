create table public.timezones (
    id uuid not null default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    timezone text not null,
    created_at timestamp with time zone not null default now(),
    
    constraint timezones_pkey primary key (id),
    constraint timezones_timezone_user_idx unique (user_id, timezone)
);

-- Enable RLS
alter table public.timezones enable row level security;

-- Create Policies
create policy "Users can view their own timezones" 
    on public.timezones for select 
    to authenticated 
    using (auth.uid() = user_id);

create policy "Users can insert their own timezones" 
    on public.timezones for insert 
    to authenticated 
    with check (auth.uid() = user_id);

create policy "Users can delete their own timezones" 
    on public.timezones for delete 
    to authenticated 
    using (auth.uid() = user_id);


