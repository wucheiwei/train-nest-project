import { Controller, Post, Body, UseGuards } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { GetUser } from "../auth/decorators/get-user.decorator";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chat: ChatService) {}

  @Post('send')
  sendMessage(@GetUser('id') userId: number, @Body() dto: { conversationId: number, message: string }) {
    return this.chat.sendMessage(userId, dto.conversationId, dto.message);
  }
}