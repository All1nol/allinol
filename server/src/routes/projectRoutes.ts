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
    getProjectsByColor
} from '../controllers/projectController';
const router = express.Router();

router.get('/', getProjects);
router.get('/:id', getProjectById);
router.post('/', createProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);
router.get('/status/:status', getProjectsByStatus);
router.get('/owner/:owner', getProjectsByOwner);
router.get('/member/:member', getProjectsByMember);
router.get('/tag/:tag', getProjectsByTag);
router.get('/color/:color', getProjectsByColor);

export default router;
