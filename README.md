# 〈專案名稱〉

> 這份 README 是 DITL 研究室的範本。請把〈〉裡的內容換成你的專案資訊，並刪掉「範本說明」這一節。

## 專案資訊

| 項目 | 內容 |
|---|---|
| 用途 | 〈一句話說明這個專案做什麼〉 |
| 負責人 | 〈公開顯示的名字，例如「DITL 王同學」。這個 repo 是公開的，Email、電話只寫在研究室的私有登記表〉 |
| 網站 | 〈https://….vercel.app〉 |
| 用到的 Supabase 功能 | 資料表、Auth 登入〈範本預設；有用到 Storage 檔案、Realtime 請加上，刪掉登入時請改掉〉 |
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
   - **Public 代表全世界看得到整個 repo 和所有 commit 紀錄。** 不要放個資、研究資料、聯絡方式或不能公開的程式。專案不能公開時，先和老師討論，不要建 repo。
2. **建 Supabase 資料庫**：到 https://supabase.com 建專案，Region 選 **Southeast Asia (Singapore)**。
   - **請在 supabase.com 建立，不要從 Vercel 的 Marketplace 加。** 這是研究室的慣例：開發期間你是自己 Supabase 組織的 Owner，邀請老師、帳單、暫停都在 supabase.com 管理；交接時研究室另外建新的資料庫，學生的作法統一，交接步驟才固定。
3. **建資料表**：在電腦上執行：
   ```bash
   npx supabase login
   npx supabase link --project-ref 〈Supabase 專案代碼〉
   npx supabase db push
   ```
   這會照 `supabase/migrations` 建好資料表。
4. **部署到 Vercel**：用你自己的 Vercel 帳號 **Add New → Project**，匯入這個 repo。Framework Preset 選 **Other**，Build Command 留空。
5. **設環境變數**：在 Vercel 專案的 **Settings → Environment Variables** 填入 `.env.example` 列的三個變數。值在 Supabase 的 **Project Settings → API Keys**。設好後重新部署一次。
6. **設定登入網址**：到 Supabase 的 **Authentication → URL Configuration**：
   - **Site URL**：你的網站網址，例如 `https://2026-wang-gacha.vercel.app`。
   - **Redirect URLs**：加上 `https://〈你的網址〉/login`，本機開發再加 `http://localhost:3000/login`。
   - 沒設定的話，登入信的連結會跳回 localhost 或被拒絕。
7. **確認**：
   - 首頁的「連線檢查」顯示 ✅。
   - 到登入頁用你的 Email 登入，信裡的連結能回到網站，登入頁顯示「伺服器確認了你的登入身分」。
   - 回首頁新增一筆資料，看得到它；登出後看不到。
   - Supabase 內建的寄信服務只寄給你的 Supabase 組織成員，而且每小時有數量限制，只適合開發測試。要讓其他人登入，請先和老師討論設定自訂 SMTP。
8. **讓老師看得到**：
   - Supabase：**Organization Settings → Team → Invite**，邀請老師，角色選 **Developer**。
   - 在研究室的專案登記表新增一列。

### 2. 本機開發

```bash
npm ci
npx vercel link
npx vercel env pull .env.local
npx vercel dev
```

### 3. 開發規則（交接靠這些）

- **密碼、金鑰一律放環境變數。** 不寫進程式，也不 commit。`.gitignore` 已經擋住 `.env*`。
- **秘密金鑰只在 `api/` 裡用。** 網頁（`public/`）只能拿到公開金鑰。
- **改資料庫一律新增 migration**：`npx supabase migration new 〈名稱〉`，寫好 SQL 後 `npx supabase db push`。不要只在 Supabase 網頁上手動改，否則交接時重建不出來。
- **每張新資料表都要開 RLS**（`alter table … enable row level security;`）。
- **RLS 只擋瀏覽器直接讀資料表，擋不住你自己寫的 API。** `api/` 用秘密金鑰，會略過 RLS，所以每支 API 都要自己檢查「是誰」以及「可以讀寫哪些資料」。範本的 `api/items.mjs` 要求登入，而且每個人只讀寫自己的資料；登入只代表知道是誰，不代表什麼都能做。
- **開放不登入就能寫入的 API 之前先和老師討論**：任何人都能灌資料。真的需要時，只放假資料，並在 Vercel Firewall 加上頻率限制。
- **只透過 `api/_lib/config.mjs` 讀 Supabase 設定**，交接時換帳號才不用改程式。

### 4. 檔案說明

| 路徑 | 作用 |
|---|---|
| `public/` | 網頁 |
| `public/auth.js`、`login.*` | 登入範例。`api/items.mjs` 靠登入判斷資料屬於誰；要刪掉登入功能，請先改寫 API 的權限檢查 |
| `api/items.mjs` | 資料讀寫範例 |
| `api/health.mjs` | 連線檢查 |
| `api/config.mjs` | 提供瀏覽器公開的 Supabase 設定 |
| `api/_lib/` | 共用程式：讀設定、連 Supabase、處理請求 |
| `supabase/migrations/` | 資料表定義，依時間順序 |
| `supabase/seed.sql` | 本機測試資料（不放真實資料） |
| `test/` | `npm test` 執行的測試 |
| `CLAUDE.md` | 研究室規則，用 Claude Code 開發時 Claude 會讀到（不保證每次都做對，仍要自己檢查） |

### 5. 交接

畢業或計畫結束時，照研究室的交接清單做：先和老師約停寫時間，研究室建好新站後，舊站停止寫入，再匯出最後一份資料。**不要提早匯出**，匯出之後新增的資料會遺失。

匯出的檔案（`data-export.sql`）已經被 `.gitignore` 擋住，**不要 commit**，裡面有個資，請透過老師指定的私下管道交給老師。
