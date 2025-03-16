import React, { useState, useMemo } from 'react';
import adminPromptTemplates, { PromptTemplate } from '../../data/adminPromptTemplates';
import Button from '../ui/Button';

interface AdminPromptSelectorProps {
  onSelectPrompt: (prompt: string) => void;
}

const AdminPromptSelector: React.FC<AdminPromptSelectorProps> = ({ onSelectPrompt }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null);
  const [customizedPrompt, setCustomizedPrompt] = useState('');

  // Get unique categories for the filter
  const categories = useMemo(() => {
    const cats = new Set(adminPromptTemplates.map(template => template.category));
    return ['all', ...Array.from(cats)];
  }, []);

  // Filter templates based on category and search query
  const filteredTemplates = useMemo(() => {
    return adminPromptTemplates.filter(template => {
      const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
      const matchesSearch = searchQuery === '' || 
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Handle template selection
  const handleSelectTemplate = (template: PromptTemplate) => {
    setSelectedTemplate(template);
    setCustomizedPrompt(template.template);
  };

  // Handle using the selected prompt
  const handleUsePrompt = () => {
    onSelectPrompt(customizedPrompt);
    setIsOpen(false);
    setSelectedTemplate(null);
    setCustomizedPrompt('');
  };

  if (!isOpen) {
    return (
      <Button 
        type="button" 
        variant="secondary" 
        size="sm"
        onClick={() => setIsOpen(true)}
        className="mb-2"
      >
        <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        Admin Templates
      </Button>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-md p-4 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">Admin Prompt Templates</h3>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          <span className="sr-only">Close</span>
        </button>
      </div>

      {/* Search and filter */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm pl-8"
          />
          <svg className="w-4 h-4 absolute left-2.5 top-2.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {selectedTemplate ? (
        // Template customization view
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{selectedTemplate.name}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{selectedTemplate.description}</p>
            <textarea
              value={customizedPrompt}
              onChange={(e) => setCustomizedPrompt(e.target.value)}
              className="w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
              rows={4}
              placeholder="Customize the prompt template..."
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Replace placeholders like [DEPARTMENT] with specific information.
            </p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setSelectedTemplate(null)}
            >
              Back to Templates
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleUsePrompt}
            >
              Use Prompt
            </Button>
          </div>
        </div>
      ) : (
        // Template selection view
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
          {filteredTemplates.length > 0 ? (
            filteredTemplates.map(template => (
              <div
                key={template.id}
                onClick={() => handleSelectTemplate(template)}
                className="p-2 border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors"
              >
                <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200">{template.name}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{template.description}</p>
                <div className="mt-1">
                  <span className="inline-block text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full">
                    {template.category}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-4 text-slate-500 dark:text-slate-400">
              No templates found matching your criteria.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPromptSelector; 