import { useTaskManager } from '../../hooks/useTaskManager';
import { TaskCard } from './TaskCard';
import { Task } from '../../api/taskApi';
import { Button } from '../ui/Button';

export function TaskList() {
  const {
    tasks,
    isLoading,
    isError,
    selectTask,
    taskFilters,
    setTaskFilters,
    clearTaskFilters,
    taskSort,
    setTaskSort,
  } = useTaskManager();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> Failed to load tasks. Please try again later.</span>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No tasks found</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {Object.keys(taskFilters).some(key => 
            key !== 'dateRange' && taskFilters[key as keyof typeof taskFilters]
          ) 
            ? 'Try clearing your filters or creating a new task.'
            : 'Get started by creating your first task.'}
        </p>
        {Object.keys(taskFilters).some(key => 
          key !== 'dateRange' && taskFilters[key as keyof typeof taskFilters]
        ) && (
          <Button
            onClick={clearTaskFilters}
            variant="default"
            size="default"
            className="mt-4"
          >
            Clear Filters
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="text-lg font-medium">
          {tasks.length} {tasks.length === 1 ? 'Task' : 'Tasks'}
        </div>
        
        <div className="flex space-x-2">
          <select
            value={taskSort.field as string}
            onChange={(e) => setTaskSort({ ...taskSort, field: e.target.value as keyof Task | 'none' })}
            className="block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
            className="block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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