import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GROQ_API_KEY;
const defaultModel = process.env.GROQ_MODEL || '';
const rateLimitConfig = {
  maxRequestsPerMinute: parseInt(process.env.GROQ_RATE_LIMIT || '60', 10),
  requestTimestamps: [] as number[],
};

const checkRateLimit = (): boolean => {
  const now = Date.now();
  const oneMinuteAgo = now - 60 * 1000;
  rateLimitConfig.requestTimestamps = rateLimitConfig.requestTimestamps.filter(
    timestamp => timestamp > oneMinuteAgo
  );
  return rateLimitConfig.requestTimestamps.length < rateLimitConfig.maxRequestsPerMinute;
};

const recordRequest = (): void => {
  rateLimitConfig.requestTimestamps.push(Date.now());
};

const generateCompletion = async (
  prompt: string,
  options: {
    model?: string;
    maxTokens?: number;
    temperature?: number;
    topP?: number;
    stream?: boolean;
  } = {}
) => {
  if (!checkRateLimit()) {
    throw new Error('Rate limit exceeded. Please try again later.');
  }
  recordRequest();
  const client = new Groq({ apiKey });
  try {
    const response = await client.chat.completions.create({
      model: options.model || defaultModel,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: options.maxTokens,
      temperature: options.temperature,
      top_p: options.topP,
      stream: options.stream,
    });
    return response;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Groq API Error:', error);
      throw new Error(`Error generating completion: ${error.message}`);
    }
    console.error('Unknown error in Groq service:', error);
    throw new Error('An unknown error occurred while generating completion');
  }
};

const generateEmbeddings = async (input: string | string[], model?: string) => {
  if (!checkRateLimit()) {
    throw new Error('Rate limit exceeded. Please try again later.');
  }
  recordRequest();
  const client = new Groq({ apiKey });
  try {
    const response = await client.embeddings.create({
      model: model || 'embed-english-v1.0',
      input,
    });
    return response;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Groq API Error:', error);
      throw new Error(`Error generating embeddings: ${error.message}`);
    }
    console.error('Unknown error in Groq service:', error);
    throw new Error('An unknown error occurred while generating embeddings');
  }
};

export { generateCompletion, generateEmbeddings };