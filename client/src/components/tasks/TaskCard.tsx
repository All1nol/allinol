import { Task } from '../../api/taskApi';
import { cn } from '../../utils/cn';

// Status badge colors
const statusColors = {
  todo: 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200',
  in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
  review: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100',
  done: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100',
};

// Priority badge colors
const priorityColors = {
  low: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200',
  medium: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
  high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100',
  urgent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
};

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  // Format date if it exists
  const formattedDate = task.dueDate 
    ? new Date(task.dueDate).toLocaleDateString() 
    : 'No due date';

  // Get project color if task has a project
  const projectColor = task.project?.color || null;

  return (
    <div 
      onClick={onClick}
      className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200 p-4 cursor-pointer"
      style={projectColor ? { borderLeft: `4px solid ${projectColor}` } : undefined}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          {projectColor && (
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: projectColor }}
              title={task.project?.name || 'Project'}
            ></div>
          )}
          <h3 className="font-medium text-lg text-slate-900 dark:text-slate-100">{task.title}</h3>
        </div>
        <div className={cn("px-2.5 py-1 rounded-full text-xs font-medium", statusColors[task.status as keyof typeof statusColors])}>
          {task.status.replace('_', ' ')}
        </div>
      </div>
      
      <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-2">
        {task.description}
      </p>
      
      <div className="flex justify-between items-center">
        <div className={cn("px-2.5 py-1 rounded-full text-xs font-medium", priorityColors[task.priority as keyof typeof priorityColors])}>
          {task.priority}
        </div>
        
        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
          <svg className="w-3.5 h-3.5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {formattedDate}
        </div>
      </div>
      
      {task.project && (
        <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 flex items-center">
          <svg className="w-3.5 h-3.5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          {task.project.name}
        </div>
      )}
      
      {task.tags && task.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {task.tags.map((tag, index) => (
            <span 
              key={index} 
              className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs px-2.5 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
} 