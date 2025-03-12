import { useState, useEffect } from 'react';
import { Task } from '../../api/taskApi';
import { useTaskManager } from '../../hooks/useTaskManager';
import { Button } from '../ui/Button';

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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={3}
          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="development">Development</option>
            <option value="design">Design</option>
            <option value="marketing">Marketing</option>
            <option value="management">Management</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="review">Review</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Due Date
          </label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate ? new Date(formData.dueDate).toISOString().split('T')[0] : ''}
            onChange={handleDateChange}
            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Tags
        </label>
        <div className="flex">
          <input
            type="text"
            id="tags"
            value={tagInput}
            onChange={handleTagInputChange}
            className="mt-1 block w-full rounded-l-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Add a tag"
          />
          <Button
            type="button"
            onClick={addTag}
            variant="default"
            size="default"
            className="mt-1 rounded-l-none rounded-r-md"
          >
            Add
          </Button>
        </div>
        {formData.tags && formData.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          onClick={onClose}
          variant="outline"
          size="default"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isCreating || isUpdating}
          variant="default"
          size="default"
        >
          {isCreating || isUpdating ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {isEditing ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            <>{isEditing ? 'Update Task' : 'Create Task'}</>
          )}
        </Button>
        {isEditing && (
          <Button
            type="button"
            onClick={handleDelete}
            variant="destructive"
            size="default"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Deleting...
              </>
            ) : (
              'Delete Task'
            )}
          </Button>
        )}
      </div>
    </form>
  );
} 