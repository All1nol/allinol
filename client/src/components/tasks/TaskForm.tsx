import { useState, useEffect } from 'react';
import { Task } from '../../api/taskApi';
import { useTaskManager } from '../../hooks/useTaskManager';
import { cn } from '../../utils/cn';
import { llmService } from '../../services/llmService';

interface TaskFormProps {
  task?: Task;
  onClose: () => void;
}

export function TaskForm({ task, onClose }: TaskFormProps) {
  const { createTask, updateTask, deleteTask, isCreating, isUpdating, isDeleting } = useTaskManager();
  const isEditing = !!task;

  // Form state
  const [formData, setFormData] = useState<Omit<Task, '_id'>>({
    title: '',
    description: '',
    category: 'other',
    priority: 'medium',
    status: 'todo',
    tags: [],
  });

  // Tag input state
  const [tagInput, setTagInput] = useState('');
  
  // AI generation states
  const [isGeneratingTask, setIsGeneratingTask] = useState(false);
  const [isEnhancingDescription, setIsEnhancingDescription] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [showAiPromptInput, setShowAiPromptInput] = useState(false);

  // Initialize form with task data if editing
  useEffect(() => {
    if (task) {
      setFormData({
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
  }, [task]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle date input changes
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value ? new Date(value) : undefined }));
  };

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const confirmed = window.confirm('Are you sure you want to delete this task?');
    if (confirmed && task?._id) {
      try {
        await deleteTask(task._id);
        onClose();
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  }

  // Handle tag input
  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  // Add tag to the list
  const addTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  // Remove tag from the list
  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || [],
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing && task._id) {
        await updateTask(task._id, formData);
      } else {
        await createTask(formData);
      }
      onClose();
    } catch (error) {
      console.error('Failed to save task:', error);
      // Handle error (could add error state and display message)
    }
  };

  // AI-powered task generation from prompt
  const generateTaskFromPrompt = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsGeneratingTask(true);
    try {
      const prompt = `Create a detailed task based on this request: "${aiPrompt}". 
      Return a JSON object with the following fields:
      - title: A clear, concise title for the task
      - description: A detailed description of what needs to be done
      - category: One of [development, design, marketing, management, other]
      - priority: One of [low, medium, high, urgent]
      - tags: An array of relevant tags (max 5)`;
      
      const response = await llmService.generateCompletion(prompt, {
        temperature: 0.7,
        maxTokens: 500,
      });
      
      try {
        const generatedTask = JSON.parse(response.choices[0].message.content);
        setFormData({
          ...formData,
          ...generatedTask,
        });
        setShowAiPromptInput(false);
      } catch (error) {
        console.error('Failed to parse AI response:', error);
        // If parsing fails, at least use the response for the description
        setFormData(prev => ({
          ...prev,
          description: response.choices[0].message.content,
        }));
      }
    } catch (error) {
      console.error('Failed to generate task:', error);
    } finally {
      setIsGeneratingTask(false);
    }
  };

  // AI-powered description enhancement
  const enhanceDescription = async () => {
    if (!formData.description) return;
    
    setIsEnhancingDescription(true);
    try {
      const prompt = `Enhance the following task description to make it more detailed, clear, and actionable:
      "${formData.description}"
      
      Include specific steps, requirements, and expected outcomes. Make sure it's well-structured.`;
      
      const response = await llmService.generateCompletion(prompt, {
        temperature: 0.7,
        maxTokens: 500,
      });
      
      setFormData(prev => ({
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
    if (!formData.title && !formData.description) return;
    
    try {
      const prompt = `Based on the following task information, suggest up to 5 relevant tags (single words or short phrases):
      Title: "${formData.title}"
      Description: "${formData.description}"
      
      Return only an array of tags in JSON format.`;
      
      const response = await llmService.generateCompletion(prompt, {
        temperature: 0.7,
        maxTokens: 200,
      });
      
      try {
        const suggestedTags = JSON.parse(response.choices[0].message.content);
        if (Array.isArray(suggestedTags)) {
          const newTags = suggestedTags.filter(
            tag => !formData.tags?.includes(tag)
          );
          
          setFormData(prev => ({
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* AI Task Generation */}
      {!isEditing && (
        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">AI-Powered Task Creation</h3>
            <button
              type="button"
              onClick={() => setShowAiPromptInput(!showAiPromptInput)}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
            >
              {showAiPromptInput ? 'Hide' : 'Show'}
            </button>
          </div>
          
          {showAiPromptInput && (
            <div className="mt-3 space-y-3">
              <p className="text-xs text-blue-700 dark:text-blue-400">
                Describe what you want to accomplish, and AI will create a task for you.
              </p>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="E.g., Create a marketing campaign for our new product launch"
                  className="flex-1 rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                />
                <button
                  type="button"
                  onClick={generateTaskFromPrompt}
                  disabled={isGeneratingTask || !aiPrompt.trim()}
                  className={`px-4 py-2 rounded-md ${
                    isGeneratingTask || !aiPrompt.trim()
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  {isGeneratingTask ? 'Generating...' : 'Generate Task'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Task title"
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Description
          </label>
          <button
            type="button"
            onClick={enhanceDescription}
            disabled={isEnhancingDescription || !formData.description}
            className={`text-xs px-2 py-1 rounded ${
              isEnhancingDescription || !formData.description
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300'
            }`}
          >
            {isEnhancingDescription ? 'Enhancing...' : 'Enhance with AI'}
          </button>
        </div>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={3}
          className="block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Describe the task..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="category" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="development">Development</option>
            <option value="design">Design</option>
            <option value="marketing">Marketing</option>
            <option value="management">Management</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="priority" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="status" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="review">Review</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="dueDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Due Date
          </label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate ? new Date(formData.dueDate).toISOString().split('T')[0] : ''}
            onChange={handleDateChange}
            className="block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label htmlFor="tags" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Tags
          </label>
          <button
            type="button"
            onClick={suggestTags}
            disabled={!formData.title && !formData.description}
            className={`text-xs px-2 py-1 rounded ${
              !formData.title && !formData.description
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300'
            }`}
          >
            Suggest Tags
          </button>
        </div>
        <div className="flex space-x-2">
          <input
            type="text"
            id="tags"
            value={tagInput}
            onChange={handleTagInputChange}
            placeholder="Add a tag"
            className="block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          <button
            type="button"
            onClick={addTag}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add
          </button>
        </div>
        {formData.tags && formData.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-600 dark:hover:bg-blue-800 dark:hover:text-blue-200 focus:outline-none"
                >
                  <span className="sr-only">Remove tag</span>
                  <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                    <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-between pt-4">
        {isEditing && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        )}
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isCreating || isUpdating}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? 'Creating...' : isUpdating ? 'Updating...' : isEditing ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </form>
  );
} 