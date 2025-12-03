# NestJS 後端 API

## 安裝

```bash
cd backend
npm install
```

## 環境變數設定

在 `backend` 資料夾中建立 `.env` 檔案：

```env
# MySQL Docker Container Configuration
MYSQL_CONTAINER_NAME=train-nest-mysql
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=train_nest_db
MYSQL_USER=nestuser
MYSQL_PASSWORD=nestpassword
MYSQL_PORT=3306

# MySQL Connection Settings (for application use)
DB_HOST=127.0.0.1
DB_PORT=3307
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=your_database

# Application Settings
NODE_ENV=development
PORT=3000

# Prisma Database URL
DATABASE_URL=mysql://root:root@127.0.0.1:3307/test

# JWT Secret
JWT_SECRET=your-secret-key
```

## 資料庫設定

### 啟動 MySQL (Docker)

在 `backend` 資料夾中執行：

```bash
docker-compose up -d
```

**如果遇到容器名稱衝突錯誤：**

```bash
# 停止並刪除舊容器
docker stop train-nest-mysql
docker rm train-nest-mysql

# 然後重新啟動
docker-compose up -d
```

**如果遇到環境變數警告：**

確保 `backend/.env` 檔案中包含所有必要的環境變數（參考 `.env.example`）。

### Prisma 遷移

```bash
cd backend
npm run prisma:dev
```

## 開發

```bash
cd backend
npm run start:dev
```

應用程式會在 `http://localhost:3000` 啟動。

## API 端點

- `POST /auth/register` - 註冊
- `POST /auth/login` - 登入
- `GET /auth/profile` - 取得使用者資料（需要 JWT）

## 專案結構

```
backend/
├── src/              # 原始碼
│   ├── modules/      # 功能模組
│   ├── prisma/      # Prisma 服務
│   └── common/      # 共用工具
├── prisma/          # Prisma schema 和 migrations
├── test/            # 測試檔案
└── dist/            # 編譯後的檔案
```

