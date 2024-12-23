import OpenAI from 'openai';
import { OPENAI_API_KEY } from '../../config/env';

export const openaiClient = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});