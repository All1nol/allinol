import { useState } from 'react';
import { TaskList } from '../../components/tasks/TaskList';
import { TaskForm } from '../../components/tasks/TaskForm';
import { useTaskManager } from '../../hooks/useTaskManager';
import { Task } from '../../api/taskApi';

export function TasksPage() {
  const { selectedTask, selectTask } = useTaskManager();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Open the create task modal
  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  // Close the create task modal
  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  // Close the edit task modal
  const closeEditModal = () => {
    selectTask(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1>Tasks</h1>
        <button
          onClick={openCreateModal}
        >
          Create Task
        </button>
      </div>

      <TaskList />

      {/* Create Task Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Create New Task</h2>
            <TaskForm onClose={closeCreateModal} />
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Edit Task</h2>
            <TaskForm task={selectedTask} onClose={closeEditModal} />
          </div>
        </div>
      )}
    </div>
  );
} 