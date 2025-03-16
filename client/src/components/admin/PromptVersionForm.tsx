import React from 'react';
import { PromptTemplate } from '../../types/promptTemplate';
import useForm from '../../hooks/useForm';
import { createValidator, required } from '../../utils/validation';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

interface PromptVersionFormProps {
  template: PromptTemplate;
  onSubmit: () => void;
  onCancel: () => void;
}

interface PromptVersionFormValues {
  content: string;
  description: string;
}

// Create a validator for the prompt version form
const validatePromptVersionForm = createValidator<PromptVersionFormValues>({
  content: (value) => required(value, 'Prompt content is required'),
  description: () => null, // Description is optional
});

const PromptVersionForm: React.FC<PromptVersionFormProps> = ({
  template,
  onSubmit,
  onCancel,
}) => {
  // Initialize form with useForm hook
  const {
    values,
    errors,
    handleChange,
    isSubmitting,
    submitError,
    handleSubmit,
  } = useForm<PromptVersionFormValues>({
    initialValues: {
      content: '',
      description: '',
    },
    validate: validatePromptVersionForm,
    onSubmit: async (formValues) => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/prompt-templates/${template._id}/versions`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formValues),
          }
        );
        
        const data = await response.json();
        
        if (data.success) {
          onSubmit();
        } else {
          throw new Error(data.message || 'Failed to add new version');
        }
      } catch (error) {
        console.error('Error adding new version:', error);
        throw new Error(error instanceof Error ? error.message : 'An error occurred while adding the new version');
      }
    },
  });

  return (
    <Modal
      isOpen={true}
      onClose={onCancel}
      title="Create New Version"
      maxWidth="max-w-2xl"
    >
      {submitError && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
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
              rows={10}
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

          {/* Description */}
          <div className="space-y-1">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Version Description
            </label>
            <textarea
              id="description"
              name="description"
              value={values.description}
              onChange={handleChange}
              rows={3}
              className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.description ? 'border-red-500' : ''
              }`}
              placeholder="Describe what changes you made in this version (optional)"
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button
              variant="outline"
              onClick={onCancel}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              Create Version
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default PromptVersionForm; 