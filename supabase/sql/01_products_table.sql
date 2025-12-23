-- Create products table
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  price_usd numeric(10,2) not null,
  weight_kg numeric(10,3) not null,
  volume_cbm numeric(10,4),
  is_b2c boolean not null default true,
  is_b2b boolean not null default false,
  created_at timestamptz default now()
);

alter table public.products enable row level security;

create policy "products_public_read"
  on public.products
  for select
  using (true);
