import mongoose from 'mongoose';
import PromptTemplate, { IPromptTemplate, IPromptVersion, PromptCategory } from '../models/PromptTemplate';
import { BaseService } from './base/baseService';

interface CreatePromptTemplateInput {
  title: string;
  description: string;
  category: PromptCategory;
  content: string;
  tags?: string[];
  userId: string;
}

interface UpdatePromptTemplateInput {
  title?: string;
  description?: string;
  category?: PromptCategory;
  tags?: string[];
  isActive?: boolean;
}

interface CreateVersionInput {
  promptId: string;
  content: string;
  description?: string;
  userId: string;
}

interface VersionPerformanceInput {
  successRate?: number;
  averageResponseTime?: number;
  userRating?: number;
  sampleSize?: number;
}

/**
 * Service for managing prompt templates
 */
class PromptTemplateService extends BaseService<IPromptTemplate> {
  constructor() {
    super(PromptTemplate);
  }

  /**
   * Create a new prompt template
   */
  async createPromptTemplate(input: CreatePromptTemplateInput): Promise<IPromptTemplate> {
    const { title, description, category, content, tags = [], userId } = input;
    
    const promptTemplate = new PromptTemplate({
      title,
      description,
      category,
      tags,
      createdBy: userId,
      currentVersion: 1,
      versions: [{
        version: 1,
        content,
        createdAt: new Date(),
        createdBy: userId
      }]
    });
    
    return await promptTemplate.save();
  }
  
  /**
   * Get all prompt templates with optional filtering
   */
  async getPromptTemplates(
    filters: { 
      category?: PromptCategory; 
      tags?: string[]; 
      isActive?: boolean;
      createdBy?: string;
    } = {},
    page = 1,
    limit = 10
  ): Promise<{ templates: IPromptTemplate[]; total: number; page: number; totalPages: number }> {
    const query: mongoose.FilterQuery<IPromptTemplate> = {};
    
    if (filters.category) query.category = filters.category;
    if (filters.tags && filters.tags.length > 0) query.tags = { $in: filters.tags };
    if (filters.isActive !== undefined) query.isActive = filters.isActive;
    if (filters.createdBy) query.createdBy = filters.createdBy;
    
    const result = await this.findAll(query, page, limit, { updatedAt: -1 }, 'createdBy');
    
    return {
      templates: result.data,
      total: result.total,
      page: result.page,
      totalPages: result.totalPages
    };
  }
  
  /**
   * Get a prompt template by ID
   */
  async getPromptTemplateById(id: string): Promise<IPromptTemplate | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    
    return await this.findById(id);
  }
  
  /**
   * Update a prompt template
   */
  async updatePromptTemplate(id: string, input: UpdatePromptTemplateInput): Promise<IPromptTemplate | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    
    return await this.update(id, input);
  }
  
  /**
   * Add a new version to a prompt template
   */
  async addPromptVersion(
    promptId: string,
    versionData: { 
      content: string;
      description?: string;
      createdBy: string;
    }
  ): Promise<IPromptTemplate | null> {
    if (!mongoose.Types.ObjectId.isValid(promptId)) {
      return null;
    }
    
    const promptTemplate = await this.findById(promptId);
    
    if (!promptTemplate) {
      return null;
    }
    
    // Calculate the next version number
    const nextVersion = promptTemplate.versions.length > 0
      ? Math.max(...promptTemplate.versions.map(v => v.version)) + 1
      : 1;
    
    // Create the new version
    const newVersion: IPromptVersion = {
      version: nextVersion,
      content: versionData.content,
      description: versionData.description,
      createdBy: versionData.createdBy,
      createdAt: new Date()
    };
    
    // Add to versions array and update the current version
    promptTemplate.versions.push(newVersion);
    promptTemplate.currentVersion = nextVersion;
    
    await promptTemplate.save();
    return promptTemplate;
  }
  
  /**
   * Update performance metrics for a specific version
   */
  async updateVersionPerformance(
    promptId: string,
    versionId: number,
    performanceData: VersionPerformanceInput
  ): Promise<IPromptTemplate | null> {
    if (!mongoose.Types.ObjectId.isValid(promptId)) {
      return null;
    }
    
    const promptTemplate = await this.findById(promptId);
    
    if (!promptTemplate) {
      return null;
    }
    
    // Find the version in the versions array
    const versionIndex = promptTemplate.versions.findIndex(v => v.version === versionId);
    
    if (versionIndex === -1) {
      return null;
    }
    
    // Update the performance metrics
    promptTemplate.versions[versionIndex].performance = {
      ...promptTemplate.versions[versionIndex].performance,
      ...performanceData
    };
    
    await promptTemplate.save();
    return promptTemplate;
  }
  
  /**
   * Get a specific version of a prompt template
   */
  async getPromptVersion(promptId: string, version?: number): Promise<IPromptVersion | null> {
    if (!mongoose.Types.ObjectId.isValid(promptId)) {
      return null;
    }
    
    const promptTemplate = await this.findById(promptId);
    
    if (!promptTemplate) {
      return null;
    }
    
    // If no version is specified, return the current version
    const versionToGet = version || promptTemplate.currentVersion;
    
    // Find the version in the versions array
    return promptTemplate.versions.find(v => v.version === versionToGet) || null;
  }
  
  /**
   * Delete a prompt template
   */
  async deletePromptTemplate(id: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return false;
    }
    
    return await this.delete(id);
  }
}

// Export a singleton instance
export default new PromptTemplateService(); 