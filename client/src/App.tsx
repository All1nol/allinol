import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Login from './pages/auth/Login';
import { TasksPage } from './pages/tasks/TasksPage';
import { ProjectsPage } from './pages/projects/ProjectsPage';
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
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/tasks" />} />
      <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/tasks" />} />

      {/* Protected routes */}
      <Route element={<Layout />}>
        {/* Redirect root to tasks */}
        <Route path="/" element={<Navigate to="/tasks" />} />
        
        {/* Main app routes */}
        <Route
          path="/tasks"
          element={isAuthenticated ? <TasksPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/projects"
          element={isAuthenticated ? <ProjectsPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/ai-chat"
          element={isAuthenticated ? <AIChat /> : <Navigate to="/login" />}
        />
        <Route
          path="/ai-workflow"
          element={isAuthenticated ? <AIWorkflowPage /> : <Navigate to="/login" />}
        />

        {/* Admin routes */}
        <Route
          path="/admin/prompt-templates"
          element={isAuthenticated && isAdmin ? <AdminPromptTemplates /> : <Navigate to="/login" />}
        />
        <Route
          path="/prompt-templates"
          element={isAuthenticated ? <PromptTemplates /> : <Navigate to="/login" />}
        />
      </Route>
    </Routes>
  );
}

export default App;
