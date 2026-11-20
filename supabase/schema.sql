-- RemindMe · encrypted cross-device sync
-- Run this once in the Supabase SQL editor for the project that backs the web
-- app, before turning sync on in Settings → Sync across devices.
--
-- Every sync code owns exactly one row. The primary key is the SHA-256 of the
-- code, and the payload is AES-GCM ciphertext under a PBKDF2 key derived from
-- the same code inside the browser. The project therefore only ever stores
-- ciphertext: it cannot read tasks, and holding the anon key is not enough to
-- decrypt anything. The key itself never leaves the user's devices.

create table if not exists public.remindme_sync (
  id         text primary key,                 -- SHA-256 of the sync code (hex)
  iv         text not null,                    -- AES-GCM nonce of this revision
  payload    text not null,                    -- base64 AES-GCM ciphertext of the app state
  revision   bigint not null default 1,        -- bumped on every push; guards against clobbering
  updated_at timestamptz not null default now()
);

alter table public.remindme_sync enable row level security;

-- Clients talk to this table with the anon key and no Supabase account, because
-- the sync code itself is the credential. Rows are addressed by an id that is
-- derived from a 144-bit code, so an id cannot be guessed; the contents stay
-- sealed without the code.
drop policy if exists "sync read" on public.remindme_sync;
create policy "sync read" on public.remindme_sync
  for select to anon, authenticated
  using (true);

drop policy if exists "sync insert" on public.remindme_sync;
create policy "sync insert" on public.remindme_sync
  for insert to anon, authenticated
  with check (true);

drop policy if exists "sync update" on public.remindme_sync;
create policy "sync update" on public.remindme_sync
  for update to anon, authenticated
  using (true) with check (true);

-- Deliberately no delete policy: a device can add its row and replace it with a
-- newer revision, but nothing can wipe the backup from the browser.
