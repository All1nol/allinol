import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Database connection options
const connectionOptions = {
  maxPoolSize: 10,
  minPoolSize: 2,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4
};

// Connect to MongoDB
export const connectDB = async (): Promise<typeof mongoose> => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URI || 'mongodb://localhost:27017/allinol', 
      connectionOptions
    );
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Set up connection monitoring
    mongoose.connection.on('error', err => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect...');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected successfully');
    });
    
    // Handle application termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed due to app termination');
      process.exit(0);
    });
    
    return mongoose;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error(`Error connecting to MongoDB: ${errorMessage}`);
    process.exit(1);
  }
};

// Check database health
export const checkDBHealth = async (): Promise<boolean> => {
  try {
    if (!mongoose.connection.db) {
      console.error('Database connection is not available');
      return false;
    }
    const status = await mongoose.connection.db.admin().ping();
    return !!status;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
};

// Get database statistics
export const getDBStats = async (): Promise<any> => {
  if (!mongoose.connection.db) {
    console.error('Database connection is not available');
    return null;
  }
  try {
    return await mongoose.connection.db.stats();
  } catch (error) {
    console.error('Failed to get database stats:', error);
    return null;
  }
}; 