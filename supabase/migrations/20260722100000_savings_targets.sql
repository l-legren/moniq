-- LEG-58: savings_targets table + RLS. Multiple, concurrent, goal-based savings targets
-- (e.g. "New laptop", "Japan trip"), distinct from the single monthly savings_goal on profiles.

create table public.savings_targets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null,
  category text not null,
  goal_amount numeric not null,
  saved_amount numeric not null default 0,
  target_date date not null,
  priority text not null check (priority in ('low', 'medium', 'high')),
  ai_verdict text not null,
  status text not null default 'active' check (status in ('active', 'achieved', 'abandoned')),
  created_at timestamptz not null default now()
);

create index savings_targets_user_id_idx on public.savings_targets (user_id);

alter table public.savings_targets enable row level security;

create policy "savings_targets_select_own" on public.savings_targets
  for select using (auth.uid() is not null and auth.uid() = user_id);
create policy "savings_targets_insert_own" on public.savings_targets
  for insert with check (auth.uid() is not null and auth.uid() = user_id);
create policy "savings_targets_update_own" on public.savings_targets
  for update using (auth.uid() is not null and auth.uid() = user_id);
create policy "savings_targets_delete_own" on public.savings_targets
  for delete using (auth.uid() is not null and auth.uid() = user_id);

-- RLS policies only govern which rows are visible; the `authenticated` role also needs the base
-- table grant below, or every query fails with "permission denied for table" regardless of RLS.
grant select, insert, update, delete on public.savings_targets to authenticated;
