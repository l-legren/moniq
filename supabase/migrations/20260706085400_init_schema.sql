-- Phase 7 (LEG-48): profiles, expenses, recurring tables + RLS.
-- Mirrors src/data/*.data.ts row shapes so the mappers barely change when this layer swaps in.

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  email text,
  savings_goal int not null default 0,
  theme text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() is not null and auth.uid() = id);
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() is not null and auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() is not null and auth.uid() = id);
create policy "profiles_delete_own" on public.profiles
  for delete using (auth.uid() is not null and auth.uid() = id);

-- Auto-create a profile row on sign-up.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  category text not null,
  amount numeric not null,
  spent_on date not null,
  spent_at timestamptz not null default now(),
  note text,
  created_at timestamptz not null default now()
);

create index expenses_user_id_spent_on_idx on public.expenses (user_id, spent_on);

alter table public.expenses enable row level security;

create policy "expenses_select_own" on public.expenses
  for select using (auth.uid() is not null and auth.uid() = user_id);
create policy "expenses_insert_own" on public.expenses
  for insert with check (auth.uid() is not null and auth.uid() = user_id);
create policy "expenses_update_own" on public.expenses
  for update using (auth.uid() is not null and auth.uid() = user_id);
create policy "expenses_delete_own" on public.expenses
  for delete using (auth.uid() is not null and auth.uid() = user_id);

create table public.recurring (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  type text not null check (type in ('income', 'expense')),
  name text not null,
  amount numeric not null,
  cadence text not null check (cadence in ('monthly', 'yearly')),
  term_kind text not null check (term_kind in ('perpetual', 'term')),
  end_date date,
  category text,
  created_at timestamptz not null default now(),
  constraint recurring_end_date_requires_term check (
    (term_kind = 'term' and end_date is not null) or
    (term_kind = 'perpetual' and end_date is null)
  )
);

create index recurring_user_id_idx on public.recurring (user_id);

alter table public.recurring enable row level security;

create policy "recurring_select_own" on public.recurring
  for select using (auth.uid() is not null and auth.uid() = user_id);
create policy "recurring_insert_own" on public.recurring
  for insert with check (auth.uid() is not null and auth.uid() = user_id);
create policy "recurring_update_own" on public.recurring
  for update using (auth.uid() is not null and auth.uid() = user_id);
create policy "recurring_delete_own" on public.recurring
  for delete using (auth.uid() is not null and auth.uid() = user_id);

-- RLS policies only govern which rows are visible; the `authenticated` role also needs the base
-- table grants below, or every query fails with "permission denied for table" regardless of RLS.
grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.expenses to authenticated;
grant select, insert, update, delete on public.recurring to authenticated;
