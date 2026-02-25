-- Agent memory and conversation persistence schema for apps/agent.
-- Apply in Supabase SQL editor with service role privileges.

create extension if not exists pgcrypto;

create table if not exists public.agent_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  agent_name text not null,
  persona_json jsonb not null default '{}'::jsonb,
  goals_json jsonb not null default '{}'::jsonb,
  style_guide_json jsonb not null default '{}'::jsonb,
  memory_policy_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  agent_profile_id uuid not null references public.agent_profiles(id) on delete cascade,
  title text not null default 'New chat',
  status text not null default 'active' check (status in ('active', 'archived')),
  message_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('system', 'user', 'assistant', 'tool')),
  content text not null,
  meta_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.memory_entities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  canonical_name text not null,
  entity_type text not null default 'concept',
  attributes_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, canonical_name)
);

create table if not exists public.memory_relations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source_entity_id uuid not null references public.memory_entities(id) on delete cascade,
  relation_type text not null,
  target_entity_id uuid not null references public.memory_entities(id) on delete cascade,
  confidence numeric(4,3) not null default 0.650,
  valid_from timestamptz not null default now(),
  valid_until timestamptz null,
  evidence_message_id uuid null references public.messages(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.memory_facts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entity_id uuid null references public.memory_entities(id) on delete set null,
  fact_text text not null,
  confidence numeric(4,3) not null default 0.700,
  valid_from timestamptz not null default now(),
  valid_until timestamptz null,
  source_message_id uuid null references public.messages(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.memory_summaries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  conversation_id uuid null references public.conversations(id) on delete cascade,
  summary_text text not null,
  window_start_message_id uuid null references public.messages(id) on delete set null,
  window_end_message_id uuid null references public.messages(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.usage_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  conversation_id uuid null references public.conversations(id) on delete cascade,
  event_type text not null check (event_type in ('chat', 'image', 'video')),
  model text not null,
  input_units integer not null default 0,
  output_units integer not null default 0,
  estimated_cost_usd numeric(12,6) not null default 0,
  created_at timestamptz not null default now()
);

create or replace function public.agent_touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_agent_profiles_updated_at on public.agent_profiles;
create trigger trg_agent_profiles_updated_at
before update on public.agent_profiles
for each row
execute function public.agent_touch_updated_at();

drop trigger if exists trg_conversations_updated_at on public.conversations;
create trigger trg_conversations_updated_at
before update on public.conversations
for each row
execute function public.agent_touch_updated_at();

drop trigger if exists trg_memory_entities_updated_at on public.memory_entities;
create trigger trg_memory_entities_updated_at
before update on public.memory_entities
for each row
execute function public.agent_touch_updated_at();

create index if not exists idx_conversations_user_updated_at
  on public.conversations (user_id, updated_at desc);

create index if not exists idx_messages_conversation_created_at
  on public.messages (conversation_id, created_at asc);

create index if not exists idx_memory_entities_user_updated_at
  on public.memory_entities (user_id, updated_at desc);

create index if not exists idx_memory_facts_user_created_at
  on public.memory_facts (user_id, created_at desc);

create index if not exists idx_memory_relations_user_created_at
  on public.memory_relations (user_id, created_at desc);

create index if not exists idx_usage_events_user_created_at
  on public.usage_events (user_id, created_at desc);

alter table public.agent_profiles enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.memory_entities enable row level security;
alter table public.memory_relations enable row level security;
alter table public.memory_facts enable row level security;
alter table public.memory_summaries enable row level security;
alter table public.usage_events enable row level security;

drop policy if exists "agent_profiles_select_own" on public.agent_profiles;
create policy "agent_profiles_select_own"
  on public.agent_profiles for select
  using (auth.uid() = user_id);

drop policy if exists "agent_profiles_insert_own" on public.agent_profiles;
create policy "agent_profiles_insert_own"
  on public.agent_profiles for insert
  with check (auth.uid() = user_id);

drop policy if exists "agent_profiles_update_own" on public.agent_profiles;
create policy "agent_profiles_update_own"
  on public.agent_profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "agent_profiles_delete_own" on public.agent_profiles;
create policy "agent_profiles_delete_own"
  on public.agent_profiles for delete
  using (auth.uid() = user_id);

drop policy if exists "conversations_select_own" on public.conversations;
create policy "conversations_select_own"
  on public.conversations for select
  using (auth.uid() = user_id);

drop policy if exists "conversations_insert_own" on public.conversations;
create policy "conversations_insert_own"
  on public.conversations for insert
  with check (auth.uid() = user_id);

drop policy if exists "conversations_update_own" on public.conversations;
create policy "conversations_update_own"
  on public.conversations for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "conversations_delete_own" on public.conversations;
create policy "conversations_delete_own"
  on public.conversations for delete
  using (auth.uid() = user_id);

drop policy if exists "messages_select_own" on public.messages;
create policy "messages_select_own"
  on public.messages for select
  using (auth.uid() = user_id);

drop policy if exists "messages_insert_own" on public.messages;
create policy "messages_insert_own"
  on public.messages for insert
  with check (auth.uid() = user_id);

drop policy if exists "messages_update_own" on public.messages;
create policy "messages_update_own"
  on public.messages for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "messages_delete_own" on public.messages;
create policy "messages_delete_own"
  on public.messages for delete
  using (auth.uid() = user_id);

drop policy if exists "memory_entities_select_own" on public.memory_entities;
create policy "memory_entities_select_own"
  on public.memory_entities for select
  using (auth.uid() = user_id);

drop policy if exists "memory_entities_insert_own" on public.memory_entities;
create policy "memory_entities_insert_own"
  on public.memory_entities for insert
  with check (auth.uid() = user_id);

drop policy if exists "memory_entities_update_own" on public.memory_entities;
create policy "memory_entities_update_own"
  on public.memory_entities for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "memory_entities_delete_own" on public.memory_entities;
create policy "memory_entities_delete_own"
  on public.memory_entities for delete
  using (auth.uid() = user_id);

drop policy if exists "memory_relations_select_own" on public.memory_relations;
create policy "memory_relations_select_own"
  on public.memory_relations for select
  using (auth.uid() = user_id);

drop policy if exists "memory_relations_insert_own" on public.memory_relations;
create policy "memory_relations_insert_own"
  on public.memory_relations for insert
  with check (auth.uid() = user_id);

drop policy if exists "memory_relations_update_own" on public.memory_relations;
create policy "memory_relations_update_own"
  on public.memory_relations for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "memory_relations_delete_own" on public.memory_relations;
create policy "memory_relations_delete_own"
  on public.memory_relations for delete
  using (auth.uid() = user_id);

drop policy if exists "memory_facts_select_own" on public.memory_facts;
create policy "memory_facts_select_own"
  on public.memory_facts for select
  using (auth.uid() = user_id);

drop policy if exists "memory_facts_insert_own" on public.memory_facts;
create policy "memory_facts_insert_own"
  on public.memory_facts for insert
  with check (auth.uid() = user_id);

drop policy if exists "memory_facts_update_own" on public.memory_facts;
create policy "memory_facts_update_own"
  on public.memory_facts for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "memory_facts_delete_own" on public.memory_facts;
create policy "memory_facts_delete_own"
  on public.memory_facts for delete
  using (auth.uid() = user_id);

drop policy if exists "memory_summaries_select_own" on public.memory_summaries;
create policy "memory_summaries_select_own"
  on public.memory_summaries for select
  using (auth.uid() = user_id);

drop policy if exists "memory_summaries_insert_own" on public.memory_summaries;
create policy "memory_summaries_insert_own"
  on public.memory_summaries for insert
  with check (auth.uid() = user_id);

drop policy if exists "memory_summaries_update_own" on public.memory_summaries;
create policy "memory_summaries_update_own"
  on public.memory_summaries for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "memory_summaries_delete_own" on public.memory_summaries;
create policy "memory_summaries_delete_own"
  on public.memory_summaries for delete
  using (auth.uid() = user_id);

drop policy if exists "usage_events_select_own" on public.usage_events;
create policy "usage_events_select_own"
  on public.usage_events for select
  using (auth.uid() = user_id);

drop policy if exists "usage_events_insert_own" on public.usage_events;
create policy "usage_events_insert_own"
  on public.usage_events for insert
  with check (auth.uid() = user_id);

drop policy if exists "usage_events_update_own" on public.usage_events;
create policy "usage_events_update_own"
  on public.usage_events for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "usage_events_delete_own" on public.usage_events;
create policy "usage_events_delete_own"
  on public.usage_events for delete
  using (auth.uid() = user_id);

