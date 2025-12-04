import { Injectable, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateConversationDto } from "./dto/create-conversation.dto";

@Injectable()
export class ConversationsService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateConversationDto, userId: number) {
    return this.prisma.conversations.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  findAll(userId: number) {
    return this.prisma.conversations.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findOne(userId: number, convId: number) {
    const conversation = await this.prisma.conversations.findUnique({
      where: {
        id: convId,
      },
    });
    if (!conversation || conversation.userId !== userId) {
      throw new ForbiddenException("Conversation not found or unauthorized");
    }
    return conversation;
  }
}