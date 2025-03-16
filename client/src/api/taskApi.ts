import axios from 'axios';

// Define the base URL for API calls
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Define the Task interface based on the server model
export interface Task {
  _id?: string;
  title: string;
  description: string;
  category: 'development' | 'design' | 'marketing' | 'management' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in_progress' | 'review' | 'done';
  assignedTo?: string;
  dueDate?: Date;
  projectId?: string;
  parentTaskId?: string;
  subtasks?: string[];
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Create a dedicated API instance
const taskApi = axios.create({
  baseURL: `${API_URL}/tasks`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
taskApi.interceptors.request.use(
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

// API functions for tasks
export const fetchTasks = async (): Promise<Task[]> => {
  const response = await taskApi.get('/');
  return response.data;
};

export const fetchTaskById = async (id: string): Promise<Task> => {
  const response = await taskApi.get(`/${id}`);
  return response.data;
};

export const createTask = async (task: Omit<Task, '_id'>): Promise<Task> => {
  const response = await taskApi.post('/', task);
  return response.data;
};

export const updateTask = async (id: string, task: Partial<Task>): Promise<Task> => {
  const response = await taskApi.put(`/${id}`, task);
  return response.data;
};

export const deleteTask = async (id: string): Promise<{ message: string }> => {
  const response = await taskApi.delete(`/${id}`);
  return response.data;
};

export const fetchTasksByCategory = async (category: Task['category']): Promise<Task[]> => {
  const response = await taskApi.get(`/category/${category}`);
  return response.data;
};

export const fetchTasksByStatus = async (status: Task['status']): Promise<Task[]> => {
  const response = await taskApi.get(`/status/${status}`);
  return response.data;
}; 