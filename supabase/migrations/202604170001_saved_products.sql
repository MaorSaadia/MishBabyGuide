create extension if not exists "pgcrypto";

create table if not exists public.saved_products (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_key text not null,
  source_type text not null check (
    source_type in ('amazon_live', 'productRecommendation', 'productReview')
  ),
  title text not null,
  image text,
  amazon_url text,
  site_url text,
  asin text,
  price text,
  rating numeric,
  category text,
  features text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, product_key)
);

alter table public.saved_products enable row level security;

create policy "Users can read their own saved products"
  on public.saved_products
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert their own saved products"
  on public.saved_products
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own saved products"
  on public.saved_products
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own saved products"
  on public.saved_products
  for delete
  to authenticated
  using (auth.uid() = user_id);

create index if not exists saved_products_user_created_idx
  on public.saved_products (user_id, created_at desc);

create or replace function public.set_saved_products_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists saved_products_set_updated_at on public.saved_products;

create trigger saved_products_set_updated_at
  before update on public.saved_products
  for each row
  execute function public.set_saved_products_updated_at();
