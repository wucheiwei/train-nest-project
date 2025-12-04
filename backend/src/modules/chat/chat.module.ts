import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { MessagesModule } from '../messages/messages.module';
import { ConversationsModule } from '../conversations/conversations.module';
import {OpenAIProvider} from './providers/openai.provider';

@Module({
  imports: [ConversationsModule, MessagesModule],
  controllers: [ChatController],
  providers: [ChatService, OpenAIProvider],
  exports: [ChatService],
})
export class ChatModule {}

