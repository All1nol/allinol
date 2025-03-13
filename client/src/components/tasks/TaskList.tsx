import { useTaskManager } from '../../hooks/useTaskManager';
import { TaskCard } from './TaskCard';
import { Task } from '../../api/taskApi';
import { cn } from '../../utils/cn';

export function TaskList() {
  const {
    tasks,
    isLoading,
    isError,
    selectTask,
    taskFilters,
    clearTaskFilters,
    taskSort,
    setTaskSort,
  } = useTaskManager();

  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full p-4 mb-4 text-sm rounded-lg bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200" role="alert">
        <div className="flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
          </svg>
          <strong className="font-medium">Error!</strong>
          <span className="ml-1"> Failed to load tasks. Please try again later.</span>
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="w-full p-8 text-center bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
        <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-slate-900 dark:text-slate-100">No tasks found</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {Object.keys(taskFilters).some(key => 
            key !== 'dateRange' && taskFilters[key as keyof typeof taskFilters]
          ) 
            ? 'Try clearing your filters or creating a new task.'
            : 'Get started by creating your first task.'}
        </p>
        {Object.keys(taskFilters).some(key => 
          key !== 'dateRange' && taskFilters[key as keyof typeof taskFilters]
        ) && (
          <button
            onClick={clearTaskFilters}
            type="button"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Clear Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-700">
        <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {tasks.length} {tasks.length === 1 ? 'Task' : 'Tasks'}
        </div>
        
        <div className="flex flex-wrap gap-2">
          <select
            value={taskSort.field as string}
            onChange={(e) => setTaskSort({ ...taskSort, field: e.target.value as keyof Task | 'none' })}
            className="block w-full sm:w-auto rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="none">Sort by</option>
            <option value="title">Title</option>
            <option value="priority">Priority</option>
            <option value="status">Status</option>
            <option value="dueDate">Due Date</option>
            <option value="createdAt">Created Date</option>
          </select>
          
          <select
            value={taskSort.direction}
            onChange={(e) => setTaskSort({ ...taskSort, direction: e.target.value as 'asc' | 'desc' })}
            className="block w-full sm:w-auto rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onClick={() => selectTask(task._id!)}
          />
        ))}
      </div>
    </div>
  );
} 