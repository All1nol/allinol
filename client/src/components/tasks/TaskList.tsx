import { useTaskManager } from '../../hooks/useTaskManager';
import { TaskCard } from './TaskCard';
import { Task } from '../../api/taskApi';

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
      <div>
        <div></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div role="alert">
        <strong>Error!</strong>
        <span> Failed to load tasks. Please try again later.</span>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div>
        <h3>No tasks found</h3>
        <p>
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
          >
            Clear Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      <div>
        <div>
          {tasks.length} {tasks.length === 1 ? 'Task' : 'Tasks'}
        </div>
        
        <div>
          <select
            value={taskSort.field as string}
            onChange={(e) => setTaskSort({ ...taskSort, field: e.target.value as keyof Task | 'none' })}
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
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>
      
      <div>
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