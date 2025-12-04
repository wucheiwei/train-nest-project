import { Controller, Post, Get, Param, UseGuards, Body } from "@nestjs/common";
import { ConversationsService } from "./conversations.service";
import { CreateConversationDto } from "./dto/create-conversation.dto";
import { JwtAuthGuard  } from 'src/auth/jwt.guard';
import { GetUser } from "../auth/decorators/get-user.decorator";
@Controller("conversations")
@UseGuards(JwtAuthGuard)
export class ConversationsController {
  constructor(private conversationsService: ConversationsService) {}

  @Post()
  create(@GetUser('id') userId: number, @Body() createConversationDto: CreateConversationDto) {
    return this.conversationsService.create({
      ...createConversationDto,
      userId,
    });
  }
}