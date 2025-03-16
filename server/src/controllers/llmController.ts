import { Request, Response } from 'express';
import { generateCompletion as generateCompletionService, generateEmbeddings as generateEmbeddingsService } from '../services/groqService';

/**
 * Generate a completion using the Groq API
 * @param req Request object
 * @param res Response object
 */
export const generateCompletion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { prompt, model, maxTokens, temperature, topP } = req.body;

    if (!prompt) {
      res.status(400).json({ error: 'Prompt is required' });
      return;
    }

    const response = await generateCompletionService(prompt, {
      model,
      maxTokens,
      temperature,
      topP,
    });

    res.status(200).json(response);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Rate limit')) {
        res.status(429).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'An unknown error occurred' });
  }
};

/**
 * Generate embeddings using the Groq API
 * @param req Request object
 * @param res Response object
 */
export const generateEmbeddings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { input, model } = req.body;

    if (!input) {
      res.status(400).json({ error: 'Input is required' });
      return;
    }

    const response = await generateEmbeddingsService(input, model);

    res.status(200).json(response); 
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Rate limit')) {
        res.status(429).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'An unknown error occurred' });
  }
}; 