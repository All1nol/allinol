import { Request, Response } from 'express';
import Project  from '../models/Project';

// Get all projects
export const getProjects = async (req: Request, res: Response): Promise<void> => {
    try{
        const projects = await Project.find({}).populate('tasks');    
        res.status(200).json(projects);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        res.status(500).json({ message: errorMessage });
    }
};

// Get a single project by ID
export const getProjectById = async (req: Request, res: Response): Promise<void> => {
    try{
        const project = await Project.findById(req.params.id).populate('tasks');
        if(!project){
            res.status(404).json({ message: 'Project not found' });
            return;
        }
        res.status(200).json(project);
    } catch (error: unknown) {  
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        res.status(500).json({ message: errorMessage });
    }
};

// Create a new project
export const createProject = async (req: Request, res: Response): Promise<void> => {
    try{
        const project = new Project(req.body);
        const savedProject = await project.save();
        res.status(201).json(savedProject);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        res.status(400).json({ message: errorMessage });
    }
};

export const updateProject = async (req: Request, res: Response): Promise<void> => {
    try{
        const project = await Project.findByIdAndUpdate(
            req.params.id, 
            req.body,
            { new: true, runValidators: true });
        if(!project){
            res.status(404).json({ message: 'Project not found' });
            return;
        }
        res.status(200).json(project);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'; 
        res.status(400).json({ message: errorMessage });
    }
};

// Delete a project
export const deleteProject = async (req: Request, res: Response): Promise<void> => {
    try{
        const project = await Project.findByIdAndDelete(req.params.id);
        if(!project){
            res.status(404).json({ message: 'Project not found' });
            return;
        }
        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error: unknown) {  
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        res.status(500).json({ message: errorMessage });
    }
};

// Get projects by status
export const getProjectsByStatus = async (req: Request, res: Response): Promise<void> => {
    try{
        const { status } = req.params;  
        const projects = await Project.find({ status }).populate('tasks');
        res.status(200).json(projects);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        res.status(500).json({ message: errorMessage });
    }
};

// Get projects by owner
export const getProjectsByOwner = async (req: Request, res: Response): Promise<void> => {
    try{
        const { owner } = req.params;
        const projects = await Project.find({ owner }).populate('tasks');
        res.status(200).json(projects);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        res.status(500).json({ message: errorMessage });
    }
};

// Get projects by member
export const getProjectsByMember = async (req: Request, res: Response): Promise<void> => {
    try{
        const { member } = req.params;
        const projects = await Project.find({ members: member }).populate('tasks');
        res.status(200).json(projects);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        res.status(500).json({ message: errorMessage });
    }
};

// Get projects by tag
export const getProjectsByTag = async (req: Request, res: Response): Promise<void> => {
    try{
        const { tag } = req.params;
        const projects = await Project.find({ tags: tag }).populate('tasks');
        res.status(200).json(projects);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        res.status(500).json({ message: errorMessage });
    }
};

// Get projects by date range
export const getProjectsByDateRange = async (req: Request, res: Response): Promise<void> => {
    try{
        const { startDate, endDate } = req.params;
        const projects = await Project.find({
            startDate: { $gte: startDate },
            endDate: { $lte: endDate }
        }).populate('tasks');
        res.status(200).json(projects);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        res.status(500).json({ message: errorMessage });
    }       
};

// Get projects by color
export const getProjectsByColor = async (req: Request, res: Response): Promise<void> => {
    try{
        const { color } = req.params;
        const projects = await Project.find({ color }).populate('tasks');
        res.status(200).json(projects);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        res.status(500).json({ message: errorMessage });
    }
};

// Get projects by name
export const getProjectsByName = async (req: Request, res: Response): Promise<void> => {
    try{
        const { name } = req.params;    
        const projects = await Project.find({ name });
        res.status(200).json(projects);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        res.status(500).json({ message: errorMessage });
    }
};

// Get projects by description
export const getProjectsByDescription = async (req: Request, res: Response): Promise<void> => {
    try{
        
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        res.status(500).json({ message: errorMessage });
    }
};

// Get tasks for a specific project
export const getProjectTasks = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        
        // Import Task model here to avoid circular dependencies
        const Task = require('../models/Task').default;
        
        const tasks = await Task.find({ projectId: id }).populate('project');
        res.status(200).json(tasks);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        res.status(500).json({ message: errorMessage });
    }
};


