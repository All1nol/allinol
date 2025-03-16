export enum PromptCategory {
  CONTENT_GENERATION = 'content_generation',
  PLANNING = 'planning',
  ANALYSIS = 'analysis',
  CREATIVE = 'creative',
  TECHNICAL = 'technical',
  EDUCATIONAL = 'educational',
  BUSINESS = 'business',
  OTHER = 'other'
}

export interface PromptVersion {
  version: number;
  content: string;
  description?: string;
  createdAt: string;
  createdBy: string;
  performance?: {
    successRate?: number;
    averageResponseTime?: number;
    userRating?: number;
    sampleSize?: number;
  };
}

export interface PromptTemplate {
  _id: string;
  title: string;
  description: string;
  category: PromptCategory;
  tags: string[];
  isActive: boolean;
  createdBy: {
    _id: string;
    username: string;
  };
  currentVersion: number;
  versions: PromptVersion[];
  createdAt: string;
  updatedAt: string;
} 