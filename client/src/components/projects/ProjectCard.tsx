import React from 'react';
import { Project } from '../../api/projectApi';
import { cn } from '../../utils/cn';

// Status badge colors
const statusColors = {
  active: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100',
  completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
  on_hold: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
};

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  // Format dates
  const formattedStartDate = project.startDate 
    ? new Date(project.startDate).toLocaleDateString() 
    : 'No start date';
  
  const formattedEndDate = project.endDate 
    ? new Date(project.endDate).toLocaleDateString() 
    : 'No end date';

  // Get task count - handle both string[] and object[] cases
  const taskCount = project.tasks ? project.tasks.length : 0;

  return (
    <div 
      onClick={onClick}
      className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200 p-4 cursor-pointer"
      style={{ borderLeft: `4px solid ${project.color}` }}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <div 
            className="w-3 h-3 rounded-full mr-2" 
            style={{ backgroundColor: project.color }}
          ></div>
          <h3 className="font-medium text-lg text-slate-900 dark:text-slate-100">{project.name}</h3>
        </div>
        <div className={cn("px-2.5 py-1 rounded-full text-xs font-medium", statusColors[project.status as keyof typeof statusColors])}>
          {project.status.replace('_', ' ')}
        </div>
      </div>
      
      <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-2">
        {project.description}
      </p>
      
      <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center">
          <svg className="w-3.5 h-3.5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {formattedStartDate} - {formattedEndDate}
        </div>
        
        <div className="flex items-center">
          <svg className="w-3.5 h-3.5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          {taskCount} {taskCount === 1 ? 'Task' : 'Tasks'}
        </div>
      </div>
    </div>
  );
} 