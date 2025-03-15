import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface LoginCredentials {
    email: string;
    password: string;
}


export interface RegisterData {
    username: string;
    email: string;
    password: string;
}

export interface User {
    _id: string;
    username: string;
    email: string;
    role: string;
    token: string;

}

export interface AuthResponse {
    _id: string;
    username: string;
    email: string;
    role: string;
    token: string;
}


const authApi = axios.create({
    baseURL: `${API_URL}/auth`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include auth token
authApi.interceptors.request.use(
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

// Add response interceptor to handle auth errors
authApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Clear token and user data on auth error
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const login = async (credentials: LoginCredentials) => {
    const response = await authApi.post('/login', credentials);
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
    }
    return response.data;
};

export const register = async (data: RegisterData) => {
    const response = await authApi.post('/register', data);
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
    }
    return response.data;
};  

export const userProfile = async () => {
    try {
        const response = await authApi.get('/profile');
        return response.data;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
};


export const logout = async () => {
    try {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return { success: true };
    } catch (error) {
        console.error('Error during logout:', error);
        throw error;
    }
};

export const updateUser = async (id: User['_id'], data: Partial<User>) => {
    const response = await authApi.put(`/profile/${id}`, data);
    return response.data;
};








