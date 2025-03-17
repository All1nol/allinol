import React from 'react';
import { useProjectManager } from '../../context/ProjectContext';
import { ProjectCard } from './ProjectCard';
import { Project } from '../../api/projectApi';

export function ProjectList() {
  const {
    projects,
    isLoading,
    isError,
    selectProject,
    projectFilters,
    clearProjectFilters,
    projectSort,
    setProjectSort,
  } = useProjectManager();

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
          <span className="ml-1"> Failed to load projects. Please try again later.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-700">
        <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {projects.length} {projects.length === 1 ? 'Project' : 'Projects'}
        </div>
        
        <div className="flex flex-wrap gap-2">
          <select
            value={projectSort.field as string}
            onChange={(e) => setProjectSort({ ...projectSort, field: e.target.value as keyof Project | 'none' })}
            className="block w-full sm:w-auto rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="none">Sort by</option>
            <option value="name">Name</option>
            <option value="status">Status</option>
            <option value="startDate">Start Date</option>
            <option value="endDate">End Date</option>
            <option value="createdAt">Created Date</option>
          </select>
          
          <select
            value={projectSort.direction}
            onChange={(e) => setProjectSort({ ...projectSort, direction: e.target.value as 'asc' | 'desc' })}
            className="block w-full sm:w-auto rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <ProjectCard
            key={project._id}
            project={project}
            onClick={() => selectProject(project._id!)}
          />
        ))}
      </div>
    </div>
  );
} 