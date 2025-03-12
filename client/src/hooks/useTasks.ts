import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchTasks, 
  fetchTaskById, 
  createTask, 
  updateTask, 
  deleteTask, 
  fetchTasksByCategory, 
  fetchTasksByStatus,
  Task
} from '../api/taskApi';

// Query keys for caching
export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...taskKeys.lists(), { filters }] as const,
  details: () => [...taskKeys.all, 'detail'] as const,
  detail: (id: string) => [...taskKeys.details(), id] as const,
  byCategory: (category: string) => [...taskKeys.lists(), { category }] as const,
  byStatus: (status: string) => [...taskKeys.lists(), { status }] as const,
};

// Hook for fetching all tasks
export function useTasksQuery() {
  return useQuery({
    queryKey: taskKeys.lists(),
    queryFn: fetchTasks,
  });
}

// Hook for fetching a single task
export function useTaskQuery(id: string) {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: () => fetchTaskById(id),
    enabled: !!id, // Only run the query if we have an ID
  });
}

// Hook for fetching tasks by category
export function useTasksByCategoryQuery(category: Task['category']) {
  return useQuery({
    queryKey: taskKeys.byCategory(category),
    queryFn: () => fetchTasksByCategory(category),
    enabled: !!category,
  });
}

// Hook for fetching tasks by status
export function useTasksByStatusQuery(status: Task['status']) {
  return useQuery({
    queryKey: taskKeys.byStatus(status),
    queryFn: () => fetchTasksByStatus(status),
    enabled: !!status,
  });
}

// Hook for creating a task
export function useCreateTaskMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (newTask: Omit<Task, '_id'>) => createTask(newTask),
    onSuccess: () => {
      // Invalidate and refetch tasks list
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
}

// Hook for updating a task
export function useUpdateTaskMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, task }: { id: string; task: Partial<Task> }) => updateTask(id, task),
    onSuccess: (updatedTask) => {
      // Update the task in the cache
      queryClient.setQueryData(taskKeys.detail(updatedTask._id!), updatedTask);
      // Invalidate lists that might contain this task
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
}

// Hook for deleting a task
export function useDeleteTaskMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: (_, id) => {
      // Remove the task from the cache
      queryClient.removeQueries({ queryKey: taskKeys.detail(id) });
      // Invalidate lists that might contain this task
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
} 