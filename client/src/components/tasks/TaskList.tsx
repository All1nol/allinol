import { useTaskManager } from '../../hooks/useTaskManager';
import { TaskCard } from './TaskCard';
import { Task } from '../../api/taskApi';
import { useState } from 'react';

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

  // Add state for grouping by project
  const [groupByProject, setGroupByProject] = useState(true);

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

  // Group tasks by project
  const groupedTasks: Record<string, Task[]> = {};
  
  if (groupByProject) {
    // Initialize with "No Project" group
    groupedTasks['no-project'] = [];
    
    // Group tasks by project
    tasks.forEach(task => {
      if (task.projectId && task.project) {
        if (!groupedTasks[task.projectId]) {
          groupedTasks[task.projectId] = [];
        }
        groupedTasks[task.projectId].push(task);
      } else {
        groupedTasks['no-project'].push(task);
      }
    });
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
          
          <button
            onClick={() => setGroupByProject(!groupByProject)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium ${
              groupByProject 
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' 
                : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200'
            }`}
          >
            {groupByProject ? 'Grouped by Project' : 'Flat View'}
          </button>
        </div>
      </div>
      
      {groupByProject ? (
        // Grouped by project view
        <div className="space-y-8">
          {Object.entries(groupedTasks).map(([projectId, projectTasks]) => {
            if (projectTasks.length === 0) return null;
            
            const projectName = projectId === 'no-project' 
              ? 'No Project' 
              : projectTasks[0].project?.name || 'Unknown Project';
            
            const projectColor = projectId === 'no-project'
              ? '#808080'
              : projectTasks[0].project?.color || '#808080';
            
            return (
              <div key={projectId} className="space-y-4">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: projectColor }}
                  ></div>
                  <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                    {projectName}
                  </h3>
                  <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">
                    ({projectTasks.length})
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projectTasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onClick={() => selectTask(task._id!)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // Flat view (original)
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onClick={() => selectTask(task._id!)}
            />
          ))}
        </div>
      )}
    </div>
  );
} 