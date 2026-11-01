-- 範例資料表。改成你自己的資料表時，請新增一個 migration 檔，不要修改已經執行過的舊檔。
-- 新增 migration：supabase migration new <名稱>

create table if not exists public.items (
  id bigint generated always as identity primary key,
  title text not null check (char_length(title) between 1 and 100),
  user_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

-- 研究室規則：每張資料表都要開 RLS。
-- 開了 RLS、沒有任何 policy，就只有伺服器（secret key）能讀寫；瀏覽器用公開金鑰讀不到。
-- 真的需要讓瀏覽器直接讀寫時，再加上明確的 policy，例如：
--   create policy "read own items" on public.items for select to authenticated using (user_id = auth.uid());
alter table public.items enable row level security;
