import React, { useEffect } from 'react';
import { PromptTemplate, PromptCategory } from '../../types/promptTemplate';
import useForm from '../../hooks/useForm';
import { createValidator, required } from '../../utils/validation';
import Button from '../ui/Button';
import FormInput from '../ui/FormInput';
import Modal from '../ui/Modal';

interface PromptTemplateFormProps {
  template?: PromptTemplate | null;
  onClose: () => void;
  onSubmit: () => void;
}

interface PromptTemplateFormValues {
  title: string;
  description: string;
  category: PromptCategory;
  content: string;
  tags: string[];
  isActive: boolean;
  tagInput?: string; // For UI state only
}

// Create a validator for the prompt template form
const validatePromptTemplateForm = createValidator<PromptTemplateFormValues>({
  title: (value) => required(value, 'Title is required'),
  description: (value) => required(value, 'Description is required'),
  category: (value) => required(value, 'Category is required'),
  content: (value) => required(value, 'Prompt content is required'),
  tags: () => null, // Tags are optional
  isActive: () => null, // isActive is optional
  tagInput: () => null, // tagInput is optional
});

const PromptTemplateForm: React.FC<PromptTemplateFormProps> = ({
  template,
  onClose,
  onSubmit,
}) => {
  // Initialize form with useForm hook
  const {
    values,
    errors,
    handleChange,
    setValues,
    isSubmitting,
    submitError,
    handleSubmit,
  } = useForm<PromptTemplateFormValues>({
    initialValues: {
      title: '',
      description: '',
      category: PromptCategory.CONTENT_GENERATION,
      content: '',
      tags: [],
      isActive: true,
      tagInput: '',
    },
    validate: validatePromptTemplateForm,
    onSubmit: async (formValues) => {
      try {
        const { tagInput, ...templateData } = formValues;
        
        const apiUrl = `${import.meta.env.VITE_API_URL}/prompt-templates`;
        const method = template ? 'put' : 'post';
        const url = template ? `${apiUrl}/${template._id}` : apiUrl;
        
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(templateData),
        });
        
        const data = await response.json();
        
        if (data.success) {
          onSubmit();
        } else {
          throw new Error(data.message || 'Failed to save prompt template');
        }
      } catch (error) {
        console.error('Error saving prompt template:', error);
        throw new Error(error instanceof Error ? error.message : 'An error occurred while saving the prompt template');
      }
    },
  });

  // Initialize form with template data if editing
  useEffect(() => {
    if (template) {
      // Get the current version content
      const currentVersion = template.versions.find(v => v.version === template.currentVersion);
      const content = currentVersion ? currentVersion.content : '';
      
      setValues({
        title: template.title,
        description: template.description,
        category: template.category,
        content,
        tags: template.tags,
        isActive: template.isActive,
        tagInput: '',
      });
    }
  }, [template, setValues]);

  // Handle tag addition
  const handleAddTag = () => {
    if (values.tagInput?.trim() && !values.tags.includes(values.tagInput.trim())) {
      setValues(prev => ({
        ...prev,
        tags: [...prev.tags, prev.tagInput!.trim()],
        tagInput: '',
      }));
    }
  };

  // Handle tag removal
  const handleRemoveTag = (tagToRemove: string) => {
    setValues(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  // Handle tag input keydown
  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <Modal 
      isOpen={true} 
      onClose={onClose} 
      title={template ? 'Edit Prompt Template' : 'Create New Prompt Template'}
      maxWidth="max-w-2xl"
    >
      {submitError && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Title */}
          <FormInput
            id="title"
            label="Title"
            type="text"
            value={values.title}
            onChange={handleChange}
            required
            placeholder="Template title"
            error={errors.title}
            title="title"
          />

          {/* Description */}
          <div className="space-y-1">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={values.description}
              onChange={handleChange}
              required
              rows={3}
              className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.description ? 'border-red-500' : ''
              }`}
              placeholder="Describe what this prompt template is used for"
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-1">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={values.category}
              onChange={handleChange}
              required
              className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.category ? 'border-red-500' : ''
              }`}
            >
              {Object.values(PromptCategory).map((cat) => (
                <option key={cat} value={cat}>
                  {cat.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-xs mt-1">{errors.category}</p>
            )}
          </div>

          {/* Content */}
          <div className="space-y-1">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Prompt Content <span className="text-red-500">*</span>
            </label>
            <textarea
              id="content"
              name="content"
              value={values.content}
              onChange={handleChange}
              required
              rows={8}
              className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white font-mono ${
                errors.content ? 'border-red-500' : ''
              }`}
              placeholder="Enter your prompt template content"
            />
            {errors.content && (
              <p className="text-red-500 text-xs mt-1">{errors.content}</p>
            )}
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Use variables like {'{variable_name}'} for dynamic content.
            </p>
          </div>

          {/* Tags */}
          <div className="space-y-1">
            <label htmlFor="tagInput" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Tags
            </label>
            <div className="flex">
              <input
                type="text"
                id="tagInput"
                name="tagInput"
                value={values.tagInput || ''}
                onChange={handleChange}
                onKeyDown={handleTagKeyDown}
                className="flex-1 rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Add tags and press Enter"
              />
              <Button
                type="button"
                onClick={handleAddTag}
                className="rounded-l-none"
                disabled={!values.tagInput?.trim()}
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {values.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1.5 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    aria-label={`Remove ${tag} tag`}
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={values.isActive}
              onChange={(e) => setValues(prev => ({ ...prev, isActive: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Active (available for use)
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              {template ? 'Update Template' : 'Create Template'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default PromptTemplateForm; 