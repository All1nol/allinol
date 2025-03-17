import { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { Project } from '../api/projectApi';
import { 
  fetchProjects, 
  fetchProjectById, 
  createProject, 
  updateProject, 
  deleteProject
} from '../api/projectApi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Define the types for our project context
interface ProjectContextState {
  // UI state for project management
  selectedProjectId: string | null;
  projectFilters: {
    status?: Project['status'];
    search?: string;
  };
  projectSort: {
    field: keyof Project | 'none';
    direction: 'asc' | 'desc';
  };
}

interface ProjectContextValue extends ProjectContextState {
  // UI Actions
  selectProject: (id: string | null) => void;
  setProjectFilters: (filters: Partial<ProjectContextState['projectFilters']>) => void;
  clearProjectFilters: () => void;
  setProjectSort: (sort: ProjectContextState['projectSort']) => void;
  
  // Data
  projects: Project[];
  selectedProject: Project | null;
  isLoading: boolean;
  isError: boolean;
  
  // Data Actions
  createProject: (project: Omit<Project, '_id'>) => Promise<Project>;
  updateProject: (id: string, project: Partial<Project>) => Promise<Project>;
  deleteProject: (id: string) => Promise<any>;
  
  // Mutation States
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}

// Create the context
const ProjectContext = createContext<ProjectContextValue | undefined>(undefined);

// Provider component
export function ProjectProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  
  // UI State
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [projectFilters, setProjectFiltersState] = useState<ProjectContextState['projectFilters']>({});
  const [projectSort, setProjectSortState] = useState<ProjectContextState['projectSort']>({
    field: 'createdAt',
    direction: 'desc',
  });
  
  // Queries
  const projectsQuery = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });
  
  const selectedProjectQuery = useQuery({
    queryKey: ['project', selectedProjectId],
    queryFn: () => selectedProjectId ? fetchProjectById(selectedProjectId) : null,
    enabled: !!selectedProjectId,
  });
  
  // Mutations
  const createProjectMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
  
  const updateProjectMutation = useMutation({
    mutationFn: ({ id, project }: { id: string; project: Partial<Project> }) => 
      updateProject(id, project),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project', data._id] });
    },
  });
  
  const deleteProjectMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      if (selectedProjectId) {
        setSelectedProjectId(null);
      }
    },
  });
  
  // Filter and sort projects
  const filteredAndSortedProjects = useCallback(() => {
    let result = [...(projectsQuery.data || [])];
    
    // Apply filters
    if (projectFilters.status) {
      result = result.filter(project => project.status === projectFilters.status);
    }
    
    if (projectFilters.search) {
      const searchLower = projectFilters.search.toLowerCase();
      result = result.filter(project => 
        project.name.toLowerCase().includes(searchLower) || 
        project.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply sorting
    if (projectSort.field !== 'none') {
      result.sort((a, b) => {
        const aValue = a[projectSort.field as keyof Project];
        const bValue = b[projectSort.field as keyof Project];
        
        if (aValue === undefined || bValue === undefined) return 0;
        
        const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        return projectSort.direction === 'asc' ? comparison : -comparison;
      });
    }
    
    return result;
  }, [projectsQuery.data, projectFilters, projectSort]);
  
  // UI Actions
  const selectProject = (id: string | null) => {
    setSelectedProjectId(id);
  };
  
  const setProjectFilters = (filters: Partial<ProjectContextState['projectFilters']>) => {
    setProjectFiltersState(prev => ({ ...prev, ...filters }));
  };
  
  const clearProjectFilters = () => {
    setProjectFiltersState({});
  };
  
  const setProjectSort = (sort: ProjectContextState['projectSort']) => {
    setProjectSortState(sort);
  };
  
  // Data Actions
  const createProjectAction = (project: Omit<Project, '_id'>) => {
    return createProjectMutation.mutateAsync(project);
  };
  
  const updateProjectAction = (id: string, project: Partial<Project>) => {
    return updateProjectMutation.mutateAsync({ id, project });
  };
  
  const deleteProjectAction = (id: string) => {
    if (id === selectedProjectId) {
      selectProject(null);
    }
    return deleteProjectMutation.mutateAsync(id);
  };
  
  const value: ProjectContextValue = {
    // UI State
    selectedProjectId,
    projectFilters,
    projectSort,
    
    // UI Actions
    selectProject,
    setProjectFilters,
    clearProjectFilters,
    setProjectSort,
    
    // Data
    projects: filteredAndSortedProjects(),
    selectedProject: selectedProjectQuery.data || null,
    isLoading: projectsQuery.isLoading || selectedProjectQuery.isLoading,
    isError: projectsQuery.isError || selectedProjectQuery.isError,
    
    // Data Actions
    createProject: createProjectAction,
    updateProject: updateProjectAction,
    deleteProject: deleteProjectAction,
    
    // Mutation States
    isCreating: createProjectMutation.isPending,
    isUpdating: updateProjectMutation.isPending,
    isDeleting: deleteProjectMutation.isPending,
  };
  
  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
}

// Custom hook to use the project context
export function useProjectManager() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjectManager must be used within a ProjectProvider');
  }
  return context;
} 