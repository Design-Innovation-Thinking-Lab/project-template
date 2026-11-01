# 〈專案名稱〉

> 這份 README 是 DITL 研究室的範本。請把〈〉裡的內容換成你的專案資訊，並刪掉「範本說明」這一節。

## 專案資訊

| 項目 | 內容 |
|---|---|
| 用途 | 〈一句話說明這個專案做什麼〉 |
| 負責人 | 〈姓名、Email〉 |
| 網站 | 〈https://….vercel.app〉 |
| 用到的 Supabase 功能 | 〈只有資料表／Auth 登入／Storage 檔案／Realtime〉 |
| 狀態 | 〈開發中／待交接／已交接〉 |

## 環境變數

列在 [`.env.example`](.env.example)。新增變數時，一定要同步更新那個檔案。

---

## 範本說明（開始專案後刪除這一節）

這是 DITL 研究室的 Vercel + Supabase 專案範本：純 HTML／CSS／JavaScript 網頁，加上 Vercel 的 API 函式和 Supabase 資料庫。

### 1. 建立專案（約 15 分鐘）

1. **建 repo**：在 GitHub 這個範本頁按 **Use this template → Create a new repository**。
   - Owner 選 `Design-Innovation-Thinking-Lab`。
   - 名稱用 `年份-你的名字-專案名`。
   - 設成 **Public**（Vercel 免費帳號不能部署組織裡的私有 repo）。
2. **建 Supabase 資料庫**：到 https://supabase.com 建專案，Region 選 **Southeast Asia (Singapore)**。
   - **請在 supabase.com 建立，不要從 Vercel 的 Marketplace 加。** 這樣你才能邀請老師一起看資料庫。
3. **建資料表**：在電腦上執行：
   ```bash
   npx supabase login
   npx supabase link --project-ref 〈Supabase 專案代碼〉
   npx supabase db push
   ```
   這會照 `supabase/migrations` 建好資料表。
4. **部署到 Vercel**：用你自己的 Vercel 帳號 **Add New → Project**，匯入這個 repo。
5. **設環境變數**：在 Vercel 專案的 **Settings → Environment Variables** 填入 `.env.example` 列的三個變數。值在 Supabase 的 **Project Settings → API Keys**。設好後重新部署一次。
6. **確認**：打開網站，首頁的「連線檢查」顯示 ✅ 就完成了。
7. **讓老師看得到**：
   - Supabase：**Organization Settings → Team → Invite**，邀請老師，角色選 **Developer**。
   - 在研究室的專案登記表新增一列。

### 2. 本機開發

```bash
npm install
npx vercel link
npx vercel env pull .env.local
npx vercel dev
```

### 3. 開發規則（交接靠這些）

- **密碼、金鑰一律放環境變數。** 不寫進程式，也不 commit。`.gitignore` 已經擋住 `.env*`。
- **秘密金鑰只在 `api/` 裡用。** 網頁（`public/`）只能拿到公開金鑰。
- **改資料庫一律新增 migration**：`npx supabase migration new 〈名稱〉`，寫好 SQL 後 `npx supabase db push`。不要只在 Supabase 網頁上手動改，否則交接時重建不出來。
- **每張新資料表都要開 RLS**（`alter table … enable row level security;`）。
- **只透過 `api/_lib/config.mjs` 讀 Supabase 設定**，交接時換帳號才不用改程式。

### 4. 檔案說明

| 路徑 | 作用 |
|---|---|
| `public/` | 網頁 |
| `public/auth.js`、`login.*` | 登入範例（不需要登入功能可以刪掉，連同 `api/me.mjs`） |
| `api/items.mjs` | 資料讀寫範例 |
| `api/health.mjs` | 連線檢查 |
| `api/config.mjs` | 提供瀏覽器公開的 Supabase 設定 |
| `api/_lib/` | 共用程式：讀設定、連 Supabase、處理請求 |
| `supabase/migrations/` | 資料表定義，依時間順序 |
| `supabase/seed.sql` | 本機測試資料（不放真實資料） |
| `test/` | `npm test` 執行的測試 |
| `CLAUDE.md` | 用 Claude Code 開發時，Claude 會遵守的研究室規則 |

### 5. 交接

畢業或計畫結束時，照研究室的交接清單做。其中匯出資料用：

```bash
npx supabase db dump --data-only -f data-export.sql
```

`data-export.sql` 已經被 `.gitignore` 擋住，**不要 commit**，請透過老師指定的私下管道交給老師。
