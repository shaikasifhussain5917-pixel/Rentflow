alter table public.profiles
add column if not exists rent_collection_method text check (rent_collection_method in ('prepaid', 'postpaid')),
add column if not exists default_due_day integer check (default_due_day >= 1 and default_due_day <= 31),
add column if not exists grace_period_days integer check (grace_period_days >= 0),
add column if not exists setup_completed boolean default false;
