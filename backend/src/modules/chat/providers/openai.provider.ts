import { Injectable } from "@nestjs/common";
import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

@Injectable()
export class OpenAIProvider {
  private client: OpenAI | null = null;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      this.client = new OpenAI({
        apiKey: apiKey,
      });
    } else {
      console.warn('⚠️  OPENAI_API_KEY 未設置，聊天功能將無法使用');
    }
  }

  async chat(messages: ChatCompletionMessageParam[], model = 'gpt-4o-mini') {
    if (!this.client) {
      throw new Error('OpenAI API Key 未設置，請在 .env 文件中設置 OPENAI_API_KEY');
    }
    
    const response = await this.client.chat.completions.create({
      model,
      messages,
      temperature: 0.7,
    });
    return {
        text: response.choices[0].message.content || '',
        tokens: response.usage?.total_tokens ?? 0,
    };
  }
}