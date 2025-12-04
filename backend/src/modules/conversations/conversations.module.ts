import { Module } from "@nestjs/common";
import { ConversationsController } from "./conversations.controller";
import { ConversationsService } from "./conversations.service";
import { PrismaService } from "src/prisma/prisma.service";
@Module({
  imports: [PrismaService],
  controllers: [ConversationsController],
  providers: [ConversationsService],
  exports: [ConversationsService],
})
export class ConversationsModule {}
