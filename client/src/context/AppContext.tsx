import { createContext, useContext, ReactNode, useState, useCallback } from 'react';

// Define the types for our context
interface AppContextState {
  // UI state
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  // User state
  currentUser: User | null;
  // Workspace state
  currentWorkspace: Workspace | null;
}

// User interface
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

// Workspace interface
interface Workspace {
  id: string;
  name: string;
  description?: string;
}

// Define the context actions/functions
interface AppContextActions {
  toggleSidebar: () => void;
  setTheme: (theme: AppContextState['theme']) => void;
  setCurrentUser: (user: User | null) => void;
  setCurrentWorkspace: (workspace: Workspace | null) => void;
  logout: () => void;
}

// Combine state and actions for the full context value
type AppContextValue = AppContextState & AppContextActions;

// Create the context with a default value
const AppContext = createContext<AppContextValue | undefined>(undefined);

// Initial state
const initialState: AppContextState = {
  sidebarOpen: true,
  theme: 'system',
  currentUser: null,
  currentWorkspace: null,
};

// Provider component
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppContextState>(initialState);

  // Action implementations
  const toggleSidebar = useCallback(() => {
    setState(prev => ({ ...prev, sidebarOpen: !prev.sidebarOpen }));
  }, []);

  const setTheme = useCallback((theme: AppContextState['theme']) => {
    setState(prev => ({ ...prev, theme }));
    // Also update the document with the theme class for styling
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const setCurrentUser = useCallback((currentUser: User | null) => {
    setState(prev => ({ ...prev, currentUser }));
  }, []);

  const setCurrentWorkspace = useCallback((currentWorkspace: Workspace | null) => {
    setState(prev => ({ ...prev, currentWorkspace }));
  }, []);

  const logout = useCallback(() => {
    // Clear user and related state
    setState(prev => ({
      ...prev,
      currentUser: null,
      currentWorkspace: null,
    }));
    // Additional logout logic (clear tokens, etc.) would go here
  }, []);

  // Combine state and actions for the context value
  const value: AppContextValue = {
    ...state,
    toggleSidebar,
    setTheme,
    setCurrentUser,
    setCurrentWorkspace,
    logout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Custom hook for using the context
export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
} 