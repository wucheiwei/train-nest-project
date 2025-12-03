# Train Nest Project

全端專案，包含 NestJS 後端和 Vue.js 前端。

## 專案結構

```
train-nest-project/
├── backend/         # NestJS 後端 API
│   ├── .env         # 環境變數（需要自行建立）
│   ├── docker-compose.yml  # Docker Compose 配置
│   └── ...
└── frontend/        # Vue.js 前端應用
```

## 快速開始

### 1. 環境變數設定

在 `backend` 資料夾中建立 `.env` 檔案：

```env
# MySQL Docker Container Configuration
MYSQL_CONTAINER_NAME=train-nest-mysql
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=train_nest_db
MYSQL_USER=nestuser
MYSQL_PASSWORD=nestpassword
MYSQL_PORT=3306

# MySQL Connection Settings
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

### 2. 啟動 MySQL (Docker)

在 `backend` 資料夾中執行：

```bash
cd backend
docker-compose up -d
```

### 3. 設定後端

```bash
cd backend

# 建立 .env 檔案（如果還沒有）
# 複製 .env.example 或參考 backend/README.md 建立

npm install
npm run prisma:dev
npm run start:dev
```

後端會在 `http://localhost:3000` 啟動。

### 4. 設定前端

```bash
cd frontend
npm install

# 建立 .env 檔案
cp .env.example .env
# 編輯 .env，設定 VITE_API_BASE_URL=http://localhost:3000

npm run dev
```

前端會在 `http://localhost:8080` 啟動。

## 技術棧

### 後端
- NestJS
- Prisma ORM
- MySQL
- JWT 認證
- Docker

### 前端
- Vue 3
- Vue Router
- Vite
- Axios

## 詳細說明

- [後端文件](./backend/README.md)
- [前端文件](./frontend/README.md)
