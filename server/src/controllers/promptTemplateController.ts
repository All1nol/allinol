import { Request, Response } from 'express';
import promptTemplateService from '../services/promptTemplateService';
import { PromptCategory } from '../models/PromptTemplate';

/**
 * Create a new prompt template
 * @route POST /api/prompt-templates
 */
export const createPromptTemplate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, category, content, tags } = req.body;
    
    // Validate required fields
    if (!title || !description || !category || !content) {
      res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
      return;
    }
    
    // Validate category
    if (!Object.values(PromptCategory).includes(category as PromptCategory)) {
      res.status(400).json({ 
        success: false, 
        message: 'Invalid category' 
      });
      return;
    }
    
    // @ts-ignore - We know req.user exists from auth middleware
    const userId = req.user.id;
    
    const promptTemplate = await promptTemplateService.createPromptTemplate({
      title,
      description,
      category: category as PromptCategory,
      content,
      tags,
      userId
    });
    
    res.status(201).json({
      success: true,
      data: promptTemplate
    });
  } catch (error) {
    console.error('Error creating prompt template:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * Get all prompt templates with optional filtering
 * @route GET /api/prompt-templates
 */
export const getPromptTemplates = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      category, 
      tags, 
      isActive, 
      createdBy,
      page = '1',
      limit = '10'
    } = req.query;
    
    const filters: any = {};
    
    if (category) {
      filters.category = category;
    }
    
    if (tags) {
      filters.tags = Array.isArray(tags) ? tags : [tags];
    }
    
    if (isActive !== undefined) {
      filters.isActive = isActive === 'true';
    }
    
    if (createdBy) {
      filters.createdBy = createdBy;
    }
    
    const result = await promptTemplateService.getPromptTemplates(
      filters,
      parseInt(page as string),
      parseInt(limit as string)
    );
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error getting prompt templates:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * Get a prompt template by ID
 * @route GET /api/prompt-templates/:id
 */
export const getPromptTemplateById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const promptTemplate = await promptTemplateService.getPromptTemplateById(id);
    
    if (!promptTemplate) {
      res.status(404).json({
        success: false,
        message: 'Prompt template not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: promptTemplate
    });
  } catch (error) {
    console.error('Error getting prompt template:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * Update a prompt template
 * @route PUT /api/prompt-templates/:id
 */
export const updatePromptTemplate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, category, tags, isActive } = req.body;
    
    // Validate category if provided
    if (category && !Object.values(PromptCategory).includes(category as PromptCategory)) {
      res.status(400).json({ 
        success: false, 
        message: 'Invalid category' 
      });
      return;
    }
    
    const updatedPromptTemplate = await promptTemplateService.updatePromptTemplate(id, {
      title,
      description,
      category: category as PromptCategory,
      tags,
      isActive
    });
    
    if (!updatedPromptTemplate) {
      res.status(404).json({
        success: false,
        message: 'Prompt template not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: updatedPromptTemplate
    });
  } catch (error) {
    console.error('Error updating prompt template:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * Create a new version of a prompt template
 * @route POST /api/prompt-templates/:id/versions
 */
export const createVersion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { content, description } = req.body;
    
    if (!content) {
      res.status(400).json({ 
        success: false, 
        message: 'Content is required' 
      });
      return;
    }
    
    // @ts-ignore - We know req.user exists from auth middleware
    const userId = req.user.id;
    
    const updatedPromptTemplate = await promptTemplateService.createVersion({
      promptId: id,
      content,
      description,
      userId
    });
    
    if (!updatedPromptTemplate) {
      res.status(404).json({
        success: false,
        message: 'Prompt template not found'
      });
      return;
    }
    
    res.status(201).json({
      success: true,
      data: updatedPromptTemplate
    });
  } catch (error) {
    console.error('Error creating prompt version:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * Get a specific version of a prompt template
 * @route GET /api/prompt-templates/:id/versions/:version
 */
export const getPromptVersion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, version } = req.params;
    
    const promptVersion = await promptTemplateService.getPromptVersion(
      id,
      version ? parseInt(version) : undefined
    );
    
    if (!promptVersion) {
      res.status(404).json({
        success: false,
        message: 'Prompt version not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: promptVersion
    });
  } catch (error) {
    console.error('Error getting prompt version:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * Update the performance metrics of a prompt version
 * @route PATCH /api/prompt-templates/:id/versions/:version/performance
 */
export const updateVersionPerformance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, version } = req.params;
    const { successRate, averageResponseTime, userRating, sampleSize } = req.body;
    
    const updatedPromptTemplate = await promptTemplateService.updateVersionPerformance({
      promptId: id,
      version: parseInt(version),
      successRate,
      averageResponseTime,
      userRating,
      sampleSize
    });
    
    if (!updatedPromptTemplate) {
      res.status(404).json({
        success: false,
        message: 'Prompt template or version not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: updatedPromptTemplate
    });
  } catch (error) {
    console.error('Error updating prompt version performance:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * Delete a prompt template
 * @route DELETE /api/prompt-templates/:id
 */
export const deletePromptTemplate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const deleted = await promptTemplateService.deletePromptTemplate(id);
    
    if (!deleted) {
      res.status(404).json({
        success: false,
        message: 'Prompt template not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'Prompt template deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting prompt template:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}; 