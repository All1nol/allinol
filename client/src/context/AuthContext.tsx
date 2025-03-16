import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, userProfile, logout as apiLogout, updateUser as apiUpdateUser, User, RegisterData, LoginCredentials } from '../api/authApi';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (id: User['_id'], data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const userData = await userProfile();
                    setUser(userData);
                    setIsAuthenticated(true);
                } catch (error) {
                    console.error('Error fetching user profile:', error);
                    localStorage.removeItem('token');
                    setIsAuthenticated(false);
                    navigate('/login');
                }
            }
            setLoading(false);
        };
        initializeAuth();
    }, [navigate]);

    const handleLogin = async (credentials: LoginCredentials) => {
        try {
            const response = await apiLogin(credentials);
            setUser(response);
            setIsAuthenticated(true);
            navigate('/tasks');
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const handleRegister = async (data: RegisterData) => {
        try {
            const response = await apiRegister(data);
            setUser(response);
            setIsAuthenticated(true);
            navigate('/dashboard');
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    };

    const handleLogout = async () => {
        try {
            await apiLogout();
            setUser(null);
            setIsAuthenticated(false);
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
            throw error;
        }
    };

    const handleUpdateUser = async (id: User['_id'], data: Partial<User>) => {
        try {
            const updatedUser = await apiUpdateUser(id, data);
            setUser(updatedUser);
        } catch (error) {
            console.error('Update user failed:', error);
            throw error;
        }
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        updateUser: handleUpdateUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
