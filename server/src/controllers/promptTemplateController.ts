import { Request, Response } from 'express';
import { BaseController } from './base/baseController';
import { IPromptTemplate, PromptCategory } from '../models/PromptTemplate';
import promptTemplateService from '../services/promptTemplateService';

/**
 * Controller for prompt template operations
 */
export class PromptTemplateController extends BaseController<IPromptTemplate> {
  constructor() {
    super(promptTemplateService);
  }
  
  /**
   * Get all prompt templates with filtering
   */
  getAllTemplates = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      // Parse filters from query parameters
      const filters: {
        category?: PromptCategory;
        tags?: string[];
        isActive?: boolean;
        createdBy?: string;
      } = {};
      
      if (req.query.category) {
        filters.category = req.query.category as PromptCategory;
      }
      
      if (req.query.tags) {
        filters.tags = (req.query.tags as string).split(',');
      }
      
      if (req.query.isActive !== undefined) {
        filters.isActive = req.query.isActive === 'true';
      }
      
      if (req.query.createdBy) {
        filters.createdBy = req.query.createdBy as string;
      }
      
      const result = await promptTemplateService.getPromptTemplates(filters, page, limit);
      
      res.status(200).json({
        success: true,
        templates: result.templates,
        pagination: {
          total: result.total,
          page: result.page,
          totalPages: result.totalPages
        }
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(500).json({ success: false, message: errorMessage });
    }
  }
  
  /**
   * Add a new version to a prompt template
   */
  addVersion = async (req: Request, res: Response): Promise<void> => {
    try {
      const { promptId } = req.params;
      const { content, description } = req.body;
      
      if (!content) {
        res.status(400).json({ success: false, message: 'Content is required' });
        return;
      }
      
      // Assuming the user ID is available in req.user from authentication middleware
      const createdBy = (req.user as any)?.id || req.body.createdBy;
      
      if (!createdBy) {
        res.status(400).json({ success: false, message: 'User ID is required' });
        return;
      }
      
      const updatedTemplate = await promptTemplateService.addPromptVersion(
        promptId,
        { content, description, createdBy }
      );
      
      if (!updatedTemplate) {
        res.status(404).json({ success: false, message: 'Prompt template not found' });
        return;
      }
      
      res.status(200).json({
        success: true,
        template: updatedTemplate
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(500).json({ success: false, message: errorMessage });
    }
  }
  
  /**
   * Update performance metrics for a specific version
   */
  updateVersionPerformance = async (req: Request, res: Response): Promise<void> => {
    try {
      const { templateId, versionId } = req.params;
      const { successRate, avgResponseTime, userRating, sampleSize } = req.body;
      
      // Validate required fields
      if (sampleSize === undefined) {
        res.status(400).json({ success: false, message: 'Sample size is required' });
        return;
      }
      
      const performanceData = {
        successRate,
        averageResponseTime: avgResponseTime,
        userRating,
        sampleSize
      };
      
      const updatedTemplate = await promptTemplateService.updateVersionPerformance(
        templateId,
        parseInt(versionId),
        performanceData
      );
      
      if (!updatedTemplate) {
        res.status(404).json({ success: false, message: 'Template or version not found' });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: 'Performance metrics updated successfully'
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(500).json({ success: false, message: errorMessage });
    }
  }
  
  /**
   * Get a specific version of a prompt template
   */
  getVersion = async (req: Request, res: Response): Promise<void> => {
    try {
      const { templateId, versionId } = req.params;
      
      const version = await promptTemplateService.getPromptVersion(
        templateId,
        versionId ? parseInt(versionId) : undefined
      );
      
      if (!version) {
        res.status(404).json({ success: false, message: 'Template or version not found' });
        return;
      }
      
      res.status(200).json({
        success: true,
        version
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(500).json({ success: false, message: errorMessage });
    }
  }
}

// Export a singleton instance
export default new PromptTemplateController(); 