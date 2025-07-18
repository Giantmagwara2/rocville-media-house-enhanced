import { createWebSocketServer } from './services/eventStreamService';
// WebSocket server for real-time event streaming
import http from 'http';
// httpServer and createWebSocketServer will be initialized after app is declared
import { sendLayer2Transaction, verifyDID, getMultiChainBalance } from './services/blockchainService';
import { getAIResponse } from './services/aiConciergeService';
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { securityHeaders, apiRateLimit, strictRateLimit, sanitizeInput, requestLogger, corsConfig, preventSQLInjection } from './middleware/security';
import { trackSuspiciousActivity } from './utils/securityAudit';
import { enforceHTTPS } from './middleware/httpsEnforce';
import webhookRouter from './routes/webhook';

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
import healthRoutes from './routes/health';
import { AdvancedAIProcessor } from './services/advancedAIProcessor';

// External integrations
import { fetchMarketData } from './services/marketDataService';
import { fetchESGData } from './services/esgService';
import { getDiversificationTools } from './services/fintechPartnerService';
import { shareToSocial } from './services/socialShareService';
import { TrainingManager } from './services/trainingManager';
import { productionConfig } from './config/production';
import { errorRecoveryMiddleware } from './middleware/errorRecovery';

// Initialize advanced AI systems
const advancedAI = new AdvancedAIProcessor();
const trainingManager = new TrainingManager();

const app = express();
const PORT = process.env.PORT || 3001;
let httpServer: http.Server;

// Trust proxy
app.set('trust proxy', 1);

// Enforce HTTPS
app.use(enforceHTTPS);

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
app.set('trust proxy', 1);
app.use(enforceHTTPS);
app.use(limiter);
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
app.use(errorRecoveryMiddleware);

// Webhook route for external event triggers
app.use('/api', webhookRouter);

// Routes
app.use('/api/ai', aiAgentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/training', trainingRoutes);
app.use('/api/health', healthRoutes);

// Health check
app.get('/api/health', (req: express.Request, res: express.Response) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Layer 2 Transaction API
app.post('/api/layer2-tx', async (req: express.Request, res: express.Response) => {
  try {
    const { network, txData } = req.body as { network: 'optimism' | 'arbitrum'; txData: any };
    const result = await sendLayer2Transaction(network, txData);
    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Decentralized Identity (DID) Verification API
app.get('/api/verify-did', async (req: express.Request, res: express.Response) => {
  try {
    const ethAddress = req.query.ethAddress as string;
    const result = await verifyDID(ethAddress);
    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Multi-Chain Balance API
app.get('/api/multichain-balance', async (req: express.Request, res: express.Response) => {
  try {
    const address = req.query.address as string;
    const result = await getMultiChainBalance(address);
    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// AI Concierge Chat API
app.post('/api/ai-concierge', async (req: express.Request, res: express.Response) => {
  try {
    const { messages } = req.body as { messages: any };
    const response = await getAIResponse(messages);
    return res.json({ response });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Market Data API
app.get('/api/market-data', async (req: express.Request, res: express.Response) => {
  try {
    const symbol = req.query.symbol as string;
    const data = await fetchMarketData(symbol);
    return res.json(data);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// ESG Score API
app.get('/api/esg-score', async (req: express.Request, res: express.Response) => {
  try {
    const ticker = req.query.ticker as string;
    const data = await fetchESGData(ticker);
    return res.json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Diversification API
app.get('/api/diversification', async (req: express.Request, res: express.Response) => {
  try {
    const userId = req.query.userId as string;
    const data = await getDiversificationTools(userId);
    return res.json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Social Share API
app.post('/api/social-share', async (req: express.Request, res: express.Response) => {
  try {
    const { platform, message, url } = req.body as { platform: 'twitter' | 'facebook' | 'linkedin'; message: string; url: string };
    const result = await shareToSocial(platform, message, url);
    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// 404 handler
app.use('*', (req: express.Request, res: express.Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling
app.use(errorHandler);
// Start server function
async function startServer() {
  try {
    await connectDatabase();
  } catch (dbError) {
    logger.warn('⚠️  Database connection failed, running in offline mode:', dbError);
    // Continue without database - API will work with in-memory storage
  }
  const { port, host } = productionConfig;
  httpServer = http.createServer(app);
  createWebSocketServer(httpServer);
  httpServer.listen(port, host, () => {
    logger.info(`🚀 Server running on ${host}:${port}`);
    logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    // Initialize AI systems
    logger.info('🤖 AI Agent Status: Active');
    logger.info('📊 Analytics: Enabled');
    logger.info('🧠 Training System: Ready');
    logger.info('🔧 Advanced AI Processor: Loaded');
    // Initialize advanced AI features
    trainingManager.initializeTraining().then(() => {
      logger.info('🎯 Advanced AI Training: Initialized');
      logger.info('🔍 Lead Research Engine: Active');
      logger.info('📧 Cold Email Automation: Ready');
      logger.info('📞 Cold Call System: Configured');
      logger.info('🎨 Multi-Modal Processing: Enabled');
    }).catch((error: any) => {
      logger.warn('⚠️ Advanced AI initialization failed, running in basic mode:', error.message);
    });
  });
}
startServer();