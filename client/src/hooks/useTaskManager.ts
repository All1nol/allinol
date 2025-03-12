import { useMemo } from 'react';
import { useTasksQuery, useTaskQuery, useCreateTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation } from './useTasks';
import { useTaskContext } from '../context/TaskContext';
import { Task } from '../api/taskApi';

/**
 * A comprehensive hook that combines React Query for data fetching with TaskContext for UI state
 * This provides a complete solution for task management in the application
 */
export function useTaskManager() {
  // Get task UI state from context
  const {
    selectedTaskId,
    taskViewMode,
    taskFilters,
    taskSort,
    selectTask,
    setTaskViewMode,
    setTaskFilters,
    clearTaskFilters,
    setTaskSort,
  } = useTaskContext();

  // Get task data from React Query
  const tasksQuery = useTasksQuery();
  const selectedTaskQuery = useTaskQuery(selectedTaskId || '');
  const createTaskMutation = useCreateTaskMutation();
  const updateTaskMutation = useUpdateTaskMutation();
  const deleteTaskMutation = useDeleteTaskMutation();

  // Apply filters and sorting to the tasks
  const filteredAndSortedTasks = useMemo(() => {
    if (!tasksQuery.data) return [];

    // Start with all tasks
    let result = [...tasksQuery.data];

    // Apply filters
    if (taskFilters.category) {
      result = result.filter(task => task.category === taskFilters.category);
    }

    if (taskFilters.status) {
      result = result.filter(task => task.status === taskFilters.status);
    }

    if (taskFilters.priority) {
      result = result.filter(task => task.priority === taskFilters.priority);
    }

    if (taskFilters.search) {
      const searchLower = taskFilters.search.toLowerCase();
      result = result.filter(
        task => 
          task.title.toLowerCase().includes(searchLower) || 
          task.description.toLowerCase().includes(searchLower) ||
          (task.tags && task.tags.some(tag => tag.toLowerCase().includes(searchLower)))
      );
    }

    if (taskFilters.assignedTo) {
      result = result.filter(task => task.assignedTo === taskFilters.assignedTo);
    }

    if (taskFilters.dateRange?.start || taskFilters.dateRange?.end) {
      result = result.filter(task => {
        if (!task.dueDate) return false;
        
        const dueDate = new Date(task.dueDate);
        const start = taskFilters.dateRange?.start ? new Date(taskFilters.dateRange.start) : null;
        const end = taskFilters.dateRange?.end ? new Date(taskFilters.dateRange.end) : null;
        
        if (start && end) {
          return dueDate >= start && dueDate <= end;
        } else if (start) {
          return dueDate >= start;
        } else if (end) {
          return dueDate <= end;
        }
        
        return true;
      });
    }

    // Apply sorting
    if (taskSort.field !== 'none') {
      result.sort((a, b) => {
        const aValue = a[taskSort.field as keyof Task];
        const bValue = b[taskSort.field as keyof Task];
        
        if (aValue === undefined || bValue === undefined) return 0;
        
        // Handle different types of values
        if (aValue instanceof Date && bValue instanceof Date) {
          return taskSort.direction === 'asc' 
            ? aValue.getTime() - bValue.getTime() 
            : bValue.getTime() - aValue.getTime();
        }
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return taskSort.direction === 'asc' 
            ? aValue.localeCompare(bValue) 
            : bValue.localeCompare(aValue);
        }
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return taskSort.direction === 'asc' ? aValue - bValue : bValue - aValue;
        }
        
        return 0;
      });
    }

    return result;
  }, [
    tasksQuery.data,
    taskFilters.category,
    taskFilters.status,
    taskFilters.priority,
    taskFilters.search,
    taskFilters.assignedTo,
    taskFilters.dateRange,
    taskSort.field,
    taskSort.direction,
  ]);

  // Group tasks by status for board view
  const tasksByStatus = useMemo(() => {
    if (!filteredAndSortedTasks.length) return {};
    
    return filteredAndSortedTasks.reduce<Record<string, Task[]>>((acc, task) => {
      if (!acc[task.status]) {
        acc[task.status] = [];
      }
      acc[task.status].push(task);
      return acc;
    }, {});
  }, [filteredAndSortedTasks]);

  // Convenience methods for task operations
  const createTask = (newTask: Omit<Task, '_id'>) => {
    return createTaskMutation.mutateAsync(newTask);
  };

  const updateTask = (id: string, taskUpdate: Partial<Task>) => {
    return updateTaskMutation.mutateAsync({ id, task: taskUpdate });
  };

  const deleteTask = (id: string) => {
    // If we're deleting the currently selected task, deselect it
    if (id === selectedTaskId) {
      selectTask(null);
    }
    return deleteTaskMutation.mutateAsync(id);
  };

  return {
    // Data
    tasks: filteredAndSortedTasks,
    tasksByStatus,
    selectedTask: selectedTaskQuery.data,
    isLoading: tasksQuery.isLoading || selectedTaskQuery.isLoading,
    isError: tasksQuery.isError || selectedTaskQuery.isError,
    
    // UI State
    selectedTaskId,
    taskViewMode,
    taskFilters,
    taskSort,
    
    // UI Actions
    selectTask,
    setTaskViewMode,
    setTaskFilters,
    clearTaskFilters,
    setTaskSort,
    
    // Data Actions
    createTask,
    updateTask,
    deleteTask,
    
    // Mutation States
    isCreating: createTaskMutation.isPending,
    isUpdating: updateTaskMutation.isPending,
    isDeleting: deleteTaskMutation.isPending,
  };
} 