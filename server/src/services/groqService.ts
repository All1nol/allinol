import Groq from 'groq-sdk';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Rate limiting configuration
interface RateLimitConfig {
  maxRequestsPerMinute: number;
  requestTimestamps: number[];
}

class GroqService {
  private client: Groq;
  private rateLimit: RateLimitConfig;
  private defaultModel: string;

  constructor() {
    const apiKey = process.env.GROQ_API_KEY;
    
    if (!apiKey) {
      throw new Error('GROQ_API_KEY is not defined in environment variables');
    }

    this.client = new Groq({ apiKey });

    this.defaultModel = process.env.GROQ_MODEL || '';
    
    // Initialize rate limiting
    this.rateLimit = {
      maxRequestsPerMinute: parseInt(process.env.GROQ_RATE_LIMIT || '60', 10),
      requestTimestamps: [],
    };
  }

  /**
   * Check if the request is within rate limits
   * @returns boolean indicating if the request can proceed
   */
  private checkRateLimit(): boolean {
    const now = Date.now();
    const oneMinuteAgo = now - 60 * 1000;
    
    // Remove timestamps older than 1 minute
    this.rateLimit.requestTimestamps = this.rateLimit.requestTimestamps.filter(
      timestamp => timestamp > oneMinuteAgo
    );
    
    // Check if we're under the limit
    return this.rateLimit.requestTimestamps.length < this.rateLimit.maxRequestsPerMinute;
  }

  /**
   * Record a new request for rate limiting
   */
  private recordRequest(): void {
    this.rateLimit.requestTimestamps.push(Date.now());
  }

  /**
   * Generate a completion using the Groq API
   * @param prompt The prompt to send to the model
   * @param options Optional parameters for the completion
   * @returns The model's response
   */
  async generateCompletion(
    prompt: string,
    options: {
      model?: string;
      maxTokens?: number;
      temperature?: number;
      topP?: number;
      stream?: boolean;
    } = {}
  ) {
    try {
      // Check rate limit
      if (!this.checkRateLimit()) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      
      // Record this request
      this.recordRequest();
      
      const response = await this.client.chat.completions.create({
        model: options.model || this.defaultModel,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: options.maxTokens,
        temperature: options.temperature,
        top_p: options.topP,
        stream: options.stream,
      });
      
      return response;
    } catch (error) {
      // Handle different types of errors
      if (error instanceof Error) {
        if (error.message.includes('Rate limit')) {
          throw error; // Re-throw rate limit errors
        }
        
        // Handle API errors
        console.error('Groq API Error:', error);
        throw new Error(`Error generating completion: ${error.message}`);
      }
      
      // Handle unknown errors
      console.error('Unknown error in Groq service:', error);
      throw new Error('An unknown error occurred while generating completion');
    }
  }

  /**
   * Generate embeddings using the Groq API
   * @param input The text to generate embeddings for
   * @param model Optional model to use for embeddings
   * @returns The generated embeddings
   */
  async generateEmbeddings(input: string | string[], model?: string) {
    try {
      // Check rate limit
      if (!this.checkRateLimit()) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      
      // Record this request
      this.recordRequest();
      
      const response = await this.client.embeddings.create({
        model: model || 'embed-english-v1.0',
        input,
      });
      
      return response;
    } catch (error) {
      // Handle different types of errors
      if (error instanceof Error) {
        if (error.message.includes('Rate limit')) {
          throw error; // Re-throw rate limit errors
        }
        
        // Handle API errors
        console.error('Groq API Error:', error);
        throw new Error(`Error generating embeddings: ${error.message}`);
      }
      
      // Handle unknown errors
      console.error('Unknown error in Groq service:', error);
      throw new Error('An unknown error occurred while generating embeddings');
    }
  }
}

export default new GroqService(); 