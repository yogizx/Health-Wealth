create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  phone_number text,
  age integer,
  gender text,
  occupation text,
  push_notifications boolean default true,
  dark_mode boolean default false,
  email_updates boolean default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    email,
    full_name,
    phone_number
  )
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'user_name'),
    new.raw_user_meta_data->>'phone_number'
  )
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    phone_number = coalesce(excluded.phone_number, public.profiles.phone_number),
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create table if not exists public.finance_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entry_type text not null check (entry_type in ('income', 'expense', 'loan')),
  source text not null,
  frequency text not null,
  payment_mode text not null,
  amount numeric not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.health_assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text,
  gender text,
  age integer,
  height text,
  weight text,
  tea_coffee jsonb default '{}'::jsonb,
  breakfast text,
  breakfast_quantity numeric,
  lunch text,
  lunch_quantity numeric,
  dinner text,
  dinner_quantity numeric,
  snacks text,
  alcohol numeric,
  water_intake numeric,
  sleeping_quality_hours numeric,
  sleeping_quality_minutes numeric,
  medication text,
  headache text,
  tired_morning text,
  wake_energy text,
  body_pain text,
  physical_activity text,
  meditation text,
  others_text text,
  others_yes_no text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mindset_assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  responses boolean[] not null default '{}',
  score integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.finance_entries enable row level security;
alter table public.health_assessments enable row level security;
alter table public.mindset_assessments enable row level security;

create policy "Users can read own profile"
on public.profiles for select
using (auth.uid() = id);

create policy "Users can insert own profile"
on public.profiles for insert
with check (auth.uid() = id);

create policy "Users can update own profile"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Users can manage own finance entries"
on public.finance_entries for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can manage own health assessments"
on public.health_assessments for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can manage own mindset assessments"
on public.mindset_assessments for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create or replace function public.delete_current_user()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from auth.users
  where id = auth.uid();
end;
$$;

revoke all on function public.delete_current_user() from public;
grant execute on function public.delete_current_user() to authenticated;
