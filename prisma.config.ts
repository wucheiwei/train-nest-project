import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",

  // ✔ Prisma 7 要你在這裡設定資料庫 URL
  datasource: {
    url: process.env.DATABASE_URL!,
  },

  // ✔ 設定 migrations 位置
  migrations: {
    path: "prisma/migrations",
  },

  // ✔ NestJS 必須用 binary 引擎
  client: {
    engineType: "binary",
  },
});
