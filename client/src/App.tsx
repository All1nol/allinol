import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Login from './pages/auth/Login';
import { TasksPage } from './pages/tasks/TasksPage';
import Register from './pages/auth/Register';
import { Layout } from './components/layout/Layout';
import PromptTemplates from './pages/admin/PromptTemplates';
import AdminPromptTemplates from './pages/admin/AdminPromptTemplates';
import AIChat from './pages/AIChat';
import AIWorkflowPage from './pages/AIWorkflowPage';
import { useAuth } from './context/AuthContext';
import { UserRole } from './types/user';

function App() {
  const { user, isAuthenticated } = useAuth();
  const isAdmin = user?.role === UserRole.ADMIN;

  // Initialize theme from localStorage or system preference on app load
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  }, []);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected routes */}
      <Route path="/" element={
        isAuthenticated ? <Layout /> : <Navigate to="/login" />
      }>
        <Route index element={<Navigate to="/tasks" />} />
        <Route path="tasks" element={<TasksPage />} />
        <Route path="tasks/:id" element={<TasksPage />} />
        <Route path="ai-chat" element={<AIChat />} />
        <Route path="ai-workflow" element={<AIWorkflowPage />} />
        
        {/* Admin routes */}
        <Route path="admin">
          <Route path="prompt-templates" element={
            isAdmin ? <AdminPromptTemplates /> : <Navigate to="/tasks" />
          } />
          <Route path="api-prompt-templates" element={
            isAdmin ? <PromptTemplates /> : <Navigate to="/tasks" />
          } />
        </Route>
      </Route>
      
      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
