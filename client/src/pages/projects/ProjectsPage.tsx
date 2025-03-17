import { useState } from 'react';
import { ProjectList } from '../../components/projects/ProjectList';
import { ProjectForm } from '../../components/projects/ProjectForm';
import { useProjectManager } from '../../context/ProjectContext';

export function ProjectsPage() {
  const { selectedProject, selectProject } = useProjectManager();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Open the create project modal
  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  // Close the create project modal
  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  // Close the edit project modal
  const closeEditModal = () => {
    selectProject(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Projects</h1>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Create Project
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow">
        <div className="p-6">
          <ProjectList />
        </div>
      </div>

      {/* Create Project Modal */}
      {isCreateModalOpen && (
        <ProjectForm onClose={closeCreateModal} />
      )}

      {/* Edit Project Modal */}
      {selectedProject && (
        <ProjectForm project={selectedProject} onClose={closeEditModal} />
      )}
    </div>
  );
} 