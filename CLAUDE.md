# CLAUDE.md — DITL 研究室專案規則

這是 DITL 研究室的 Vercel + Supabase 專案。專案之後會交接給研究室繼續運作，所以請遵守以下規則。

## 架構

- `public/`：純 HTML／CSS／JavaScript，沒有建置步驟。Supabase 的瀏覽器套件從 CDN 載入（`public/auth.js`）。
- `api/`：Vercel 函式（Node.js，ESM `.mjs`，用 `export async function GET/POST(request)` 回傳 `Response`）。檔名開頭是 `_` 的不會成為網址。
- `supabase/migrations/`：資料庫定義的唯一來源。

## 必須遵守

1. **不要讀、印出或 commit 任何密鑰。** `.env*`（`.env.example` 除外）都不要打開。需要設定時，告訴使用者到 Vercel 的 Environment Variables 設定。
2. **Supabase 設定只能透過 `api/_lib/config.mjs` 讀取。** 不要在其他地方直接讀 `process.env.SUPABASE_*`，也不要把網址或金鑰寫死在程式裡。
3. **秘密金鑰（`adminClient()`）只能在 `api/` 使用。** 絕不能出現在 `public/`，也不能出現在 API 回應裡。
4. **每支用 `adminClient()` 的 API 都要自己檢查權限。** 秘密金鑰會略過 RLS。用 `userFromRequest()` 確認是誰，再限制只能讀寫屬於他的資料（參考 `api/items.mjs`）。登入不等於什麼都能做。不需要登入就能寫入的 API，要先請使用者和老師確認。
5. **資料庫的任何變更都寫成新的 migration**（`npx supabase migration new <名稱>`）。不要修改已經執行過的 migration。
6. **每張新資料表都要 `enable row level security`。** 只有在使用者明確需要瀏覽器直接存取時才加 policy，而且要說明 policy 的範圍。
7. **API 要檢查輸入**（長度、型別），並用 `api/_lib/http.mjs` 的 `fail()` 回傳中文錯誤訊息。
8. **新增環境變數時，同步更新 `.env.example`**（只寫名稱和說明，不寫值）。
9. **README 的「專案資訊」表保持最新**，特別是「用到的 Supabase 功能」，交接時要靠它判斷資料庫怎麼搬。
10. 修改後執行 `npm test`。

## 不要做

- 不要加入需要建置步驟的框架（React、Next.js 等），除非使用者和老師討論後決定。
- 不要把個資或研究資料放進 repo（包括 `supabase/seed.sql`）。
