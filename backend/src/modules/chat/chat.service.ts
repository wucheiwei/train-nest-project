import { Injectable, ForbiddenException } from "@nestjs/common";
import { OpenAIProvider } from "./providers/openai.provider";
import { ConversationsService } from "../conversations/conversations.service";
import { MessagesService } from "../messages/messages.services";

@Injectable()
export class ChatService {
  constructor(
    private  openai: OpenAIProvider,
    private  conversations: ConversationsService,
    private  messages: MessagesService,
  ) {}

  async sendMessage(userId: number, conversationId: number, text: string) {
    const conversation = await this.conversations.findOne(userId, conversationId);
    if (!conversation) {
      throw new ForbiddenException('Unauthorized conversation');
    }
    await this.messages.createUserMessage(conversationId, text);
    const history = await this.messages.getLatest(conversationId,15);
    const formatted = history.reverse().map((m) => ({
      role: m.role,
      content: m.content,
    }));
    const ai = await this.openai.chat(formatted, conversation.model)
    await this.messages.createAssistantMessage(conversationId, ai.text || '', ai.tokens);
    return ai;
  }
}