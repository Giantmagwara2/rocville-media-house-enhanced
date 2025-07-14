import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import utilities and middleware
import { connectDatabase } from './config/database';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';

// Import routes
import aiAgentRoutes from './routes/ai-agent';
import analyticsRoutes from './routes/analytics';
import authRoutes from './routes/auth';
import contactRoutes from './routes/contact';
import portfolioRoutes from './routes/portfolio';
import servicesRoutes from './routes/services';
import trainingRoutes from './routes/training';

const app = express();
const PORT = process.env.PORT || 3001;

// Trust proxy
app.set('trust proxy', 1);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});
app.use(limiter);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for development
}));

// Logging
app.use(morgan('combined'));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-domain.com'] 
    : ['http://localhost:5173', 'http://0.0.0.0:5173'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/ai', aiAgentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/training', trainingRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Try to connect to database, but continue without it if connection fails
    try {
      await connectDatabase();
      logger.info('✅ Database connected successfully');
    } catch (dbError) {
      logger.warn('⚠️  Database connection failed, running in offline mode:', dbError);
      // Continue without database - API will work with in-memory storage
    }

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, '0.0.0.0', () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📝 API Documentation: http://localhost:${PORT}/api-docs`);
      logger.info(`🤖 AI Agent Status: Active`);
      logger.info(`📊 Analytics: Enabled`);
      logger.info(`🧠 Training System: Ready`);
      logger.info(`🔧 Advanced AI Processor: Loaded`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();