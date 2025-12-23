-- Create profiles table for Banadama (adds admin fields)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'buyer', -- buyer | factory | supplier | creator
  is_admin boolean not null default false,
  admin_level text not null default 'none', -- none | staff | manager | super_admin
  created_at timestamptz default now()
);

-- If the table already exists, add admin columns if missing
alter table public.profiles
  add column if not exists is_admin boolean not null default false;

alter table public.profiles
  add column if not exists admin_level text not null default 'none';

-- Enable RLS if not already
alter table public.profiles enable row level security;

-- Policy: user can select their own profile
create policy "profiles_select_own"
  on public.profiles
  for select
  using (auth.uid() = id);

-- Policy: user can update their own basic fields
create policy "profiles_update_own"
  on public.profiles
  for update
  using (auth.uid() = id);

-- Admins / staff should manage admin_level/is_admin via SQL or an internal admin UI.
