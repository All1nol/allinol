import PromptTemplate, { IPromptTemplate, IPromptVersion, PromptCategory } from '../models/PromptTemplate';
import mongoose from 'mongoose';

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

interface UpdateVersionPerformanceInput {
  promptId: string;
  version: number;
  successRate?: number;
  averageResponseTime?: number;
  userRating?: number;
  sampleSize?: number;
}

class PromptTemplateService {
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
    const query: any = {};
    
    if (filters.category) query.category = filters.category;
    if (filters.tags && filters.tags.length > 0) query.tags = { $in: filters.tags };
    if (filters.isActive !== undefined) query.isActive = filters.isActive;
    if (filters.createdBy) query.createdBy = filters.createdBy;
    
    const skip = (page - 1) * limit;
    
    const [templates, total] = await Promise.all([
      PromptTemplate.find(query)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('createdBy', 'username'),
      PromptTemplate.countDocuments(query)
    ]);
    
    const totalPages = Math.ceil(total / limit);
    
    return {
      templates,
      total,
      page,
      totalPages
    };
  }
  
  /**
   * Get a prompt template by ID
   */
  async getPromptTemplateById(id: string): Promise<IPromptTemplate | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    
    return await PromptTemplate.findById(id).populate('createdBy', 'username');
  }
  
  /**
   * Update a prompt template
   */
  async updatePromptTemplate(id: string, input: UpdatePromptTemplateInput): Promise<IPromptTemplate | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    
    return await PromptTemplate.findByIdAndUpdate(
      id,
      { $set: input },
      { new: true }
    );
  }
  
  /**
   * Create a new version of a prompt template
   */
  async createVersion(input: CreateVersionInput): Promise<IPromptTemplate | null> {
    const { promptId, content, description, userId } = input;
    
    if (!mongoose.Types.ObjectId.isValid(promptId)) {
      return null;
    }
    
    const promptTemplate = await PromptTemplate.findById(promptId);
    
    if (!promptTemplate) {
      return null;
    }
    
    const newVersion = promptTemplate.currentVersion + 1;
    
    promptTemplate.versions.push({
      version: newVersion,
      content,
      description,
      createdAt: new Date(),
      createdBy: userId,
      performance: {
        successRate: 0,
        averageResponseTime: 0,
        userRating: 0,
        sampleSize: 0
      }
    });
    
    promptTemplate.currentVersion = newVersion;
    
    return await promptTemplate.save();
  }
  
  /**
   * Get a specific version of a prompt template
   */
  async getPromptVersion(promptId: string, version?: number): Promise<IPromptVersion | null> {
    if (!mongoose.Types.ObjectId.isValid(promptId)) {
      return null;
    }
    
    const promptTemplate = await PromptTemplate.findById(promptId);
    
    if (!promptTemplate) {
      return null;
    }
    
    // If no version is specified, return the current version
    const versionToGet = version || promptTemplate.currentVersion;
    
    // Find the version in the versions array
    return promptTemplate.versions.find(v => v.version === versionToGet) || null;
  }
  
  /**
   * Update the performance metrics of a prompt version
   */
  async updateVersionPerformance(input: UpdateVersionPerformanceInput): Promise<IPromptTemplate | null> {
    const { promptId, version, ...performanceData } = input;
    
    if (!mongoose.Types.ObjectId.isValid(promptId)) {
      return null;
    }
    
    const promptTemplate = await PromptTemplate.findById(promptId);
    
    if (!promptTemplate) {
      return null;
    }
    
    // Find the version in the versions array
    const versionIndex = promptTemplate.versions.findIndex(v => v.version === version);
    
    if (versionIndex === -1) {
      return null;
    }
    
    // Update the performance metrics
    Object.entries(performanceData).forEach(([key, value]) => {
      if (value !== undefined) {
        // @ts-ignore - We know these properties exist
        promptTemplate.versions[versionIndex].performance[key] = value;
      }
    });
    
    return await promptTemplate.save();
  }
  
  /**
   * Delete a prompt template
   */
  async deletePromptTemplate(id: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return false;
    }
    
    const result = await PromptTemplate.deleteOne({ _id: id });
    
    return result.deletedCount === 1;
  }
}

export default new PromptTemplateService(); 