-- Create shipments table for Banadama
create table if not exists public.shipments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid,
  order_number text,
  stage text,
  carrier text,
  tracking_number text,
  eta date,
  metadata jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS (we'll add a permissive select policy for initial testing)
alter table public.shipments enable row level security;

-- Allow public (anon) to read shipments for testing only. Remove or tighten this in production.
create policy "shipments_select_public"
  on public.shipments
  for select
  using (true);

-- Prevent public inserts/updates by default (no policies created for insert/update)

-- Add a trigger to update `updated_at` on row modification
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_updated_at on public.shipments;
create trigger set_updated_at
  before update on public.shipments
  for each row execute function public.set_updated_at();

-- NOTE: Run this file in your Supabase SQL editor (Project → SQL) to create the table.
-- After running, remove or update the "shipments_select_public" policy to enforce proper access.
