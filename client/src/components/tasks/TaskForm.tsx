import React, { useEffect } from 'react';
import { Task } from '../../api/taskApi';
import { useTaskManager } from '../../hooks/useTaskManager';
import { llmService } from '../../services/llmService';
import useForm from '../../hooks/useForm';
import Button from '../ui/Button';
import FormInput from '../ui/FormInput';
import { createValidator, required } from '../../utils/validation';
import Modal from '../ui/Modal';

// Sub-components
import AITaskGenerator from './AITaskGenerator';
import TagsInput from './TagsInput';

interface TaskFormProps {
  task?: Task;
  onClose: () => void;
}

// Use the Task type directly to ensure compatibility
type TaskFormValues = Omit<Task, '_id' | 'createdAt' | 'updatedAt' | 'projectId' | 'parentTaskId' | 'subtasks'>;

// Create a validator for the task form
const validateTaskForm = createValidator<TaskFormValues>({
  title: (value) => required(value, 'Title is required'),
  description: (value) => required(value, 'Description is required'),
  category: (value) => required(value, 'Category is required'),
  priority: (value) => required(value, 'Priority is required'),
  status: (value) => required(value, 'Status is required'),
  tags: () => null, // Tags are optional
  assignedTo: () => null, // AssignedTo is optional
  dueDate: () => null, // DueDate is optional
});

// Reusable TextArea component
interface TextAreaProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
  required?: boolean;
  rows?: number;
  placeholder?: string;
  helpText?: string;
  className?: string;
  actions?: React.ReactNode;
}

const TextArea: React.FC<TextAreaProps> = ({
  id,
  label,
  value,
  onChange,
  error,
  required = false,
  rows = 3,
  placeholder,
  helpText,
  className = '',
  actions,
}) => {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {actions}
      </div>
      <textarea
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        required={required}
        rows={rows}
        className={`block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
          error ? 'border-red-500' : ''
        } ${className}`}
        placeholder={placeholder}
      />
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
      {helpText && (
        <p className="text-gray-500 text-xs mt-1">{helpText}</p>
      )}
    </div>
  );
};

// Reusable Select component
interface SelectProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  error?: string;
  required?: boolean;
  className?: string;
}

const Select: React.FC<SelectProps> = ({
  id,
  label,
  value,
  onChange,
  options,
  error,
  required = false,
  className = '',
}) => {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        required={required}
        className={`block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
          error ? 'border-red-500' : ''
        } ${className}`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
};

export function TaskForm({ task, onClose }: TaskFormProps) {
  const { createTask, updateTask, deleteTask, isCreating, isUpdating, isDeleting } = useTaskManager();
  const isEditing = !!task;

  // AI enhancement states
  const [isEnhancingDescription, setIsEnhancingDescription] = React.useState(false);

  // Initialize form with useForm hook
  const {
    values,
    errors,
    handleChange,
    setValues,
    handleSubmit,
    isSubmitting,
    submitError,
  } = useForm<TaskFormValues>({
    initialValues: {
      title: '',
      description: '',
      category: 'other',
      priority: 'medium',
      status: 'todo',
      tags: [],
    },
    validate: validateTaskForm,
    onSubmit: async (formValues) => {
      try {
        if (isEditing && task?._id) {
          await updateTask(task._id, formValues);
        } else {
          await createTask(formValues);
        }
        onClose();
      } catch (error) {
        console.error('Failed to save task:', error);
        throw new Error('Failed to save task');
      }
    },
  });

  // Initialize form with task data if editing
  useEffect(() => {
    if (task) {
      setValues({
        title: task.title,
        description: task.description,
        category: task.category,
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate,
        tags: task.tags || [],
        assignedTo: task.assignedTo,
      });
    }
  }, [task, setValues]);

  // Handle date input changes
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value ? new Date(value) : undefined }));
  };

  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this task?');
    if (confirmed && task?._id) {
      try {
        await deleteTask(task._id);
        onClose();
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  // AI-powered description enhancement
  const enhanceDescription = async () => {
    if (!values.description) return;
    
    setIsEnhancingDescription(true);
    try {
      const prompt = `Enhance the following task description to make it more detailed, clear, and actionable:
      "${values.description}"
      
      Include specific steps, requirements, and expected outcomes. Make sure it's well-structured.`;
      
      const response = await llmService.generateCompletion(prompt, {
        temperature: 0.7,
        maxTokens: 500,
      });
      
      setValues(prev => ({
        ...prev,
        description: response.choices[0].message.content,
      }));
    } catch (error) {
      console.error('Failed to enhance description:', error);
    } finally {
      setIsEnhancingDescription(false);
    }
  };

  // AI-powered tag suggestion
  const suggestTags = async () => {
    if (!values.title && !values.description) return;
    
    try {
      const prompt = `Based on the following task information, suggest up to 5 relevant tags (single words or short phrases):
      Title: "${values.title}"
      Description: "${values.description}"
      
      Return only an array of tags in JSON format.`;
      
      const response = await llmService.generateCompletion(prompt, {
        temperature: 0.7,
        maxTokens: 200,
      });
      
      try {
        const suggestedTags = JSON.parse(response.choices[0].message.content);
        if (Array.isArray(suggestedTags)) {
          const newTags = suggestedTags.filter(
            tag => !values.tags?.includes(tag)
          );
          
          setValues(prev => ({
            ...prev,
            tags: [...(prev.tags || []), ...newTags],
          }));
        }
      } catch (error) {
        console.error('Failed to parse AI tag suggestions:', error);
      }
    } catch (error) {
      console.error('Failed to suggest tags:', error);
    }
  };

  // Handle tag updates
  const handleTagsChange = (tags: string[]) => {
    setValues(prev => ({ ...prev, tags }));
  };

  // Update form values from AI generation
  const handleAITaskGeneration = (generatedTask: Partial<Task>) => {
    setValues(prev => ({
      ...prev,
      ...generatedTask,
    }));
  };

  // Category options
  const categoryOptions = [
    { value: 'development', label: 'Development' },
    { value: 'design', label: 'Design' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'management', label: 'Management' },
    { value: 'other', label: 'Other' },
  ];

  // Priority options
  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
  ];

  // Status options
  const statusOptions = [
    { value: 'todo', label: 'To Do' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'review', label: 'Review' },
    { value: 'done', label: 'Done' },
  ];

  // Enhance description button
  const enhanceDescriptionButton = (
    <Button
      size="sm"
      variant="secondary"
      onClick={enhanceDescription}
      disabled={isEnhancingDescription || !values.description}
      isLoading={isEnhancingDescription}
    >
      Enhance with AI
    </Button>
  );

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={isEditing ? 'Edit Task' : 'Create New Task'}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* AI Task Generation */}
        {!isEditing && (
          <AITaskGenerator onTaskGenerated={handleAITaskGeneration} />
        )}

        {submitError && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
            {submitError}
          </div>
        )}

        {/* Basic Information */}
        <div className="space-y-4">
          <FormInput
            id="title"
            label="Title"
            type="text"
            value={values.title}
            onChange={handleChange}
            required
            placeholder="Task title"
            error={errors.title}
          />

          <TextArea
            id="description"
            label="Description"
            value={values.description}
            onChange={handleChange}
            required
            rows={3}
            placeholder="Describe the task..."
            error={errors.description}
            actions={enhanceDescriptionButton}
          />
        </div>

        {/* Task Classification */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            id="category"
            label="Category"
            value={values.category}
            onChange={handleChange}
            options={categoryOptions}
            required
            error={errors.category}
          />

          <Select
            id="priority"
            label="Priority"
            value={values.priority}
            onChange={handleChange}
            options={priorityOptions}
            required
            error={errors.priority}
          />
        </div>

        {/* Task Status and Due Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            id="status"
            label="Status"
            value={values.status}
            onChange={handleChange}
            options={statusOptions}
            required
            error={errors.status}
          />

          <div className="space-y-1">
            <label htmlFor="dueDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={values.dueDate ? new Date(values.dueDate).toISOString().split('T')[0] : ''}
              onChange={handleDateChange}
              className="block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Tags */}
        <TagsInput 
          tags={values.tags || []} 
          onChange={handleTagsChange} 
          onSuggestTags={suggestTags}
          disabled={!values.title && !values.description}
        />

        {/* Form Actions */}
        <div className="flex justify-between pt-4">
          {isEditing && (
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={isDeleting}
              disabled={isDeleting}
            >
              Delete
            </Button>
          )}
          <div className="flex space-x-3 ml-auto">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting || isCreating || isUpdating}
              disabled={isSubmitting || isCreating || isUpdating}
            >
              {isEditing ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
} 