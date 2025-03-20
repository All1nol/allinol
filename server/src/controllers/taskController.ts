import { Request, Response } from 'express';
import Task, { ITask } from '../models/Task';

// Get all tasks
export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const tasks = await Task.find({}).populate('project');
    res.status(200).json(tasks);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ message: errorMessage });
  }
};

// Get a single task by ID
export const getTaskById = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await Task.findById(req.params.id).populate('project');
    
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
    
    // If task has a projectId, update the project's tasks array
    if (savedTask.projectId) {
      // Import Project model here to avoid circular dependencies
      const Project = require('../models/Project').default;
      
      // Add the task ID to the project's tasks array
      const updatedProject = await Project.findByIdAndUpdate(
        savedTask.projectId,
        { $addToSet: { tasks: savedTask._id } },
        { new: true }
      );
      
    }
    
    res.status(201).json(savedTask);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(400).json({ message: errorMessage });
  }
};

// Update a task
export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get the task before update to check for project changes
    const oldTask = await Task.findById(req.params.id);
    if (!oldTask) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    
    // Update the task
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    
    // Import Project model here to avoid circular dependencies
    const Project = require('../models/Project').default;
    
    // Handle project assignment changes
    const oldProjectId = oldTask.projectId?.toString();
    const newProjectId = task.projectId?.toString();
    
    
    // If projectId has changed
    if (oldProjectId !== newProjectId) {
      // Remove from old project if there was one
      if (oldProjectId) {
        const oldProject = await Project.findByIdAndUpdate(
          oldProjectId,
          { $pull: { tasks: task._id } },
          { new: true }
        );
      }
      
      // Add to new project if there is one
      if (newProjectId) {
        const newProject = await Project.findByIdAndUpdate(
          newProjectId,
          { $addToSet: { tasks: task._id } },
          { new: true }
        );
      }
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
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    
    // If task has a project, remove it from the project's tasks array
    if (task.projectId) {
      // Import Project model here to avoid circular dependencies
      const Project = require('../models/Project').default;
      
      // Remove the task ID from the project's tasks array
      const updatedProject = await Project.findByIdAndUpdate(
        task.projectId,
        { $pull: { tasks: task._id } },
        { new: true }
      );
      
    }
    
    // Delete the task
    await Task.findByIdAndDelete(req.params.id);
    
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
    const tasks = await Task.find({ category }).populate('project');
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
    const tasks = await Task.find({ status }).populate('project');
    res.status(200).json(tasks);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ message: errorMessage });
  }
};

// Get tasks by project
export const getTasksByProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { projectId } = req.params;
    const tasks = await Task.find({ projectId }).populate('project');
    res.status(200).json(tasks);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ message: errorMessage });
  }
}; 