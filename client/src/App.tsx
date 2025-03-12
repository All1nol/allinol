import { Routes, Route, Navigate } from 'react-router-dom';
import { TasksPage } from './pages/tasks/TasksPage';
import { useAppContext } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';

function App() {
  const { theme, toggleSidebar, sidebarOpen, setTheme } = useAppContext();

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
        {/* Sidebar */}
        <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto relative">
          <Header 
            toggleSidebar={toggleSidebar} 
            theme={theme} 
            setTheme={(theme) => setTheme(theme as "light" | "dark" | "system")} 
          />
          
          <div className="py-6 px-4 lg:px-6">
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
