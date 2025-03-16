import mongoose, { Document, Schema } from 'mongoose';

// Prompt template categories
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

// Interface for version history
export interface IPromptVersion {
  version: number;
  content: string;
  description?: string;
  createdAt: Date;
  createdBy: string; // User ID
  performance?: {
    successRate?: number;
    averageResponseTime?: number;
    userRating?: number;
    sampleSize?: number;
  };
}

// Prompt template interface
export interface IPromptTemplate extends Document {
  title: string;
  description: string;
  category: PromptCategory;
  tags: string[];
  isActive: boolean;
  createdBy: string; // User ID
  createdAt: Date;
  updatedAt: Date;
  currentVersion: number;
  versions: IPromptVersion[];
}

// Schema for version history
const PromptVersionSchema = new Schema({
  version: {
    type: Number,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  performance: {
    successRate: Number,
    averageResponseTime: Number,
    userRating: Number,
    sampleSize: Number
  }
}, { _id: false });

// Prompt template schema
const PromptTemplateSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Prompt title is required'],
      trim: true,
      maxlength: [100, 'Prompt title cannot be more than 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Prompt description is required'],
      trim: true
    },
    category: {
      type: String,
      enum: Object.values(PromptCategory),
      default: PromptCategory.OTHER
    },
    tags: [{
      type: String,
      trim: true
    }],
    isActive: {
      type: Boolean,
      default: true
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    currentVersion: {
      type: Number,
      default: 1
    },
    versions: [PromptVersionSchema]
  },
  {
    timestamps: true
  }
);

// Add indexes for frequently queried fields
PromptTemplateSchema.index({ category: 1 }); // Index for category queries
PromptTemplateSchema.index({ tags: 1 }); // Index for tag queries
PromptTemplateSchema.index({ createdBy: 1 }); // Index for user queries
PromptTemplateSchema.index({ isActive: 1 }); // Index for active template queries
PromptTemplateSchema.index({ 'versions.version': 1 }); // Index for version queries

// Create the model
const PromptTemplateModel = mongoose.model<IPromptTemplate>('PromptTemplate', PromptTemplateSchema);

// Function to get a specific version or the current version if no version number is provided
export const getPromptVersion = (
  promptTemplate: IPromptTemplate, 
  versionNumber?: number
): IPromptVersion | null => {
  // If no version number is provided, use the current version
  const targetVersion = versionNumber || promptTemplate.currentVersion;
  // Find the version in the versions array
  const version = promptTemplate.versions.find(v => v.version === targetVersion);
  
  return version || null;
};

export default PromptTemplateModel; 