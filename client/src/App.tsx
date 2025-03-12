import { Routes, Route, Navigate } from 'react-router-dom';
import { TasksPage } from './pages/tasks/TasksPage';

function App() {
  return (
    <div>
      <div>
        {/* Main content */}
        <main>
          <div>
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
