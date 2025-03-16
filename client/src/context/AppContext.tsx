import { createContext, useContext, ReactNode, useState } from 'react';

// Define the types for our context

// Define the context actions/functions
interface AppContextActions {
  // Remove UI-related state and functions
}

// Combine state and actions for the full context value
type AppContextValue = AppContextActions;

// Create the context with a default value
const AppContext = createContext<AppContextValue | undefined>(undefined);

// Initial state
const initialState: AppContextValue = {
  // Remove UI-related state
};

// Provider component
export function AppProvider({ children }: { children: ReactNode }) {
  const [_state, _setState] = useState<AppContextValue>(initialState);

  // Combine state and actions for the context value
  const value: AppContextValue = {
    // Remove UI-related state and functions
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