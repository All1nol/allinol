import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Task from '../models/Task';
import { TaskCategory, TaskPriority, TaskStatus } from '../models/Task';

// Load environment variables
dotenv.config();

// Sample tasks data
const sampleTasks = [
  {
    title: 'Set up project structure',
    description: 'Create the basic folder structure for the project and initialize Git repository.',
    category: TaskCategory.DEVELOPMENT,
    priority: TaskPriority.HIGH,
    status: TaskStatus.DONE,
    dueDate: new Date('2023-04-15'),
    tags: ['setup', 'infrastructure']
  },
  {
    title: 'Design database schema',
    description: 'Create the database schema for the application including all required models and relationships.',
    category: TaskCategory.DEVELOPMENT,
    priority: TaskPriority.HIGH,
    status: TaskStatus.DONE,
    dueDate: new Date('2023-04-20'),
    tags: ['database', 'design']
  },
  {
    title: 'Implement user authentication',
    description: 'Set up user authentication with JWT tokens and role-based access control.',
    category: TaskCategory.DEVELOPMENT,
    priority: TaskPriority.HIGH,
    status: TaskStatus.IN_PROGRESS,
    dueDate: new Date('2023-05-01'),
    tags: ['auth', 'security']
  },
  {
    title: 'Create UI components',
    description: 'Design and implement reusable UI components using React and TailwindCSS.',
    category: TaskCategory.DESIGN,
    priority: TaskPriority.MEDIUM,
    status: TaskStatus.IN_PROGRESS,
    dueDate: new Date('2023-05-10'),
    tags: ['frontend', 'ui']
  },
  {
    title: 'Implement task management API',
    description: 'Create REST API endpoints for task CRUD operations.',
    category: TaskCategory.DEVELOPMENT,
    priority: TaskPriority.MEDIUM,
    status: TaskStatus.TODO,
    dueDate: new Date('2023-05-15'),
    tags: ['api', 'backend']
  },
  {
    title: 'Write documentation',
    description: 'Create comprehensive documentation for the API and application usage.',
    category: TaskCategory.MANAGEMENT,
    priority: TaskPriority.LOW,
    status: TaskStatus.TODO,
    dueDate: new Date('2023-06-01'),
    tags: ['docs', 'writing']
  },
  {
    title: 'Set up CI/CD pipeline',
    description: 'Configure continuous integration and deployment pipeline using GitHub Actions.',
    category: TaskCategory.DEVELOPMENT,
    priority: TaskPriority.MEDIUM,
    status: TaskStatus.TODO,
    dueDate: new Date('2023-05-20'),
    tags: ['devops', 'automation']
  },
  {
    title: 'Implement AI-powered PRD analysis',
    description: 'Integrate with OpenAI API to analyze PRDs and extract tasks automatically.',
    category: TaskCategory.DEVELOPMENT,
    priority: TaskPriority.HIGH,
    status: TaskStatus.TODO,
    dueDate: new Date('2023-05-25'),
    tags: ['ai', 'integration']
  }
];

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/allinol');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error(`Error: ${errorMessage}`);
    process.exit(1);
  }
};

// Seed the database
const seedDB = async () => {
  try {
    // Clear existing data
    await Task.deleteMany({});
    console.log('Data cleared...');

    // Insert sample tasks
    const createdTasks = await Task.insertMany(sampleTasks);
    console.log(`${createdTasks.length} tasks inserted!`);

    console.log('Data seeded successfully!');
    process.exit(0);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error(`Error seeding data: ${errorMessage}`);
    process.exit(1);
  }
};

// Run the seed function
connectDB().then(() => {
  seedDB();
}); 