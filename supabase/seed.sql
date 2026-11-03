-- 本機測試用的假資料（supabase db reset 時會載入）。不要放真實資料或個資。
-- items 的每一筆都要屬於一位使用者，所以先建一個假的本機帳號（只存在本機資料庫）。
insert into auth.users (id, aud, role, email, created_at, updated_at)
values ('00000000-0000-0000-0000-000000000001', 'authenticated', 'authenticated', 'demo@example.com', now(), now())
on conflict (id) do nothing;

insert into public.items (title, user_id) values
  ('第一筆範例', '00000000-0000-0000-0000-000000000001'),
  ('第二筆範例', '00000000-0000-0000-0000-000000000001');
