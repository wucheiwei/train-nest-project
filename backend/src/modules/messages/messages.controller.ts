import { Controller, Post, Get, Param, UseGuards, Body } from "@nestjs/common";
import { CreateMessageDto } from "./dto/create-message.dto";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";
import { MessagesService } from "./messages.services";

@Controller("messages")
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('conversation/:converstionId')
  findAll(@Param('converstionId') conversationId: string) {
    return this.messagesService.findByConversation(Number(conversationId));
  }

  @Post()
  create(@Body() dto: CreateMessageDto) {
    return this.messagesService.create(dto);
  }
}