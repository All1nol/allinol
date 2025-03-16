import axios from 'axios';

// In a React app, environment variables are typically accessed via import.meta.env or window.env
const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Service for interacting with the LLM API endpoints
 */
export const llmService = {
  /**
   * Generate a completion using the Groq API
   * @param prompt The prompt to send to the model
   * @param options Optional parameters for the completion
   * @returns The model's response
   */
  generateCompletion: async (
    prompt: string,
    options: {
      model?: string;
      maxTokens?: number;
      temperature?: number;
      topP?: number;
      stop?: string[];
    } = {}
  ) => {
    try {
      const response = await axios.post(
        `${API_URL}/llm/completion`,
        {
          prompt,
          ...options,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error generating completion:', error);
      throw error;
    }
  },

  /**
   * Generate embeddings using the Groq API
   * @param input The text to generate embeddings for
   * @param model Optional model to use for embeddings
   * @returns The generated embeddings
   */
  generateEmbeddings: async (input: string | string[], model?: string) => {
    try {
      const response = await axios.post(`${API_URL}/llm/embeddings`, {
        input,
        model,
      });
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.error || 'Failed to generate embeddings');
      }
      throw new Error('Failed to connect to the server');
    }
  },
}; 