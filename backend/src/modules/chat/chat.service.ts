import { Injectable, ForbiddenException, BadGatewayException } from "@nestjs/common";
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
    
    try {
      const ai = await this.openai.chat(formatted, conversation.model);
      await this.messages.createAssistantMessage(conversationId, ai.text || '', ai.tokens);
      return ai;
    } catch (error: any) {
      // 處理 OpenAI API 錯誤
      if (error?.code === 'insufficient_quota' || error?.status === 429) {
        throw new BadGatewayException({
          message: 'OpenAI API 配額已用完，請檢查您的帳戶配額和付款方式',
          code: 'INSUFFICIENT_QUOTA',
          details: '您已超過當前配額，請檢查您的方案和帳單詳情。如需更多資訊，請查看：https://platform.openai.com/docs/guides/error-codes/api-errors'
        });
      }
      if (error?.status === 401) {
        throw new BadGatewayException({
          message: 'OpenAI API Key 無效或已過期',
          code: 'INVALID_API_KEY',
        });
      }
      if (error?.status === 429 && error?.type === 'rate_limit_error') {
        throw new BadGatewayException({
          message: '請求過於頻繁，請稍後再試',
          code: 'RATE_LIMIT',
        });
      }
      // 其他錯誤
      throw new BadGatewayException({
        message: error?.message || 'AI 服務暫時無法使用，請稍後再試',
        code: 'OPENAI_ERROR',
        details: error?.error?.message,
      });
    }
  }
}