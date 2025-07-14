import express from 'express';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { 
  securityHeaders, 
  apiRateLimit, 
  strictRateLimit,
  sanitizeInput,
  requestLogger,
  corsConfig,
  preventSQLInjection
} from './middleware/security.js';
import { trackSuspiciousActivity } from './utils/securityAudit.js';

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
import { AdvancedAIProcessor } from './services/advancedAIProcessor';
import { TrainingManager } from './services/trainingManager';
import { productionConfig } from './config/production';

// Initialize advanced AI systems
const advancedAI = new AdvancedAIProcessor();
const trainingManager = new TrainingManager();

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
app.use(securityHeaders);
app.use(cors(corsConfig));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));
app.use(requestLogger);
app.use(sanitizeInput);
app.use(preventSQLInjection);
app.use(trackSuspiciousActivity);
app.use(apiRateLimit);

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

    const { port, host } = productionConfig;

    app.listen(port, host, () => {
      logger.info(`🚀 Server running on ${host}:${port}`);
      logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
// Initialize AI systems
  logger.info('🤖 AI Agent Status: Active');
  logger.info('📊 Analytics: Enabled');
  logger.info('🧠 Training System: Ready');
  logger.info('🔧 Advanced AI Processor: Loaded');

  // Initialize advanced AI features
  try {
    trainingManager.initializeTraining().then(() => {
      logger.info('🎯 Advanced AI Training: Initialized');
      logger.info('🔍 Lead Research Engine: Active');
      logger.info('📧 Cold Email Automation: Ready');
      logger.info('📞 Cold Call System: Configured');
      logger.info('🎨 Multi-Modal Processing: Enabled');
    }).catch((error) => {
      logger.warn('⚠️ Advanced AI initialization failed, running in basic mode:', error.message);
    });
  } catch (error) {
    logger.warn('⚠️ Advanced AI initialization failed, running in basic mode:', error.message);
  }
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();