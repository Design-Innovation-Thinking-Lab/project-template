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
   - 預設設成 **Public**（研究室的 Vercel 團隊裡，私人 repo 每位 push 的學生都要佔一個付費席位）。
   - **Public 代表全世界看得到整個 repo 和所有 commit 紀錄。** 不要放個資、研究資料、聯絡方式或不能公開的程式。專案不能公開時，先和老師討論，不要建 repo。
   - commit 紀錄會顯示你的 Git Email。在 GitHub 的 **Settings → Emails** 開啟「Keep my email addresses private」，並把本機的 Git Email 設成 GitHub 給你的 noreply 信箱（`git config --global user.email 〈noreply 信箱〉`），之後檢查新的 commit 是否已改用它。
2. **請老師開資料庫和網站**：把 repo 名稱告訴老師（或助理）。老師會在研究室的 Supabase 組織 **DITLDESIGN** 開專案（Region：Southeast Asia (Singapore)），在研究室的 Vercel 團隊 **DITLDESIGN** 匯入這個 repo（Framework Preset：**Other**，Build Command 留空），並設好 `.env.example` 列的三個環境變數。**不要用個人帳號建資料庫或部署。**
   - **研究室的 Supabase 是共用空間**：組織裡的每位學生都看得到、也改得到所有專案的資料。只放公開或假資料；要用個資、研究資料或合作單位的資料時，開始前先和老師討論。不要動別人專案的資料。
   - **登入帳號也算資料**：登入者的 Email 會存在 Supabase 的使用者表，同學都查得到。研究室 Supabase 只讓研究室成員用自己的學校 Email 登入測試；要讓校外的人登入，開始前先和老師討論。
3. **建資料表**：在電腦上執行（學生權限能不能執行，研究室試點確認中；失敗時請老師或助理執行）：
   ```bash
   npx supabase login
   npx supabase link --project-ref 〈Supabase 專案代碼〉
   npx supabase db push
   ```
   這會照 `supabase/migrations` 建好資料表。
4. **部署**：老師匯入之後，push 到 `main` 應該會自動部署；開 Pull Request 會產生預覽網址（研究室試點確認中）。push 之後沒有部署或部署失敗，請找老師或助理：學生的 Viewer 權限**看不到 log**，由老師或助理查原因。
5. **新增環境變數時**：更新 `.env.example`，並請老師在 Vercel 專案的 **Settings → Environment Variables** 設定（Viewer 不能改環境變數）。
6. **設定登入網址**（專案設定，學生的 Developer 權限不能改，由老師或助理設定）：到 Supabase 的 **Authentication → URL Configuration**：
   - **Site URL**：你的網站網址，例如 `https://2026-wang-gacha.vercel.app`。
   - **Redirect URLs**：加上 `https://〈你的網址〉/login`，本機開發再加 `http://localhost:3000/login`。
   - 沒設定的話，登入信的連結會跳回 localhost 或被拒絕。
7. **確認**：
   - 首頁的「連線檢查」顯示 ✅。
   - 到登入頁用你的學校 Email 登入，信裡的連結能回到網站，登入頁顯示「伺服器確認了你的登入身分」。
   - 回首頁新增一筆資料，看得到它；登出後看不到。
   - Supabase 內建的寄信服務只寄給你的 Supabase 組織成員，而且每小時有數量限制，只適合開發測試。要讓其他人登入，請先和老師討論設定自訂 SMTP。
8. **登記**：把專案資料交給老師或助理，登記到研究室的專案登記表。網站和資料庫都在研究室帳號，老師隨時看得到，不需要另外邀請。

### 2. 本機開發

```bash
npm ci
npx vercel link
npx vercel env pull .env.local
npx vercel dev
```

`vercel link` 選研究室團隊 **DITLDESIGN** 裡的這個專案。學生的 Viewer 權限能不能執行這幾個指令，研究室試點確認中：
- **`vercel link` 失敗**：就不能用 `vercel dev`。請找老師或助理，不要自己改用其他方法部署。
- **`vercel env pull` 失敗**：請老師或助理用老師指定的加密管道給你開發用的值，自己建 `.env.local`，照 `.env.example` 填入。其中 `SUPABASE_SECRET_KEY` 可以讀寫整個資料庫，只能放在自己的電腦：不能傳給別人、不能貼到網頁、聊天或 AI 對話裡，也不能 commit；不要拿別的專案的值來用。懷疑外洩（例如不小心 commit 或貼出去），**馬上告訴老師**，老師會立刻換掉，不用等到專案結束。專案結束時老師也會換掉這把金鑰。
- `.env.local` 已被 `.gitignore` 擋住，不會被 commit。

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

網站和資料庫本來就在研究室，**不用搬資料**。畢業或專案結束時：
- 確認 README（含在 Supabase 網頁上手動設定的東西）、`.env.example`、`supabase/migrations/` 都是最新的。
- 通知老師。老師會收回你在 GitHub、Vercel、Supabase 的權限，並換掉你拿過的金鑰。
