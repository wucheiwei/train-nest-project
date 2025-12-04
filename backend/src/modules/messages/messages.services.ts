import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateMessageDto } from "./dto/create-message.dto";
import { MessageRole } from "@prisma/client";

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateMessageDto) {
    return this.prisma.messages.create({
      data: dto,
    });
  }

  createUserMessage(conversationId: number, content: string) {
    return this.prisma.messages.create({
      data: {
        conversationId,
        role: MessageRole.user,
        content,
      },
    });
  }
  createAssistantMessage(conversationId: number, content: string, tokens: number) {
    return this.prisma.messages.create({
      data: {
        conversationId,
        role: MessageRole.assistant,
        content,
        tokens,
      },
    });
  }
  findByConversation(conversationId: number) {
    return this.prisma.messages.findMany({
      where: {
        conversationId,
      },
      orderBy: {
        id: "asc",
      },
    });
  }

  getLatest(conversationId: number, limit = 15) {
    return this.prisma.messages.findMany({
      where: {
        conversationId,
      },
      orderBy: {
        id: "desc",
      },
      take: limit,
    })
  }
}