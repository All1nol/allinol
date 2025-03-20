import { useState } from 'react';
import { Project } from '../../api/projectApi';
import { Task } from '../../api/taskApi';
import { useProjectManager } from '../../context/ProjectContext';
import { useAuth } from '../../context/AuthContext';
import useForm from '../../hooks/useForm';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import TagsInput from '../tasks/TagsInput';

interface ProjectFormProps {
  project?: Project;
  onClose: () => void;
}

// Define a type for the form values
interface ProjectFormValues {
  _id?: string;
  name: string;
  description: string;
  color: string;
  status: 'active' | 'completed' | 'on_hold' | 'cancelled';
  startDate: string;
  endDate: string;
  owner: string;
  members?: string[];
  tasks?: Array<string | Task>;
  tags?: string[];
}

// Predefined color options
const colorOptions = [
  { value: '#FF5252', label: 'Red' },
  { value: '#FF9800', label: 'Orange' },
  { value: '#FFEB3B', label: 'Yellow' },
  { value: '#4CAF50', label: 'Green' },
  { value: '#2196F3', label: 'Blue' },
  { value: '#673AB7', label: 'Purple' },
  { value: '#E91E63', label: 'Pink' },
  { value: '#795548', label: 'Brown' },
  { value: '#607D8B', label: 'Gray' },
  { value: '#000000', label: 'Black' },
];

export function ProjectForm({ project, onClose }: ProjectFormProps) {
  const { createProject, updateProject, deleteProject, isDeleting } = useProjectManager();
  const { user } = useAuth(); // Get the current user
  
  console.log('Current user:', user);
  
  const isEditing = !!project;
  const [isViewMode, setIsViewMode] = useState(isEditing);
  const [isEditMode, setIsEditMode] = useState(!isEditing);
  
  // Form validation
  const validate = (values: ProjectFormValues) => {
    const errors: Record<string, string> = {};
    if (!values.name) errors.name = 'Project name is required';
    if (!values.description) errors.description = 'Project description is required';
    if (!values.color) errors.color = 'Project color is required';
    if (!values.startDate) errors.startDate = 'Start date is required';
    if (!values.endDate) errors.endDate = 'End date is required';
    return errors;
  };
  
  // Initialize form with project data or defaults
  const initialValues = project
    ? {
        ...project,
        startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
        endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '',
      }
    : {
        name: '',
        description: '',
        color: '#2196F3', // Default blue
        status: 'active' as const,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
        tags: [] as string[],
        owner: user?._id || '', // Set the owner to the current user's ID
      };
  
  const { values, errors, handleChange, handleSubmit, setValues } = useForm({
    initialValues,
    validate,
    onSubmit: async (formValues) => {
      try {
        const projectData = {
          ...formValues,
          startDate: new Date(formValues.startDate),
          endDate: new Date(formValues.endDate),
          status: formValues.status as 'active' | 'completed' | 'on_hold' | 'cancelled',
          owner: formValues.owner || user?._id, // Ensure owner is set
        };
        
        console.log('Submitting project data:', projectData);
        
        if (isEditing && project?._id) {
          await updateProject(project._id, projectData);
        } else {
          await createProject(projectData as Omit<Project, '_id'>);
        }
        onClose();
      } catch (error) {
        console.error('Error saving project:', error);
      }
    },
  });
  
  // Status options
  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'on_hold', label: 'On Hold' },
    { value: 'cancelled', label: 'Cancelled' },
  ];
  
  // Toggle between view and edit modes
  const toggleEditMode = () => {
    setIsViewMode(!isViewMode);
    setIsEditMode(!isEditMode);
  };
  
  // Handle project deletion
  const handleDelete = async () => {
    if (project?._id && confirm('Are you sure you want to delete this project?')) {
      await deleteProject(project._id);
      onClose();
    }
  };

  // Handle field value changes
  const setFieldValue = (field: string, value: unknown) => {
    setValues({ ...values, [field]: value });
  };
  
  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={isEditing ? (isViewMode ? 'Project Details' : 'Edit Project') : 'Create New Project'}
      maxWidth="max-w-2xl"
    >
      {isViewMode && isEditing ? (
        // View mode for project details
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center">
              <div 
                className="w-6 h-6 rounded-full mr-3" 
                style={{ backgroundColor: values.color }}
              ></div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">{values.name}</h3>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Description</h4>
              <div className="bg-slate-50 dark:bg-slate-700/30 rounded-md p-4 whitespace-pre-wrap text-slate-800 dark:text-slate-200 text-sm">
                {values.description}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div>
              <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Status</h4>
              <p className="text-slate-800 dark:text-slate-200">
                {statusOptions.find(option => option.value === values.status)?.label || values.status}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Color</h4>
              <div className="flex items-center">
                <div 
                  className="w-4 h-4 rounded-full mr-2" 
                  style={{ backgroundColor: values.color }}
                ></div>
                <p className="text-slate-800 dark:text-slate-200">{values.color}</p>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Start Date</h4>
              <p className="text-slate-800 dark:text-slate-200">
                {new Date(values.startDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">End Date</h4>
              <p className="text-slate-800 dark:text-slate-200">
                {new Date(values.endDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          {values.tags && values.tags.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {values.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between mt-6">
            <Button variant="danger" onClick={handleDelete} isLoading={isDeleting}>
              Delete Project
            </Button>
            <Button variant="primary" onClick={toggleEditMode}>
              Edit Project
            </Button>
          </div>
        </div>
      ) : (
        // Edit/Create mode
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Project Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="w-full rounded-md border-slate-300 dark:border-slate-600 dark:bg-slate-800 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={values.name}
              onChange={handleChange}
              required
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              className="w-full rounded-md border-slate-300 dark:border-slate-600 dark:bg-slate-800 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={values.description}
              onChange={handleChange}
              required
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Project Color
            </label>
            <div className="grid grid-cols-5 gap-2 mb-2">
              {colorOptions.map((color) => (
                <div
                  key={color.value}
                  className={`w-8 h-8 rounded-full cursor-pointer border-2 ${
                    values.color === color.value ? 'border-blue-500 dark:border-blue-400' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color.value }}
                  onClick={() => setFieldValue('color', color.value)}
                  title={color.label}
                />
              ))}
            </div>
            <div className="flex items-center mt-2">
              <input
                type="color"
                id="color"
                name="color"
                value={values.color}
                onChange={handleChange}
                className="w-8 h-8 rounded-md border-0 p-0 cursor-pointer"
              />
              <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">
                Or pick a custom color
              </span>
            </div>
            {errors.color && (
              <p className="mt-1 text-sm text-red-600">{errors.color}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="startDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                className="w-full rounded-md border-slate-300 dark:border-slate-600 dark:bg-slate-800 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={values.startDate}
                onChange={handleChange}
                required
              />
              {errors.startDate && (
                <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
              )}
            </div>
            
            <div className="space-y-1">
              <label htmlFor="endDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                className="w-full rounded-md border-slate-300 dark:border-slate-600 dark:bg-slate-800 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={values.endDate}
                onChange={handleChange}
                required
              />
              {errors.endDate && (
                <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
              )}
            </div>
          </div>
          
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              className="w-full rounded-md border-slate-300 dark:border-slate-600 dark:bg-slate-800 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={values.status}
              onChange={handleChange}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Tags
            </label>
            <TagsInput
              tags={values.tags || []}
              onChange={(tags) => setFieldValue('tags', tags)}
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            {isEditing && (
              <Button type="button" variant="outline" onClick={toggleEditMode}>
                Cancel
              </Button>
            )}
            <Button type="submit" variant="primary">
              {isEditing ? 'Update Project' : 'Create Project'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}