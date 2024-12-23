export const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error('OpenAI API key is not set. Please set VITE_OPENAI_API_KEY in your environment.');
}