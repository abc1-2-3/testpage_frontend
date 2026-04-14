# 魔法書房 — 贊助前端

魔法書房（Magic Library）的贊助頁面前端，使用 Next.js 開發，串接綠界（ECPay）金流與 Google OAuth 登入。

## 功能

- Google 帳號登入（NextAuth.js）
- 綠界 ECPay 捐款表單（支援信用卡、超商代碼等）
- 個人贊助紀錄查詢（需登入）
- 付款結果頁面
- 魔法風格 UI（粒子特效、Canvas 動畫）

## 技術棧

| 項目 | 版本 |
|------|------|
| Next.js | 16 |
| React | 19 |
| TypeScript | 5 |
| Tailwind CSS | 4 |
| NextAuth.js | 5 (beta) |

## 快速開始

### 1. 安裝依賴

```bash
npm install
```

### 2. 設定環境變數

複製 `.env.example` 並填入實際值：

```bash
cp .env.example .env.local
```

| 變數 | 說明 |
|------|------|
| `GOOGLE_CLIENT_ID` | Google OAuth 用戶端 ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 用戶端密鑰 |
| `AUTH_SECRET` | NextAuth 加密密鑰（執行 `npx auth secret` 產生）|
| `NEXT_PUBLIC_API_URL` | 後端 API 根網址（例如 Railway 部署網址）|
| `INTERNAL_SECRET` | 前後端內部驗證密鑰（須與後端設定一致）|

**Google OAuth 設定：**
1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 建立 OAuth 2.0 用戶端憑證
3. 在「已授權的重新導向 URI」加入：
   - 開發：`http://localhost:3000/api/auth/callback/google`
   - 正式：`https://your-domain.com/api/auth/callback/google`

### 3. 啟動開發伺服器

```bash
npm run dev
```

開啟 [http://localhost:3000](http://localhost:3000)

## 頁面路由

| 路由 | 說明 |
|------|------|
| `/` | 首頁（自動導向 `/donate`）|
| `/donate` | 贊助表單主頁 |
| `/donations` | 個人贊助紀錄（需登入）|
| `/order-result` | 付款完成結果頁 |

## 部署

本專案可部署至 Vercel 或任何支援 Node.js 的平台。

```bash
npm run build
npm run start
```

> 部署前請在平台的環境變數設定中填入 `.env.example` 所列的所有變數。

## 相關專案

本前端需搭配後端 API 使用，後端負責：
- 串接綠界 ECPay 建立訂單
- 接收 ECPay 付款結果 Webhook
- 提供贊助紀錄查詢 API
- JWT 身份驗證
