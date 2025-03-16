import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PromptCategory } from '../../types/promptTemplate';

// This is a component you'll implement as a learning exercise
import PromptTemplateForm from '../../components/admin/PromptTemplateForm';
import PromptVersionForm from '../../components/admin/PromptVersionForm';
import VersionPerformance from '../../components/admin/VersionPerformance';

// Create a dedicated API instance with authentication
const createAuthenticatedApi = () => {
  const token = localStorage.getItem('token');
  return axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
  });
};

// Create the API instance
const api = createAuthenticatedApi();

interface PromptTemplate {
  _id: string;
  title: string;
  description: string;
  category: PromptCategory;
  tags: string[];
  isActive: boolean;
  createdBy: {
    _id: string;
    username: string;
  };
  currentVersion: number;
  versions: PromptVersion[];
  createdAt: string;
  updatedAt: string;
}

interface PromptVersion {
  version: number;
  content: string;
  description?: string;
  createdAt: string;
  createdBy: string;
  performance?: {
    successRate?: number;
    averageResponseTime?: number;
    userRating?: number;
    sampleSize?: number;
  };
}

interface PaginatedResponse {
  templates: PromptTemplate[];
  total: number;
  page: number;
  totalPages: number;
}

const PromptTemplates: React.FC = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isVersionFormOpen, setIsVersionFormOpen] = useState<boolean>(false);
  const [selectedVersion, setSelectedVersion] = useState<PromptVersion | null>(null);
  const [isPerformanceFormOpen, setIsPerformanceFormOpen] = useState<boolean>(false);
  const [categoryFilter, setCategoryFilter] = useState<PromptCategory | ''>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Fetch prompt templates
  const fetchTemplates = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let url = `/prompt-templates?page=${page}`;
      
      if (categoryFilter) {
        url += `&category=${categoryFilter}`;
      }
      
      if (searchTerm) {
        // In a real app, you might want to implement server-side search
        // For now, we'll just simulate it by filtering on the client
      }
      
      const response = await api.get<{ success: boolean; data: PaginatedResponse }>(url);
      
      if (response.data.success) {
        setTemplates(response.data.data.templates);
        setTotalPages(response.data.data.totalPages);
      } else {
        setError('Failed to fetch prompt templates');
      }
    } catch (err) {
      setError('An error occurred while fetching prompt templates');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchTemplates();
  }, [page, categoryFilter]);

  // Handle template selection
  const handleSelectTemplate = (template: PromptTemplate | null) => {
    setSelectedTemplate(template);
  };

  // Handle template creation/update
  const handleOpenForm = (template?: PromptTemplate) => {
    if (template) {
      setSelectedTemplate(template);
    } else {
      setSelectedTemplate(null);
    }
    setIsFormOpen(true);
  };

  // Handle form submission
  const handleFormSubmit = async () => {
    setIsFormOpen(false);
    await fetchTemplates();
  };

  // Handle version creation
  const handleOpenVersionForm = (template: PromptTemplate) => {
    setSelectedTemplate(template);
    setIsVersionFormOpen(true);
  };

  // Handle version form submission
  const handleVersionFormSubmit = async () => {
    setIsVersionFormOpen(false);
    if (selectedTemplate) {
      // Refetch the selected template to get the updated versions
      try {
        const response = await api.get<{ success: boolean; data: PromptTemplate }>(
          `/prompt-templates/${selectedTemplate._id}`
        );
        
        if (response.data.success) {
          setSelectedTemplate(response.data.data);
        }
      } catch (err) {
        console.error(err);
      }
    }
    await fetchTemplates();
  };

  // Handle performance update
  const handleOpenPerformanceForm = (template: PromptTemplate, version: PromptVersion) => {
    setSelectedTemplate(template);
    setSelectedVersion(version);
    setIsPerformanceFormOpen(true);
  };

  // Handle performance form submission
  const handlePerformanceFormSubmit = async () => {
    setIsPerformanceFormOpen(false);
    if (selectedTemplate) {
      // Refetch the selected template to get the updated performance metrics
      try {
        const response = await api.get<{ success: boolean; data: PromptTemplate }>(
          `/prompt-templates/${selectedTemplate._id}`
        );
        
        if (response.data.success) {
          setSelectedTemplate(response.data.data);
        }
      } catch (err) {
        console.error(err);
      }
    }
    await fetchTemplates();
  };

  // Handle template deletion
  const handleDeleteTemplate = async (templateId: string) => {
    if (window.confirm('Are you sure you want to delete this template? This action cannot be undone.')) {
      try {
        const response = await api.delete(
          `/prompt-templates/${templateId}`
        );
        
        if (response.data.success) {
          await fetchTemplates();
          if (selectedTemplate?._id === templateId) {
            setSelectedTemplate(null);
          }
        } else {
          setError('Failed to delete prompt template');
        }
      } catch (err) {
        setError('An error occurred while deleting the prompt template');
        console.error(err);
      }
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Render category badge
  const renderCategoryBadge = (category: PromptCategory) => {
    const categoryColors: Record<PromptCategory, string> = {
      content_generation: 'bg-blue-100 text-blue-800',
      planning: 'bg-green-100 text-green-800',
      analysis: 'bg-purple-100 text-purple-800',
      creative: 'bg-pink-100 text-pink-800',
      technical: 'bg-gray-100 text-gray-800',
      educational: 'bg-yellow-100 text-yellow-800',
      business: 'bg-indigo-100 text-indigo-800',
      other: 'bg-gray-100 text-gray-800',
    };

    const categoryLabels: Record<PromptCategory, string> = {
      content_generation: 'Content Generation',
      planning: 'Planning',
      analysis: 'Analysis',
      creative: 'Creative',
      technical: 'Technical',
      educational: 'Educational',
      business: 'Business',
      other: 'Other',
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryColors[category]}`}>
        {categoryLabels[category]}
      </span>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Prompt Templates</h1>
        <button
          onClick={() => handleOpenForm()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Create New Template
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="w-full md:w-64">
          <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Filter by Category
          </label>
          <select
            id="category-filter"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as PromptCategory | '')}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">All Categories</option>
            {Object.values(PromptCategory).map((category) => (
              <option key={category} value={category}>
                {category.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-64">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Search Templates
          </label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title or description"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Templates list */}
          {templates.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No prompt templates found.</p>
              <button
                onClick={() => handleOpenForm()}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Create Your First Template
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {templates
                .filter(template => 
                  searchTerm ? 
                    template.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    template.description.toLowerCase().includes(searchTerm.toLowerCase()) : 
                    true
                )
                .map((template) => (
                  <div
                    key={template._id}
                    className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border ${
                      selectedTemplate?._id === template._id
                        ? 'border-blue-500'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            {template.title}
                          </h2>
                          <div className="flex items-center space-x-2 mb-2">
                            {renderCategoryBadge(template.category)}
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              template.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {template.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 mb-4">
                            {template.description}
                          </p>
                          <div className="flex flex-wrap gap-1 mb-4">
                            {template.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            <p>Created by: {template.createdBy.username}</p>
                            <p>Created: {formatDate(template.createdAt)}</p>
                            <p>Last updated: {formatDate(template.updatedAt)}</p>
                            <p>Current version: {template.currentVersion}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleOpenForm(template)}
                            className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                            title="Edit template"
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleOpenVersionForm(template)}
                            className="p-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                            title="Add new version"
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteTemplate(template._id)}
                            className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                            title="Delete template"
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Toggle versions */}
                      <div className="mt-4">
                        <button
                          onClick={() => handleSelectTemplate(
                            selectedTemplate?._id === template._id ? null : template
                          )}
                          className="flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <span>{selectedTemplate?._id === template._id ? 'Hide' : 'Show'} Versions</span>
                          <svg
                            className={`ml-1 h-4 w-4 transform ${
                              selectedTemplate?._id === template._id ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>

                      {/* Versions */}
                      {selectedTemplate?._id === template._id && (
                        <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Versions</h3>
                          {template.versions.length === 0 ? (
                            <p className="text-gray-500 dark:text-gray-400">No versions found.</p>
                          ) : (
                            <div className="space-y-4">
                              {template.versions
                                .sort((a, b) => b.version - a.version)
                                .map((version) => (
                                  <div
                                    key={version.version}
                                    className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md"
                                  >
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <h4 className="text-md font-medium text-gray-900 dark:text-white">
                                          Version {version.version}
                                          {version.version === template.currentVersion && (
                                            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                              Current
                                            </span>
                                          )}
                                        </h4>
                                        {version.description && (
                                          <p className="text-gray-600 dark:text-gray-300 mt-1">
                                            {version.description}
                                          </p>
                                        )}
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                          Created: {formatDate(version.createdAt)}
                                        </p>
                                      </div>
                                      <button
                                        onClick={() => handleOpenPerformanceForm(template, version)}
                                        className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                        title="Update performance metrics"
                                      >
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                      </button>
                                    </div>
                                    <div className="mt-2">
                                      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md p-3 mt-2">
                                        <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                                          {version.content}
                                        </pre>
                                      </div>
                                    </div>
                                    {version.performance && (
                                      <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
                                        {version.performance.successRate !== undefined && (
                                          <div className="bg-white dark:bg-gray-800 p-2 rounded-md border border-gray-200 dark:border-gray-600">
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Success Rate</p>
                                            <p className="text-lg font-medium text-gray-900 dark:text-white">
                                              {version.performance.successRate}%
                                            </p>
                                          </div>
                                        )}
                                        {version.performance.averageResponseTime !== undefined && (
                                          <div className="bg-white dark:bg-gray-800 p-2 rounded-md border border-gray-200 dark:border-gray-600">
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Avg Response Time</p>
                                            <p className="text-lg font-medium text-gray-900 dark:text-white">
                                              {version.performance.averageResponseTime}ms
                                            </p>
                                          </div>
                                        )}
                                        {version.performance.userRating !== undefined && (
                                          <div className="bg-white dark:bg-gray-800 p-2 rounded-md border border-gray-200 dark:border-gray-600">
                                            <p className="text-xs text-gray-500 dark:text-gray-400">User Rating</p>
                                            <p className="text-lg font-medium text-gray-900 dark:text-white">
                                              {version.performance.userRating.toFixed(1)}/5
                                            </p>
                                          </div>
                                        )}
                                        {version.performance.sampleSize !== undefined && (
                                          <div className="bg-white dark:bg-gray-800 p-2 rounded-md border border-gray-200 dark:border-gray-600">
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Sample Size</p>
                                            <p className="text-lg font-medium text-gray-900 dark:text-white">
                                              {version.performance.sampleSize}
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className={`px-3 py-1 rounded-md ${
                    page === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  Previous
                </button>
                <div className="mx-4">
                  Page {page} of {totalPages}
                </div>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className={`px-3 py-1 rounded-md ${
                    page === totalPages
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      )}

      {/* Forms */}
      {isFormOpen && (
        <PromptTemplateForm
          template={selectedTemplate}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
        />
      )}

      {isVersionFormOpen && selectedTemplate && (
        <PromptVersionForm
          template={selectedTemplate}
          onCancel={() => setIsVersionFormOpen(false)}
          onSubmit={handleVersionFormSubmit}
        />
      )}

      {isPerformanceFormOpen && selectedTemplate && selectedVersion && (
        <VersionPerformance
          template={selectedTemplate}
          versionId={selectedVersion.version.toString()}
          onCancel={() => setIsPerformanceFormOpen(false)}
          onSubmit={handlePerformanceFormSubmit}
        />
      )}
    </div>
  );
};

export default PromptTemplates; 