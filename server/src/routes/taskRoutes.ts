import express from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTasksByCategory,
  getTasksByStatus
} from '../controllers/taskController';

const router = express.Router();

// GET all tasks
router.get('/', getTasks);

// GET a single task by ID
router.get('/:id', getTaskById);

// POST a new task
router.post('/', createTask);

// PUT update a task
router.put('/:id', updateTask);

// DELETE a task
router.delete('/:id', deleteTask);

// GET tasks by category
router.get('/category/:category', getTasksByCategory);

// GET tasks by status
router.get('/status/:status', getTasksByStatus);

export default router; 