import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.tsx';
import { AppProvider } from './context/AppContext.tsx';
import { TaskProvider } from './context/TaskContext.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { HashRouter } from 'react-router-dom';
// Import Tailwind CSS
import './styles.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <AuthProvider>
          <AppProvider>
            <TaskProvider>
              <App />
            </TaskProvider>
          </AppProvider>
        </AuthProvider>
      </HashRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
