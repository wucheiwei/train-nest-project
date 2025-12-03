# Vue 前端 - 使用者認證系統 (Vite)

使用 Vite + Vue 3 建置的前端應用程式。

## 安裝

```bash
cd frontend
npm install
```

## 開發

```bash
npm run dev
```

應用程式會在 `http://localhost:8080` 啟動。

## 建置

```bash
npm run build
```

建置後的檔案會在 `dist` 資料夾中。

## 預覽建置結果

```bash
npm run preview
```

## 環境變數設定

### 設定後端 API 網址

1. 複製 `.env.example` 為 `.env`：
   ```bash
   cp .env.example .env
   ```

2. 編輯 `.env` 檔案，設定後端網址：
   ```env
   VITE_API_BASE_URL=http://localhost:3000
   ```

   **注意：** Vite 的環境變數必須以 `VITE_` 開頭才能在前端使用。

3. 重新啟動開發伺服器以載入新的環境變數。

## 專案結構

```
frontend/
├── src/
│   ├── api/          # API 服務
│   ├── views/        # 頁面元件
│   ├── App.vue       # 根元件
│   └── main.js       # 應用程式入口
├── index.html        # HTML 模板
├── vite.config.js    # Vite 配置
├── package.json      # 專案依賴
└── .env              # 環境變數（不提交到 Git）
```

## 功能

- ✅ 使用者註冊
- ✅ 使用者登入
- ✅ JWT Token 管理
- ✅ 路由守衛
- ✅ 響應式設計
- ✅ 表單驗證
- ✅ 環境變數支援（.env）

## API 端點

- `POST /auth/register` - 註冊
- `POST /auth/login` - 登入
- `GET /auth/profile` - 取得使用者資料（需要 JWT）

## 注意事項

1. 確保後端服務運行在設定的 `VITE_API_BASE_URL`
2. 需要啟用後端的 CORS 支援
3. 環境變數修改後需要重新啟動開發伺服器
