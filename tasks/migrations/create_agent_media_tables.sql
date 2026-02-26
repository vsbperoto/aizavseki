-- Agent media generation schema for apps/agent.
-- Apply with service role privileges.

create extension if not exists pgcrypto;

create table if not exists public.media_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  source_message_id uuid null references public.messages(id) on delete set null,
  kind text not null check (kind in ('image', 'video')),
  model_alias text not null,
  provider_job_id text null,
  status text not null check (status in ('queued', 'running', 'succeeded', 'failed', 'cancelled')),
  progress numeric(5,2) not null default 0,
  prompt_text text not null,
  input_json jsonb not null default '{}'::jsonb,
  error_text text null,
  result_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  started_at timestamptz null,
  finished_at timestamptz null
);

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  job_id uuid null references public.media_jobs(id) on delete set null,
  kind text not null check (kind in ('image', 'video')),
  model_alias text not null,
  provider_asset_id text null,
  storage_provider text not null default 'external',
  storage_key text null,
  public_url text not null,
  thumbnail_url text null,
  mime_type text null,
  width integer null,
  height integer null,
  duration_sec numeric(10,2) null,
  prompt_text text not null,
  meta_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.media_touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_media_jobs_updated_at on public.media_jobs;
create trigger trg_media_jobs_updated_at
before update on public.media_jobs
for each row
execute function public.media_touch_updated_at();

create index if not exists idx_media_jobs_user_created_at
  on public.media_jobs (user_id, created_at desc);

create index if not exists idx_media_jobs_user_status
  on public.media_jobs (user_id, status, updated_at desc);

create index if not exists idx_media_assets_user_created_at
  on public.media_assets (user_id, created_at desc);

create index if not exists idx_media_assets_job
  on public.media_assets (job_id);

alter table public.media_jobs enable row level security;
alter table public.media_assets enable row level security;

drop policy if exists "media_jobs_select_own" on public.media_jobs;
create policy "media_jobs_select_own"
  on public.media_jobs for select
  using (auth.uid() = user_id);

drop policy if exists "media_jobs_insert_own" on public.media_jobs;
create policy "media_jobs_insert_own"
  on public.media_jobs for insert
  with check (auth.uid() = user_id);

drop policy if exists "media_jobs_update_own" on public.media_jobs;
create policy "media_jobs_update_own"
  on public.media_jobs for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "media_jobs_delete_own" on public.media_jobs;
create policy "media_jobs_delete_own"
  on public.media_jobs for delete
  using (auth.uid() = user_id);

drop policy if exists "media_assets_select_own" on public.media_assets;
create policy "media_assets_select_own"
  on public.media_assets for select
  using (auth.uid() = user_id);

drop policy if exists "media_assets_insert_own" on public.media_assets;
create policy "media_assets_insert_own"
  on public.media_assets for insert
  with check (auth.uid() = user_id);

drop policy if exists "media_assets_update_own" on public.media_assets;
create policy "media_assets_update_own"
  on public.media_assets for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "media_assets_delete_own" on public.media_assets;
create policy "media_assets_delete_own"
  on public.media_assets for delete
  using (auth.uid() = user_id);

