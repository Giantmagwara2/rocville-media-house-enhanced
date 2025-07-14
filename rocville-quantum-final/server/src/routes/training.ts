
import { Router, Request, Response } from 'express';
import { TrainingManager } from '../services/trainingManager';
import { AdvancedAIProcessor } from '../services/advancedAIProcessor';
import { asyncHandler } from '../utils/asyncHandler';
import { logger } from '../utils/logger';

const router = Router();
const trainingManager = new TrainingManager();
const aiProcessor = new AdvancedAIProcessor();

// Start training session
router.post('/start', asyncHandler(async (req: Request, res: Response) => {
  const { training_type, data_sources, quality_threshold, batch_size, learning_rate, max_epochs } = req.body;

  if (!training_type || !data_sources) {
    return res.status(400).json({
      status: 'error',
      message: 'training_type and data_sources are required'
    });
  }

  const config = {
    training_type,
    data_sources,
    quality_threshold: quality_threshold || 0.7,
    batch_size: batch_size || 32,
    learning_rate: learning_rate || 0.001,
    max_epochs: max_epochs || 10
  };

  const sessionId = await trainingManager.startTrainingSession(config);

  res.json({
    status: 'success',
    session_id: sessionId,
    message: 'Training session started'
  });
}));

// Get training session status
router.get('/status/:sessionId', asyncHandler(async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const session = trainingManager.getSessionStatus(sessionId);

  if (!session) {
    return res.status(404).json({
      status: 'error',
      message: 'Training session not found'
    });
  }

  res.json({
    status: 'success',
    session
  });
}));

// List all training sessions
router.get('/sessions', asyncHandler(async (req: Request, res: Response) => {
  const sessions = trainingManager.getAllSessions();

  res.json({
    status: 'success',
    sessions,
    total: sessions.length
  });
}));

// Perform model evaluation
router.post('/evaluate', asyncHandler(async (req: Request, res: Response) => {
  const metrics = await trainingManager.evaluateModel();

  res.json({
    status: 'success',
    evaluation: metrics,
    timestamp: new Date().toISOString()
  });
}));

// Trigger continuous learning
router.post('/continuous-learning', asyncHandler(async (req: Request, res: Response) => {
  await trainingManager.performContinuousLearning();

  res.json({
    status: 'success',
    message: 'Continuous learning cycle completed'
  });
}));

// Advanced intent analysis
router.post('/analyze-intent', asyncHandler(async (req: Request, res: Response) => {
  const { message, conversation_history } = req.body;

  if (!message) {
    return res.status(400).json({
      status: 'error',
      message: 'message is required'
    });
  }

  const analysis = await aiProcessor.analyzeAdvancedIntent(message, conversation_history || []);

  res.json({
    status: 'success',
    analysis
  });
}));

// RAG query processing
router.post('/rag-query', asyncHandler(async (req: Request, res: Response) => {
  const { query, user_context } = req.body;

  if (!query) {
    return res.status(400).json({
      status: 'error',
      message: 'query is required'
    });
  }

  const result = await aiProcessor.performRAGRetrieval(query, user_context || {});

  res.json({
    status: 'success',
    result
  });
}));

// Connect to external MCP sources
router.post('/connect-mcp', asyncHandler(async (req: Request, res: Response) => {
  const { sources } = req.body;

  if (!sources || !Array.isArray(sources)) {
    return res.status(400).json({
      status: 'error',
      message: 'sources array is required'
    });
  }

  const connections = await aiProcessor.connectToExternalSources(sources);

  res.json({
    status: 'success',
    connections
  });
}));

// Generate synthetic training data
router.post('/generate-synthetic', asyncHandler(async (req: Request, res: Response) => {
  const { seed_examples, count } = req.body;

  if (!seed_examples || !Array.isArray(seed_examples)) {
    return res.status(400).json({
      status: 'error',
      message: 'seed_examples array is required'
    });
  }

  const syntheticData = await aiProcessor.generateSyntheticTrainingData(
    seed_examples,
    count || 100
  );

  res.json({
    status: 'success',
    synthetic_data: syntheticData,
    count: syntheticData.length
  });
}));

// Manage conversation context
router.post('/context-management', asyncHandler(async (req: Request, res: Response) => {
  const { user_id, message } = req.body;

  if (!user_id || !message) {
    return res.status(400).json({
      status: 'error',
      message: 'user_id and message are required'
    });
  }

  const context = await aiProcessor.manageConversationContext(user_id, message);

  res.json({
    status: 'success',
    context
  });
}));

// Training configuration recommendations
router.get('/recommendations', asyncHandler(async (req: Request, res: Response) => {
  const { use_case, data_size, complexity } = req.query;

  const recommendations = {
    fine_tuning: {
      suitable_for: ['specialized_domain', 'behavior_mimicry', 'deep_expertise'],
      recommended_when: data_size && parseInt(data_size as string) > 1000,
      advantages: ['Deep specialization', 'Fast inference', 'No external dependencies'],
      disadvantages: ['High computational cost', 'Difficult to update', 'Risk of catastrophic forgetting']
    },
    rag: {
      suitable_for: ['up_to_date_info', 'external_knowledge', 'private_documents'],
      recommended_when: use_case === 'dynamic_knowledge',
      advantages: ['Easy to update', 'Real-time information', 'Lower training costs'],
      disadvantages: ['Higher latency', 'Infrastructure complexity', 'Retrieval accuracy dependency']
    },
    prompt_engineering: {
      suitable_for: ['quick_deployment', 'existing_capabilities', 'format_control'],
      recommended_when: complexity === 'low',
      advantages: ['No training required', 'Immediate results', 'Cost effective'],
      disadvantages: ['Limited to existing knowledge', 'Prompt sensitivity', 'Context length limits']
    },
    hybrid: {
      suitable_for: ['complex_requirements', 'enterprise_solutions', 'comprehensive_coverage'],
      recommended_when: use_case === 'enterprise',
      advantages: ['Best of all approaches', 'Comprehensive coverage', 'Maximum flexibility'],
      disadvantages: ['Higher complexity', 'More resources required', 'Longer development time']
    }
  };

  res.json({
    status: 'success',
    recommendations,
    suggested_approach: use_case === 'enterprise' ? 'hybrid' : 
                       data_size && parseInt(data_size as string) > 1000 ? 'fine_tuning' : 'rag'
  });
}));

export default router;
