import React, { useState } from 'react';
import axios from 'axios';
import { PromptTemplate } from '../../types/promptTemplate';

interface VersionPerformanceProps {
  template: PromptTemplate;
  versionId: string;
  onSubmit: () => void;
  onCancel: () => void;
}

const VersionPerformance: React.FC<VersionPerformanceProps> = ({
  template,
  versionId,
  onSubmit,
  onCancel,
}) => {
  // Form state
  const [successRate, setSuccessRate] = useState<number>(0);
  const [avgResponseTime, setAvgResponseTime] = useState<number>(0);
  const [userRating, setUserRating] = useState<number>(0);
  const [sampleSize, setSampleSize] = useState<number>(0);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const performanceData = {
        successRate,
        avgResponseTime,
        userRating,
        sampleSize,
      };

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/prompt-templates/${template._id}/versions/${versionId}/performance`,
        performanceData
      );

      if (response.data.success) {
        onSubmit();
      } else {
        setError(response.data.message || 'Failed to update performance metrics');
      }
    } catch (err) {
      setError('An error occurred while updating performance metrics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Update Performance Metrics
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-4">
            <p className="text-gray-600 dark:text-gray-300">
              Version: <span className="font-medium">{versionId}</span>
            </p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Success Rate */}
              <div>
                <label htmlFor="successRate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Success Rate (%)
                </label>
                <input
                  type="number"
                  id="successRate"
                  value={successRate}
                  onChange={(e) => setSuccessRate(Number(e.target.value))}
                  min="0"
                  max="100"
                  step="0.1"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              {/* Average Response Time */}
              <div>
                <label htmlFor="avgResponseTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Average Response Time (ms)
                </label>
                <input
                  type="number"
                  id="avgResponseTime"
                  value={avgResponseTime}
                  onChange={(e) => setAvgResponseTime(Number(e.target.value))}
                  min="0"
                  step="1"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              {/* User Rating */}
              <div>
                <label htmlFor="userRating" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  User Rating (0-5)
                </label>
                <input
                  type="number"
                  id="userRating"
                  value={userRating}
                  onChange={(e) => setUserRating(Number(e.target.value))}
                  min="0"
                  max="5"
                  step="0.1"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              {/* Sample Size */}
              <div>
                <label htmlFor="sampleSize" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Sample Size
                </label>
                <input
                  type="number"
                  id="sampleSize"
                  value={sampleSize}
                  onChange={(e) => setSampleSize(Number(e.target.value))}
                  min="0"
                  step="1"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={onCancel}
                  className="mr-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </span>
                  ) : (
                    'Update Metrics'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VersionPerformance; 