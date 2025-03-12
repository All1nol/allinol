import mongoose, { Document, Schema } from 'mongoose';

// Task categories based on roles
export enum TaskCategory {
  DEVELOPMENT = 'development',
  DESIGN = 'design',
  MARKETING = 'marketing',
  MANAGEMENT = 'management',
  OTHER = 'other'
}

// Task priority levels
export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

// Task status options
export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  REVIEW = 'review',
  DONE = 'done'
}

// Task interface
export interface ITask extends Document {
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  assignedTo?: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  projectId?: string;
  parentTaskId?: string;
  subtasks?: string[];
  tags?: string[];
}

// Task schema
const TaskSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [100, 'Task title cannot be more than 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Task description is required'],
      trim: true
    },
    category: {
      type: String,
      enum: Object.values(TaskCategory),
      default: TaskCategory.OTHER
    },
    priority: {
      type: String,
      enum: Object.values(TaskPriority),
      default: TaskPriority.MEDIUM
    },
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.TODO
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    dueDate: {
      type: Date,
      required: false
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: false
    },
    parentTaskId: {
      type: Schema.Types.ObjectId,
      ref: 'Task',
      required: false
    },
    subtasks: [{
      type: Schema.Types.ObjectId,
      ref: 'Task'
    }],
    tags: [{
      type: String,
      trim: true
    }]
  },
  {
    timestamps: true
  }
);

export default mongoose.model<ITask>('Task', TaskSchema); 