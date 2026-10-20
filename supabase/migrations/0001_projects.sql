create type project_status as enum ('planejado', 'em_andamento', 'concluido', 'pausado');

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 120),
  description text,
  status project_status not null default 'planejado',
  due_date date,
  created_at timestamptz not null default now()
);

alter table public.projects enable row level security;

create policy "owner select" on public.projects for select using (owner_id = auth.uid());
create policy "owner insert" on public.projects for insert with check (owner_id = auth.uid());
create policy "owner update" on public.projects for update using (owner_id = auth.uid());
create policy "owner delete" on public.projects for delete using (owner_id = auth.uid());
