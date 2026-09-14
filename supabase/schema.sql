-- Caupona: schema do Supabase (Postgres)
-- Rode isso no SQL editor do seu projeto Supabase.

create table if not exists allowed_users (
  email text primary key
);

create table if not exists restaurants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null,
  lat double precision not null,
  lng double precision not null,
  cuisine_style text not null,
  reason text not null,
  added_by_email text not null references allowed_users(email),
  created_at timestamptz not null default now()
);

create table if not exists restaurant_reviews (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  user_email text not null references allowed_users(email),
  went boolean not null default false,
  rating smallint check (rating between 1 and 5),
  impression text,
  updated_at timestamptz not null default now(),
  unique (restaurant_id, user_email)
);

create index if not exists restaurant_reviews_restaurant_id_idx
  on restaurant_reviews (restaurant_id);

-- Adicione aqui os e-mails de quem pode logar, por exemplo:
-- insert into allowed_users (email) values ('paulo.montori@gmail.com');
