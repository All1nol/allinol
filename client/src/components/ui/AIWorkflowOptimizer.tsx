import React, { useState } from 'react';
import { llmService } from '../../services/llmService';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  category: string;
}

interface AIWorkflowOptimizerProps {
  workflowDescription: string;
  currentChallenges?: string;
  goals?: string;
  onRecommendationsGenerated?: (recommendations: Recommendation[]) => void;
  className?: string;
}

const AIWorkflowOptimizer: React.FC<AIWorkflowOptimizerProps> = ({
  workflowDescription,
  currentChallenges = '',
  goals = '',
  onRecommendationsGenerated,
  className = '',
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [error, setError] = useState<string | null>(null);

  const generateRecommendations = async () => {
    if (isGenerating || !workflowDescription.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      const prompt = `Analyze the following workflow and provide optimization recommendations:
      
      WORKFLOW DESCRIPTION:
      ${workflowDescription}
      
      ${currentChallenges ? `CURRENT CHALLENGES:\n${currentChallenges}\n` : ''}
      ${goals ? `GOALS:\n${goals}\n` : ''}
      
      Please provide 3-5 specific, actionable recommendations to optimize this workflow.
      For each recommendation, include:
      1. A clear title
      2. A detailed description of the recommendation
      3. The expected impact (high, medium, or low)
      4. The implementation effort required (high, medium, or low)
      5. A category (e.g., automation, process redesign, tool integration, etc.)
      
      Format your response as a JSON array of recommendations with the following structure:
      [
        {
          "id": "1",
          "title": "Recommendation title",
          "description": "Detailed description",
          "impact": "high|medium|low",
          "effort": "high|medium|low",
          "category": "category name"
        },
        ...
      ]`;

      const response = await llmService.generateCompletion(prompt, {
        temperature: 0.7,
        maxTokens: 1500,
      });

      try {
        const parsedRecommendations = JSON.parse(response.choices[0].message.content);
        if (Array.isArray(parsedRecommendations)) {
          setRecommendations(parsedRecommendations);
          if (onRecommendationsGenerated) {
            onRecommendationsGenerated(parsedRecommendations);
          }
        } else {
          throw new Error('Response is not an array');
        }
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError);
        setError('Failed to parse the AI recommendations. Please try again.');
      }
    } catch (apiError) {
      console.error('Error generating recommendations:', apiError);
      setError('An error occurred while generating recommendations. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'high':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'low':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 ${className}`}>
      <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
        AI Workflow Optimizer
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
        Get AI-powered recommendations to optimize your workflow.
      </p>

      <div className="space-y-4">
        <button
          onClick={generateRecommendations}
          disabled={isGenerating || !workflowDescription.trim()}
          className={`w-full py-2 px-4 rounded-md ${
            isGenerating || !workflowDescription.trim()
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
              Analyzing Workflow...
            </div>
          ) : (
            'Generate Optimization Recommendations'
          )}
        </button>

        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-md dark:bg-red-900/50 dark:text-red-300">
            {error}
          </div>
        )}

        {recommendations.length > 0 && (
          <div className="mt-6 space-y-6">
            <h4 className="text-md font-medium text-slate-800 dark:text-slate-200">
              Optimization Recommendations
            </h4>
            <div className="space-y-4">
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-slate-50 dark:bg-slate-800"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="text-md font-medium text-slate-900 dark:text-white">
                      {rec.title}
                    </h5>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                      {rec.category}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                    {rec.description}
                  </p>
                  <div className="flex space-x-2">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${getImpactColor(
                        rec.impact
                      )}`}
                    >
                      Impact: {rec.impact}
                    </span>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${getEffortColor(
                        rec.effort
                      )}`}
                    >
                      Effort: {rec.effort}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIWorkflowOptimizer; 