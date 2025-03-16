import express from 'express';
import {
  createPromptTemplate,
  getPromptTemplates,
  getPromptTemplateById,
  updatePromptTemplate,
  deletePromptTemplate,
  createVersion,
  getPromptVersion,
  updateVersionPerformance
} from '../controllers/promptTemplateController';
import { verifyToken } from '../middleware/authMiddleware';
import { checkRole } from '../middleware/roleMiddleware';
import { UserRole } from '../models/User';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Routes accessible to all authenticated users
router.get('/', getPromptTemplates);
router.get('/:id', getPromptTemplateById);
router.get('/:id/versions/:version?', getPromptVersion);

// Routes that require admin role
router.post('/', checkRole([UserRole.ADMIN]), createPromptTemplate);
router.put('/:id', checkRole([UserRole.ADMIN]), updatePromptTemplate);
router.delete('/:id', checkRole([UserRole.ADMIN]), deletePromptTemplate);
router.post('/:id/versions', checkRole([UserRole.ADMIN]), createVersion);
router.patch('/:id/versions/:version/performance', checkRole([UserRole.ADMIN]), updateVersionPerformance);

export default router; 