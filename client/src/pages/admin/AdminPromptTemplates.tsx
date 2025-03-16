import React, { useState, useMemo } from 'react';
import adminPromptTemplates, { PromptTemplate } from '../../data/adminPromptTemplates';
import Button from '../../components/ui/Button';

const AdminPromptTemplates: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTemplate, setEditedTemplate] = useState<PromptTemplate | null>(null);

  // Get unique categories for the filter
  const categories = useMemo(() => {
    const cats = new Set(adminPromptTemplates.map(template => template.category));
    return ['all', ...Array.from(cats)];
  }, []);

  // Filter templates based on category and search query
  const filteredTemplates = useMemo(() => {
    return adminPromptTemplates.filter(template => {
      const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
      const matchesSearch = searchTerm === '' || 
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm]);

  // Handle template selection
  const handleSelectTemplate = (template: PromptTemplate) => {
    setSelectedTemplate(template);
    setIsEditing(false);
  };

  // Handle editing a template
  const handleEditTemplate = (template: PromptTemplate) => {
    setEditedTemplate({...template});
    setIsEditing(true);
  };

  // Handle template changes
  const handleTemplateChange = (field: keyof PromptTemplate, value: any) => {
    if (editedTemplate) {
      setEditedTemplate({
        ...editedTemplate,
        [field]: value
      });
    }
  };

  // Render category badge
  const renderCategoryBadge = (category: string) => {
    const categoryColors: Record<string, string> = {
      management: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      operations: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      hr: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      finance: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      it: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      general: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
      product: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryColors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </span>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Prompt Templates</h1>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        {/* Search and filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm pl-10"
            />
            <svg className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
                {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Templates List */}
          <div className="lg:col-span-1 border-r border-slate-200 dark:border-slate-700 pr-6">
            <h2 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Templates</h2>
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
              {filteredTemplates.length > 0 ? (
                filteredTemplates.map(template => (
                  <div
                    key={template.id}
                    onClick={() => handleSelectTemplate(template)}
                    className={`p-3 rounded-md cursor-pointer transition-colors ${
                      selectedTemplate?.id === template.id
                        ? 'bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 border-l-4 border-transparent'
                    }`}
                  >
                    <h3 className="font-medium text-slate-900 dark:text-white">{template.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{template.description}</p>
                    <div className="mt-2">
                      {renderCategoryBadge(template.category)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  No templates found matching your criteria.
                </div>
              )}
            </div>
          </div>

          {/* Template Details */}
          <div className="lg:col-span-2">
            {selectedTemplate && !isEditing ? (
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-medium text-slate-900 dark:text-white">{selectedTemplate.name}</h2>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => handleEditTemplate(selectedTemplate)}
                  >
                    Edit Template
                  </Button>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</h3>
                  <p className="text-slate-600 dark:text-slate-400">{selectedTemplate.description}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</h3>
                  <div>{renderCategoryBadge(selectedTemplate.category)}</div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Template</h3>
                  <div className="bg-slate-50 dark:bg-slate-700/30 rounded-md p-4 whitespace-pre-wrap text-slate-800 dark:text-slate-200 text-sm">
                    {selectedTemplate.template}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    Placeholders are indicated with [BRACKETS] and should be replaced with specific information.
                  </p>
                </div>
                
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">How to Use</h3>
                  <ol className="list-decimal list-inside text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li>Select this template when creating a new task</li>
                    <li>Replace the placeholders with your specific information</li>
                    <li>The AI will generate a detailed task based on this template</li>
                  </ol>
                </div>
              </div>
            ) : isEditing && editedTemplate ? (
              <div className="space-y-6">
                <h2 className="text-xl font-medium text-slate-900 dark:text-white">Edit Template</h2>
                
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editedTemplate.name}
                    onChange={(e) => handleTemplateChange('name', e.target.value)}
                    className="block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Description
                  </label>
                  <input
                    type="text"
                    value={editedTemplate.description}
                    onChange={(e) => handleTemplateChange('description', e.target.value)}
                    className="block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Category
                  </label>
                  <select
                    value={editedTemplate.category}
                    onChange={(e) => handleTemplateChange('category', e.target.value)}
                    className="block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    {categories.filter(c => c !== 'all').map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Template
                  </label>
                  <textarea
                    value={editedTemplate.template}
                    onChange={(e) => handleTemplateChange('template', e.target.value)}
                    rows={8}
                    className="block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Use [BRACKETS] to indicate placeholders that users should replace.
                  </p>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      // In a real app, you would save the changes to the database here
                      // For now, we'll just update the UI
                      setSelectedTemplate(editedTemplate);
                      setIsEditing(false);
                    }}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full min-h-[400px] text-slate-500 dark:text-slate-400">
                Select a template to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPromptTemplates; 