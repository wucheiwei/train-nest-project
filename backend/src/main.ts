import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { resolve } from 'path';
import { ValidationPipe } from '@nestjs/common';

config({ path: resolve(__dirname, '../.env') });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 啟用全域驗證管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 自動過濾掉 DTO 中未定義的屬性
      forbidNonWhitelisted: false, // 改為 false，避免過於嚴格
      transform: true, // 自動轉換類型
      transformOptions: {
        enableImplicitConversion: true, // 啟用隱式類型轉換
      },
    }),
  );
  
  // 啟用 CORS
  app.enableCors({
    origin: true, // 開發環境允許所有來源
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  
  console.log('✅ CORS 已啟用，允許所有來源');
  
  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 應用程式運行在 http://localhost:${process.env.PORT ?? 3000}`);
}
bootstrap();
