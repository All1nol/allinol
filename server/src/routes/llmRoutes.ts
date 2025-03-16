import express from 'express';
import { generateCompletion, generateEmbeddings } from '../controllers/llmController';
import { getPromptVersion } from '../models/PromptTemplate';

const router = express.Router();

/**
 * @route POST /api/llm/completion
 * @desc Generate a completion using the Groq API
 * @access Private
 */
router.post('/completion', generateCompletion);

/**
 * @route POST /api/llm/embeddings
 * @desc Generate embeddings using the Groq API
 * @access Private
 */
router.post('/embeddings', generateEmbeddings);

export default router; 