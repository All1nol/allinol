import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, checkDBHealth, getDBStats } from './utils/database';

// Import routes
import taskRoutes from './routes/taskRoutes';
import authRoutes from './routes/authRoutes';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Allinol API is running');
});

// Add health check endpoint
app.get('/health', async (req, res) => {
  try {
    const dbHealthy = await checkDBHealth();
    
    if (dbHealthy) {
      res.json({ 
        status: 'ok', 
        service: 'Allinol API',
        database: {
          status: 'connected',
          healthy: true
        }
      });
    } else {
      res.status(500).json({ 
        status: 'error', 
        service: 'Allinol API',
        database: {
          status: 'disconnected',
          healthy: false
        }
      });
    }
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      service: 'Allinol API',
      message: 'Health check failed'
    });
  }
});

// Add database stats endpoint (admin only - should be protected in production)
app.get('/api/admin/db-stats', async (req, res) => {
  try {
    const stats = await getDBStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get database stats' });
  }
});

// Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}); 