-- =============================================================================
-- ローカル開発専用シード（supabase db reset 時のみ適用）
--
-- 注意:
-- - 本番 / ステージングには絶対に適用しないこと（db push では実行されない）
-- - CI から remote への seed 実行を禁止すること
-- - デモ認証情報は弱い固定値。本番アカウントには使わないこと
-- デモユーザー: demo@example.com / password123
-- =============================================================================

create extension if not exists pgcrypto with schema extensions;

-- ---------------------------------------------------------------------------
-- デモユーザー（auth.users）
-- profiles は on_auth_user_created トリガーで自動作成される
-- ---------------------------------------------------------------------------
insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) values (
  '00000000-0000-0000-0000-000000000000',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'authenticated',
  'authenticated',
  'demo@example.com',
  extensions.crypt('password123', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"display_name":"デモユーザー"}'::jsonb,
  now(),
  now(),
  '',
  '',
  '',
  ''
);

insert into auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  provider_id,
  last_sign_in_at,
  created_at,
  updated_at
) values (
  gen_random_uuid(),
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  format(
    '{"sub":"%s","email":"%s","email_verified":true,"phone_verified":false}',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'demo@example.com'
  )::jsonb,
  'email',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  now(),
  now(),
  now()
);

-- ---------------------------------------------------------------------------
-- サンプル書籍
-- ---------------------------------------------------------------------------
insert into public.books (
  id,
  user_id,
  title,
  author,
  isbn,
  total_pages,
  status,
  rating,
  review,
  started_at,
  finished_at,
  cover_url,
  google_books_id
) values
  (
    'b1000000-0000-4000-8000-000000000001',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'こころ',
    '夏目漱石',
    '9784101010137',
    378,
    'finished',
    5,
    '先生とKの関係が忘れられない。',
    '2025-01-10',
    '2025-02-01',
    null,
    null
  ),
  (
    'b1000000-0000-4000-8000-000000000002',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'ゼロから作るDeep Learning',
    '斎藤康毅',
    '9784873117584',
    376,
    'reading',
    null,
    null,
    '2026-06-01',
    null,
    null,
    null
  ),
  (
    'b1000000-0000-4000-8000-000000000003',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'リーダブルコード',
    'Dustin Boswell / Trevor Foucher',
    '9784873115658',
    260,
    'wishlist',
    null,
    null,
    null,
    null,
    null,
    null
  ),
  (
    'b1000000-0000-4000-8000-000000000004',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    '失敗の本質',
    '戸部良一 ほか',
    '9784122018334',
    462,
    'dropped',
    2,
    '途中で興味が薄れたため一旦中断。',
    '2024-11-01',
    null,
    null,
    null
  );
