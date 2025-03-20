import express from 'express';
import promptTemplateController from '../controllers/promptTemplateController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Root routes
router.route('/')
  .get(promptTemplateController.getAllTemplates)
  .post(promptTemplateController.create);

// ID-based routes
router.route('/:id')
  .get(promptTemplateController.getById)
  .put(promptTemplateController.update)
  .delete(promptTemplateController.delete);

// Version routes
router.route('/:promptId/versions')
  .post(promptTemplateController.addVersion);

router.route('/:templateId/versions/:versionId')
  .get(promptTemplateController.getVersion);

router.route('/:templateId/versions/:versionId/performance')
  .put(promptTemplateController.updateVersionPerformance);

export default router;