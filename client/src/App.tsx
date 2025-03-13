import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { TasksPage } from './pages/tasks/TasksPage';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Apply theme class to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <Header toggleSidebar={toggleSidebar} theme={theme} setTheme={setTheme} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="h-full">
            <Routes>
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/" element={<Navigate to="/tasks" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
