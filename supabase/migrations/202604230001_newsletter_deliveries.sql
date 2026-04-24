create extension if not exists "pgcrypto";

create table if not exists public.newsletter_deliveries (
  id uuid primary key default gen_random_uuid(),
  week_key date not null,
  recipient_email text not null,
  recipient_user_id uuid references auth.users(id) on delete set null,
  send_status text not null check (send_status in ('pending', 'sent', 'failed')),
  resend_email_id text,
  sent_at timestamptz,
  opened_at timestamptz,
  open_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (week_key, recipient_email)
);

create index if not exists newsletter_deliveries_week_key_idx
  on public.newsletter_deliveries (week_key desc);

create index if not exists newsletter_deliveries_recipient_email_idx
  on public.newsletter_deliveries (recipient_email);

alter table public.newsletter_deliveries enable row level security;

create or replace function public.set_newsletter_deliveries_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists newsletter_deliveries_set_updated_at on public.newsletter_deliveries;

create trigger newsletter_deliveries_set_updated_at
  before update on public.newsletter_deliveries
  for each row
  execute function public.set_newsletter_deliveries_updated_at();
