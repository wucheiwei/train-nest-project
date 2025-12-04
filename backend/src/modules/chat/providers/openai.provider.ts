import { Injectable } from "@nestjs/common";
import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

@Injectable()
export class OpenAIProvider {
  private client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async chat(messages: ChatCompletionMessageParam[], model = 'gpt-4o-mini') {
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