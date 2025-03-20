import express from 'express';
import {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    getProjectsByStatus,
    getProjectsByOwner,
    getProjectsByMember,
    getProjectsByTag,
    getProjectsByColor,
    getProjectTasks
} from '../controllers/projectController';
const router = express.Router();

// Get all projects
router.get('/', getProjects);

// Get projects by specific filters
router.get('/status/:status', getProjectsByStatus);
router.get('/owner/:owner', getProjectsByOwner);
router.get('/member/:member', getProjectsByMember);
router.get('/tag/:tag', getProjectsByTag);
router.get('/color/:color', getProjectsByColor);

// Project CRUD operations
router.post('/', createProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

// Get project by ID and related operations
router.get('/:id/tasks', getProjectTasks);
router.get('/:id', getProjectById);

export default router;
