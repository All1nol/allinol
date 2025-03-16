import { llmService } from '../services/llmService';

/**
 * Utility function to test the AI integration
 * This can be called from the browser console to verify that the AI integration is working
 */
export const testAI = async () => {
  console.log('Testing AI integration...');
  
  try {
    // Test completion
    console.log('Testing completion...');
    const completionResponse = await llmService.generateCompletion(
      'Hello, can you tell me what Allinol is?',
      {
        temperature: 0.7,
        maxTokens: 100,
      }
    );
    console.log('Completion response:', completionResponse);
    
    // Test embeddings
    console.log('Testing embeddings...');
    const embeddingsResponse = await llmService.generateEmbeddings(
      'This is a test of the embeddings API'
    );
    console.log('Embeddings response:', embeddingsResponse);
    
    console.log('AI integration tests completed successfully!');
    return {
      success: true,
      completion: completionResponse,
      embeddings: embeddingsResponse,
    };
  } catch (error) {
    console.error('AI integration test failed:', error);
    return {
      success: false,
      error,
    };
  }
};

// Make it available in the window object for easy testing from the console
if (typeof window !== 'undefined') {
  (window as any).testAI = testAI;
}

export default testAI; 