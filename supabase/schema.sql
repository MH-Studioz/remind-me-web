-- RemindMe · encrypted cross-device sync
-- Run this once in the Supabase SQL editor for the project that backs the web app.
--
-- The app uploads one sealed blob per account. The key is derived in the browser
-- (PBKDF2-SHA256, 210k iterations, per-account salt) and never leaves the device,
-- so everything stored here is ciphertext the database cannot read.

create table if not exists public.remindme_sync (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  salt       text not null,                  -- PBKDF2 salt; public by design, needed on a new device
  iv         text not null,                  -- AES-GCM nonce of the stored payload
  payload    text not null,                  -- base64 AES-GCM ciphertext of the whole app state
  revision   bigint not null default 1,      -- incremented on every push, used to detect clobbering
  updated_at timestamptz not null default now()
);

alter table public.remindme_sync enable row level security;

drop policy if exists "own sync row" on public.remindme_sync;
create policy "own sync row" on public.remindme_sync
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- No service-role access is needed from the browser; the anon key plus a signed-in
-- session is enough, and the policy above limits every request to the caller's row.
