-- WoKiToKi landing: lead storage.
-- Run once in the Supabase dashboard (SQL Editor). Safe to re-run.
--
-- Access model:
--   * anon (the publishable key in the browser) may only INSERT into leads.
--     It cannot read, update or delete leads.
--   * anon may only SELECT the single-row keepalive table, which the GitHub
--     Action queries every few days so the free project is not paused.

-- Leads ---------------------------------------------------------------

create table if not exists public.leads (
  id         bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  nombre     text not null check (char_length(nombre) between 1 and 120),
  email      text check (email is null or (char_length(email) <= 254 and email ~ '^[^\s@]+@[^\s@]+\.[^\s@]{2,}$')),
  whatsapp   text check (whatsapp is null or char_length(whatsapp) <= 30),
  para       text not null check (para in ('3', '4', '5', '6', '7', 'mayor')),
  ciudad     text check (ciudad is null or char_length(ciudad) <= 120),
  piloto     boolean not null default false,
  constraint leads_contact_required check (email is not null or whatsapp is not null)
);

alter table public.leads enable row level security;

revoke all on table public.leads from anon, authenticated;
grant insert (nombre, email, whatsapp, para, ciudad, piloto) on table public.leads to anon;

drop policy if exists "anon can insert leads" on public.leads;
create policy "anon can insert leads"
  on public.leads
  for insert
  to anon
  with check (true); -- row shape is enforced by the column checks above

-- Keepalive -----------------------------------------------------------

create table if not exists public.keepalive (
  id int primary key check (id = 1)
);
insert into public.keepalive (id) values (1) on conflict do nothing;

alter table public.keepalive enable row level security;

revoke all on table public.keepalive from anon, authenticated;
grant select on table public.keepalive to anon;

drop policy if exists "anon can read keepalive" on public.keepalive;
create policy "anon can read keepalive"
  on public.keepalive
  for select
  to anon
  using (true);
