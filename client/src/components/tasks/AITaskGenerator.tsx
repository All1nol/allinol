import React, { useState } from 'react';
import llmService from '../../services/llmService';
import Button from '../ui/Button';
import { Task } from '../../api/taskApi';
import AdminPromptSelector from './AdminPromptSelector';

interface AITaskGeneratorProps {
  onTaskGenerated: (task: Partial<Task>) => void;
}

const AITaskGenerator: React.FC<AITaskGeneratorProps> = ({ onTaskGenerated }) => {
  const [showAiPromptInput, setShowAiPromptInput] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGeneratingTask, setIsGeneratingTask] = useState(false);

  // AI-powered task generation from prompt
  const generateTaskFromPrompt = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsGeneratingTask(true);
    try {
      const prompt = `Create a detailed task based on this request: "${aiPrompt}". 
      Return a JSON object with the following fields:
      - title: A clear, concise title for the task
      - description: A detailed description of what needs to be done
      - category: One of [development, design, marketing, management, other]
      - priority: One of [low, medium, high, urgent]
      - tags: An array of relevant tags (max 5)
      
      IMPORTANT: Return ONLY the raw JSON object without any markdown formatting, code blocks, or additional text.`;
      
      const response = await llmService.generateCompletion(prompt, {
        temperature: 0.7,
        maxTokens: 500,
      });
      
      try {
        let contentToParse = response.choices[0].message.content;
        
        // Handle markdown code blocks if present
        if (contentToParse.includes('```json')) {
          // Extract JSON content from markdown code block
          const jsonMatch = contentToParse.match(/```json\s*([\s\S]*?)\s*```/);
          if (jsonMatch && jsonMatch[1]) {
            contentToParse = jsonMatch[1];
          }
        }
        
        // Remove any BOM or invisible characters that might be present
        contentToParse = contentToParse.trim();
        
        const generatedTask = JSON.parse(contentToParse);
        onTaskGenerated(generatedTask);
        setShowAiPromptInput(false);
      } catch (error) {
        console.error('Failed to parse AI response:', error);
        // If parsing fails, at least use the response for the description
        onTaskGenerated({
          description: response.choices[0].message.content,
        });
      }
    } catch (error) {
      console.error('Failed to generate task:', error);
    } finally {
      setIsGeneratingTask(false);
    }
  };

  // Handle selecting a prompt from the admin templates
  const handleSelectPrompt = (prompt: string) => {
    setAiPrompt(prompt);
    setShowAiPromptInput(true);
  };

  return (
    <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">AI-Powered Task Creation</h3>
        <button
          type="button"
          onClick={() => setShowAiPromptInput(!showAiPromptInput)}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
        >
          {showAiPromptInput ? 'Hide' : 'Show'}
        </button>
      </div>
      
      {showAiPromptInput && (
        <div className="mt-3 space-y-3">
          <p className="text-xs text-blue-700 dark:text-blue-400">
            Describe what you want to accomplish, and AI will create a task for you.
          </p>
          
          {/* Admin Prompt Templates Selector */}
          <AdminPromptSelector onSelectPrompt={handleSelectPrompt} />
          
          <div className="flex space-x-2">
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="E.g., Create a marketing campaign for our new product launch"
              className="flex-1 rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
            />
            <Button
              type="button"
              onClick={generateTaskFromPrompt}
              disabled={isGeneratingTask || !aiPrompt.trim()}
              isLoading={isGeneratingTask}
            >
              Generate Task
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AITaskGenerator; 