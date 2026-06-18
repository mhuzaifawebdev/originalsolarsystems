-- ============================================================
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. Brands table
create table public.brands (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  logo_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Products table (hardened)
create table public.products (
  id uuid default gen_random_uuid() primary key,
  verification_token uuid default gen_random_uuid() not null unique,
  serial_number text not null unique,
  brand_id uuid references public.brands(id) on delete restrict,
  product_name text not null,
  sales_destination text not null,
  importer_name text not null,
  level text not null,
  wattage text not null,
  result text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_by uuid references auth.users(id)
);

create index idx_products_token on public.products(verification_token);
create index idx_products_serial on public.products(serial_number);

-- 3. Verification logs (scan tracking)
create table public.verification_logs (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references public.products(id) on delete cascade,
  scanned_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_agent text
);

-- ============================================================
-- RLS Policies
-- ============================================================

alter table public.brands enable row level security;
alter table public.products enable row level security;
alter table public.verification_logs enable row level security;

-- Brands: public read, authenticated write
create policy "brands_public_read" on public.brands for select using (true);
create policy "brands_auth_insert" on public.brands for insert with check (auth.role() = 'authenticated');
create policy "brands_auth_update" on public.brands for update using (auth.role() = 'authenticated');
create policy "brands_auth_delete" on public.brands for delete using (auth.role() = 'authenticated');

-- Products: public read, authenticated write
create policy "products_public_read" on public.products for select using (true);
create policy "products_auth_insert" on public.products for insert with check (auth.role() = 'authenticated');
create policy "products_auth_update" on public.products for update using (auth.role() = 'authenticated');

-- Verification logs: public insert (anonymous scans), authenticated read
create policy "logs_public_insert" on public.verification_logs for insert with check (true);
create policy "logs_auth_read" on public.verification_logs for select using (auth.role() = 'authenticated');

-- ============================================================
-- Storage: Create 'brand-logos' bucket (public)
-- ============================================================
-- In Supabase dashboard: Storage > New Bucket > name: brand-logos > Public: ON
-- Or via SQL:
insert into storage.buckets (id, name, public) values ('brand-logos', 'brand-logos', true)
  on conflict (id) do nothing;

create policy "brand_logos_public_read" on storage.objects
  for select using (bucket_id = 'brand-logos');

create policy "brand_logos_auth_upload" on storage.objects
  for insert with check (bucket_id = 'brand-logos' and auth.role() = 'authenticated');
