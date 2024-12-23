import { openaiClient } from './openai/config';
import { STORE_RECOMMENDATION_PROMPT } from './openai/prompts';

class RecommendationsService {
  async getRecommendations(product: string, location: string) {
    if (!product || !location) {
      throw new Error('Product and location are required');
    }

    console.log(`Fetching recommendations for ${product} near ${location}`);

    try {
      const response = await openaiClient.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: STORE_RECOMMENDATION_PROMPT
          },
          {
            function name(params:type) {
              
            },
            role: "user",
            content: `I'm looking for "${product}" near ${location}. Please provide detailed information about the 3 best stores where I can buy this product, including current prices and availability.`
          }
        ],
        temperature: 0.1, // Very low temperature for more factual responses
        max_tokens: 1500,
        presence_penalty: -0.5, // Encourage focused responses
        frequency_penalty: 0.3, // Reduce repetition
      });

      const content = response.choices[0]?.message?.content;
      
      if (!content) {
        console.error('No content in OpenAI response');
        throw new Error('Keine Empfehlungen verfügbar');
      }

      console.log('Recommendations received:', content);
      return content;

    } catch (error: any) {
      console.error('OpenAI API error:', error);
      
      if (error?.response?.status === 429) {
        throw new Error('Zu viele Anfragen. Bitte versuchen Sie es später erneut.');
      }
      
      if (error?.response?.status === 401) {
        throw new Error('API-Authentifizierungsfehler. Bitte kontaktieren Sie den Support.');
      }

      throw new Error('Konnte keine Empfehlungen abrufen. Bitte versuchen Sie es später erneut.');
    }
  }
}

export const recommendationsService = new RecommendationsService();