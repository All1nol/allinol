import React, { useState } from 'react';
import AIWorkflowOptimizer from '../components/ui/AIWorkflowOptimizer';
import AIContentGenerator from '../components/ui/AIContentGenerator';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  category: string;
}

const AIWorkflowPage: React.FC = () => {
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [currentChallenges, setCurrentChallenges] = useState('');
  const [goals, setGoals] = useState('');
  const [_recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [generatedContent, setGeneratedContent] = useState('');
  const [activeTab, setActiveTab] = useState<'optimizer' | 'content'>('optimizer');

  const handleRecommendationsGenerated = (newRecommendations: Recommendation[]) => {
    setRecommendations(newRecommendations);
  };

  const handleContentGenerated = (content: string) => {
    setGeneratedContent(content);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">AI Workflow Tools</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('optimizer')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'optimizer'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200'
            }`}
          >
            Workflow Optimizer
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'content'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200'
            }`}
          >
            Content Generator
          </button>
        </div>
      </div>

      {activeTab === 'optimizer' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              Workflow Information
            </h2>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="workflowDescription"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                >
                  Workflow Description*
                </label>
                <textarea
                  id="workflowDescription"
                  value={workflowDescription}
                  onChange={(e) => setWorkflowDescription(e.target.value)}
                  rows={5}
                  className="w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-slate-900 dark:text-white"
                  placeholder="Describe your current workflow process in detail..."
                />
              </div>

              <div>
                <label
                  htmlFor="currentChallenges"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                >
                  Current Challenges (Optional)
                </label>
                <textarea
                  id="currentChallenges"
                  value={currentChallenges}
                  onChange={(e) => setCurrentChallenges(e.target.value)}
                  rows={3}
                  className="w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-slate-900 dark:text-white"
                  placeholder="What challenges or bottlenecks are you facing with this workflow?"
                />
              </div>

              <div>
                <label
                  htmlFor="goals"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                >
                  Goals (Optional)
                </label>
                <textarea
                  id="goals"
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  rows={3}
                  className="w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-slate-900 dark:text-white"
                  placeholder="What are your goals for optimizing this workflow?"
                />
              </div>
            </div>
          </div>

          <div>
            <AIWorkflowOptimizer
              workflowDescription={workflowDescription}
              currentChallenges={currentChallenges}
              goals={goals}
              onRecommendationsGenerated={handleRecommendationsGenerated}
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <AIContentGenerator
              onContentGenerated={handleContentGenerated}
              contentType="workflow documentation"
              placeholder="Describe the workflow you need documentation for..."
              maxLength={2000}
            />
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              Generated Content
            </h2>
            {generatedContent ? (
              <div className="prose dark:prose-invert max-w-none">
                <div className="whitespace-pre-wrap">{generatedContent}</div>
              </div>
            ) : (
              <div className="text-slate-500 dark:text-slate-400 italic">
                Generated content will appear here...
              </div>
            )}
            {generatedContent && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedContent);
                  }}
                  className="px-3 py-1 bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200 rounded-md text-sm hover:bg-slate-300 dark:hover:bg-slate-600"
                >
                  Copy to Clipboard
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIWorkflowPage; 