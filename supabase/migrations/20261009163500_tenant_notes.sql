create table if not exists public.tenant_notes (
    id uuid default gen_random_uuid() primary key,
    owner_id uuid references auth.users(id) not null,
    tenant_id uuid references public.tenants(id) on delete cascade not null,
    content text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.tenant_notes enable row level security;

create policy "Users can view their own tenant notes"
    on public.tenant_notes for select
    using (auth.uid() = owner_id);

create policy "Users can insert their own tenant notes"
    on public.tenant_notes for insert
    with check (auth.uid() = owner_id);

create policy "Users can update their own tenant notes"
    on public.tenant_notes for update
    using (auth.uid() = owner_id);

create policy "Users can delete their own tenant notes"
    on public.tenant_notes for delete
    using (auth.uid() = owner_id);
