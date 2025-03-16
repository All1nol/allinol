import React, { useState } from 'react';
import { llmService } from '../../services/llmService';

interface AIContentGeneratorProps {
  onContentGenerated: (content: string) => void;
  placeholder?: string;
  initialPrompt?: string;
  contentType?: string;
  maxLength?: number;
  className?: string;
}

const AIContentGenerator: React.FC<AIContentGeneratorProps> = ({
  onContentGenerated,
  placeholder = 'Describe what content you need...',
  initialPrompt = '',
  contentType = 'content',
  maxLength = 1000,
  className = '',
}) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [temperature, setTemperature] = useState(0.7);
  const [tone, setTone] = useState('professional');

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const handleTemperatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTemperature(parseFloat(e.target.value));
  };

  const handleToneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTone(e.target.value);
  };

  const generateContent = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      const fullPrompt = `Generate ${contentType} with the following requirements:
      
      ${prompt}
      
      Tone: ${tone}
      Maximum length: ${maxLength} characters
      
      Please provide well-structured, high-quality content that meets these requirements.`;

      const response = await llmService.generateCompletion(fullPrompt, {
        temperature,
        maxTokens: Math.min(2000, Math.ceil(maxLength / 4)), // Rough estimate of tokens based on characters
      });

      const generatedContent = response.choices[0].message.content;
      onContentGenerated(generatedContent);
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 ${className}`}>
      <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
        AI Content Generator
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
        Describe what you need, and AI will generate {contentType} for you.
      </p>

      <div className="space-y-4">
        <div>
          <textarea
            value={prompt}
            onChange={handlePromptChange}
            placeholder={placeholder}
            rows={4}
            className="w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
          </button>
        </div>

        {showAdvanced && (
          <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-md">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Tone
              </label>
              <select
                value={tone}
                onChange={handleToneChange}
                className="w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-slate-900 dark:text-white"
              >
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="friendly">Friendly</option>
                <option value="formal">Formal</option>
                <option value="technical">Technical</option>
                <option value="persuasive">Persuasive</option>
                <option value="enthusiastic">Enthusiastic</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Creativity (Temperature): {temperature}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={temperature}
                onChange={handleTemperatureChange}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
                <span>More Predictable</span>
                <span>More Creative</span>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={generateContent}
          disabled={!prompt.trim() || isGenerating}
          className={`w-full py-2 px-4 rounded-md ${
            !prompt.trim() || isGenerating
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed dark:bg-slate-600 dark:text-slate-400'
              : 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700'
          } transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
        >
          {isGenerating ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Generating...
            </div>
          ) : (
            `Generate ${contentType}`
          )}
        </button>
      </div>
    </div>
  );
};

export default AIContentGenerator; 