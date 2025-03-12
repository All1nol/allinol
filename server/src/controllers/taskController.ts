import { Request, Response } from 'express';
import Task, { ITask } from '../models/Task';

// Get all tasks
export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const tasks = await Task.find({});
    res.status(200).json(tasks);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ message: errorMessage });
  }
};

// Get a single task by ID
export const getTaskById = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    
    res.status(200).json(task);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ message: errorMessage });
  }
};

// Create a new task
export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = new Task(req.body);
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(400).json({ message: errorMessage });
  }
};

// Update a task
export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    
    res.status(200).json(task);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(400).json({ message: errorMessage });
  }
};

// Delete a task
export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ message: errorMessage });
  }
};

// Get tasks by category
export const getTasksByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category } = req.params;
    const tasks = await Task.find({ category });
    res.status(200).json(tasks);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ message: errorMessage });
  }
};

// Get tasks by status
export const getTasksByStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.params;
    const tasks = await Task.find({ status });
    res.status(200).json(tasks);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ message: errorMessage });
  }
}; 