import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Login from './pages/auth/Login';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { TasksPage } from './pages/tasks/TasksPage';
import Register from './pages/auth/Register';
import { Layout } from './components/layout/Layout';

function App() {
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
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<TasksPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/dashboard" element={<TasksPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
