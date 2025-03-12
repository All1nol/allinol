import { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { Task } from '../api/taskApi';

// Define the types for our task context
interface TaskContextState {
  // UI state for task management
  selectedTaskId: string | null;
  taskViewMode: 'list' | 'board' | 'calendar' | 'gantt';
  taskFilters: {
    category?: Task['category'];
    status?: Task['status'];
    priority?: Task['priority'];
    search?: string;
    assignedTo?: string;
    dateRange?: {
      start: Date | null;
      end: Date | null;
    };
  };
  taskSort: {
    field: keyof Task | 'none';
    direction: 'asc' | 'desc';
  };
}

// Define the context actions/functions
interface TaskContextActions {
  selectTask: (taskId: string | null) => void;
  setTaskViewMode: (mode: TaskContextState['taskViewMode']) => void;
  setTaskFilters: (filters: Partial<TaskContextState['taskFilters']>) => void;
  clearTaskFilters: () => void;
  setTaskSort: (sort: TaskContextState['taskSort']) => void;
}

// Combine state and actions for the full context value
type TaskContextValue = TaskContextState & TaskContextActions;

// Create the context with a default value
const TaskContext = createContext<TaskContextValue | undefined>(undefined);

// Initial state
const initialState: TaskContextState = {
  selectedTaskId: null,
  taskViewMode: 'list',
  taskFilters: {
    dateRange: {
      start: null,
      end: null,
    },
  },
  taskSort: {
    field: 'createdAt',
    direction: 'desc',
  },
};

// Provider component
export function TaskProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<TaskContextState>(initialState);

  // Action implementations
  const selectTask = useCallback((selectedTaskId: string | null) => {
    setState(prev => ({ ...prev, selectedTaskId }));
  }, []);

  const setTaskViewMode = useCallback((taskViewMode: TaskContextState['taskViewMode']) => {
    setState(prev => ({ ...prev, taskViewMode }));
  }, []);

  const setTaskFilters = useCallback((filters: Partial<TaskContextState['taskFilters']>) => {
    setState(prev => ({
      ...prev,
      taskFilters: {
        ...prev.taskFilters,
        ...filters,
      },
    }));
  }, []);

  const clearTaskFilters = useCallback(() => {
    setState(prev => ({
      ...prev,
      taskFilters: {
        dateRange: {
          start: null,
          end: null,
        },
      },
    }));
  }, []);

  const setTaskSort = useCallback((taskSort: TaskContextState['taskSort']) => {
    setState(prev => ({ ...prev, taskSort }));
  }, []);

  // Combine state and actions for the context value
  const value: TaskContextValue = {
    ...state,
    selectTask,
    setTaskViewMode,
    setTaskFilters,
    clearTaskFilters,
    setTaskSort,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

// Custom hook for using the context
export function useTaskContext() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
} 