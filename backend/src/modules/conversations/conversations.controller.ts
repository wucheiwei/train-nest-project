import { Controller, Post, Get, Param, UseGuards, Body } from "@nestjs/common";
import { ConversationsService } from "./conversations.service";
import { CreateConversationDto } from "./dto/create-conversation.dto";
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { GetUser } from "../auth/decorators/get-user.decorator";
@Controller("conversations")
@UseGuards(JwtAuthGuard)
export class ConversationsController {
  constructor(private conversationsService: ConversationsService) {}

  @Post()
  async create(@GetUser('id') userId: number, @Body() createConversationDto: CreateConversationDto) {
    return this.conversationsService.create(createConversationDto, userId);
  }

  @Get()
  findMy(@GetUser('id') userId: number) {
    return this.conversationsService.findAll(userId);
  }

  @Get(':id')
  findOne(@GetUser('id') userId: number, @Param('id') convId: number) {
    return this.conversationsService.findOne(userId, convId);
  }
}