-- reading-recorder 初期スキーマ
-- 対象: profiles / books
-- 方針: UUID PK、Supabase Auth 連携、RLS 有効

-- ---------------------------------------------------------------------------
-- 共通: updated_at 自動更新
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- profiles（auth.users と 1:1）
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'アプリユーザープロフィール（auth.users 拡張）';
comment on column public.profiles.id is 'auth.users.id と同じ UUID';
comment on column public.profiles.display_name is '表示名';

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

-- サインアップ時に profiles を自動作成
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- books（ユーザー蔵書・読書状態）
-- 旧カラム name は title にリネーム（新規作成のためデータ移行なし）
-- ---------------------------------------------------------------------------
drop table if exists public.books cascade;

create table public.books (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  author text,
  isbn text,
  total_pages integer,
  status text not null default 'wishlist'
    check (status in ('wishlist', 'reading', 'finished', 'dropped')),
  rating smallint check (rating is null or (rating between 1 and 5)),
  review text,
  started_at date,
  finished_at date,
  cover_url text,
  google_books_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint books_total_pages_positive check (total_pages is null or total_pages > 0),
  constraint books_finished_after_started check (
    finished_at is null or started_at is null or finished_at >= started_at
  )
);

comment on table public.books is 'ユーザーの蔵書・読書状態';
comment on column public.books.title is '書籍タイトル（旧 name）';
comment on column public.books.status is 'wishlist | reading | finished | dropped';
comment on column public.books.rating is '1〜5 の評価。未評価は null';
comment on column public.books.google_books_id is 'Google Books API 連携用 ID（将来）';

create index books_user_id_idx on public.books (user_id);
create index books_user_id_status_idx on public.books (user_id, status);
create index books_user_id_created_at_idx on public.books (user_id, created_at desc);

create trigger books_set_updated_at
  before update on public.books
  for each row
  execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.books enable row level security;

-- profiles: 本人のみ参照・更新
create policy "profiles_select_own"
  on public.profiles
  for select
  to authenticated
  using (id = (select auth.uid()));

create policy "profiles_update_own"
  on public.profiles
  for update
  to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- books: 本人のみ CRUD
create policy "books_select_own"
  on public.books
  for select
  to authenticated
  using (user_id = (select auth.uid()));

create policy "books_insert_own"
  on public.books
  for insert
  to authenticated
  with check (user_id = (select auth.uid()));

create policy "books_update_own"
  on public.books
  for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "books_delete_own"
  on public.books
  for delete
  to authenticated
  using (user_id = (select auth.uid()));
