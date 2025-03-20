import axios from 'axios';
import { Task } from './taskApi';

// Define the base URL for API calls
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Define the Project interface based on the server model
export interface Project {
  _id?: string;
  name: string;
  description: string;
  color: string;
  status: 'active' | 'completed' | 'on_hold' | 'cancelled';
  startDate: Date;
  endDate: Date;
  owner: string;
  members?: string[];
  tasks?: Task[] | string[]; // Can be either Task objects or string IDs
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Create a dedicated API instance
const projectApi = axios.create({
  baseURL: `${API_URL}/projects`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
projectApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API functions for projects
export const fetchProjects = async (): Promise<Project[]> => {
  const response = await projectApi.get('/');
  return response.data;
};

export const fetchProjectById = async (id: string): Promise<Project> => {
  const response = await projectApi.get(`/${id}`);
  return response.data;
};

export const createProject = async (project: Omit<Project, '_id'>): Promise<Project> => {
  console.log('Creating project with data:', project);
  try {
    const response = await projectApi.post('/', project);
    return response.data;
  } catch (error: any) {
    console.error('Server error response:', error.response?.data);
    throw error;
  }
};

export const updateProject = async (id: string, project: Partial<Project>): Promise<Project> => {
  const response = await projectApi.put(`/${id}`, project);
  return response.data;
};

export const deleteProject = async (id: string): Promise<{ message: string }> => {
  const response = await projectApi.delete(`/${id}`);
  return response.data;
};

export const fetchProjectTasks = async (projectId: string): Promise<Task[]> => {
  const response = await projectApi.get(`/${projectId}/tasks`);
  return response.data;
}; 