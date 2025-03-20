import express from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTasksByCategory,
  getTasksByStatus,
  getTasksByProject
} from '../controllers/taskController';

const router = express.Router();

// GET all tasks
router.get('/', getTasks);

// Filter routes
router.get('/category/:category', getTasksByCategory);
router.get('/status/:status', getTasksByStatus);
router.get('/project/:projectId', getTasksByProject);

// CRUD operations
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

// GET by ID (must be last to avoid conflicts with other routes)
router.get('/:id', getTaskById);

export default router; 