import { Task } from '../../api/taskApi';

// Status badge colors
const statusColors = {
  todo: 'bg-gray-200 text-gray-800',
  in_progress: 'bg-blue-200 text-blue-800',
  review: 'bg-yellow-200 text-yellow-800',
  done: 'bg-green-200 text-green-800',
};

// Priority badge colors
const priorityColors = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-blue-100 text-blue-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800',
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

  return (
    <div 
      className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white dark:bg-gray-800"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-lg text-gray-900 dark:text-gray-100">{task.title}</h3>
        <div className={`px-2 py-1 rounded text-xs font-medium ${statusColors[task.status as keyof typeof statusColors]}`}>
          {task.status.replace('_', ' ')}
        </div>
      </div>
      
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
        {task.description}
      </p>
      
      <div className="flex justify-between items-center">
        <div className={`px-2 py-1 rounded text-xs font-medium ${priorityColors[task.priority as keyof typeof priorityColors]}`}>
          {task.priority}
        </div>
        
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Due: {formattedDate}
        </div>
      </div>
      
      {task.tags && task.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {task.tags.map((tag, index) => (
            <span 
              key={index} 
              className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
} 