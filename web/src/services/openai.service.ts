import OpenAI from 'openai';
import { OPENAI_API_KEY } from '../config/env';

class OpenAIService {
  private client: OpenAI | null = null;

  constructor() {
    if (OPENAI_API_KEY) {
      this.client = new OpenAI({
        apiKey: OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
      });
    }
  }

  async processShoppingText(text: string) {
    if (!this.client) {
      throw new Error('OpenAI client is not initialized. Please check your API key.');
    }

    try {
      const response = await this.client.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Du bist ein Einkaufsassistent. Extrahiere Produkte und ihre Mengen aus dem Text. Antworte im JSON-Format: [{name: string, quantity: number}]"
          },
          {
            role: "user",
            content: text
          }
        ]
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      try {
        return JSON.parse(content);
      } catch (parseError) {
        console.error('Failed to parse OpenAI response:', content);
        throw new Error('Invalid response format from OpenAI');
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('OpenAI API error:', error.message);
        throw error;
      }
      throw new Error('Unknown error occurred');
    }
  }
}

export const openAIService = new OpenAIService();