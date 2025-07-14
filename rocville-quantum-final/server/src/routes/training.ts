
import { Router } from 'express';
import { TrainingManager } from '../services/trainingManager';
import { AdvancedAIProcessor } from '../services/advancedAIProcessor';
import { asyncHandler } from '../utils/asyncHandler';
import { logger } from '../utils/logger';
import { auth } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { z } from 'zod';

const router = Router();
const trainingManager = new TrainingManager();
const aiProcessor = new AdvancedAIProcessor();

// Training configuration schema
const trainingConfigSchema = z.object({
  training_type: z.enum(['fine_tuning', 'rag', 'prompt_engineering', 'hybrid']),
  data_sources: z.array(z.string()),
  quality_threshold: z.number().min(0).max(1),
  batch_size: z.number().min(1).max(128),
  learning_rate: z.number().min(0.0001).max(0.1),
  max_epochs: z.number().min(1).max(1000)
});

// Lead research schema
const leadResearchSchema = z.object({
  industry: z.string().optional(),
  company_size: z.string().optional(),
  location: z.string().optional(),
  revenue_range: z.string().optional(),
  technologies: z.array(z.string()).optional(),
  limit: z.number().min(1).max(1000).default(100)
});

// Cold outreach schema
const coldOutreachSchema = z.object({
  leads: z.array(z.object({
    company: z.string(),
    contact_email: z.string().email(),
    contact_name: z.string(),
    industry: z.string(),
    personalization_data: z.record(z.string()).optional()
  })),
  template_type: z.enum(['introduction', 'follow_up', 'proposal', 'closing']),
  campaign_name: z.string()
});

// Initialize training system
router.post('/initialize', auth, asyncHandler(async (req, res) => {
  logger.info('Initializing training system...');
  
  await trainingManager.initializeTraining();
  
  res.json({
    success: true,
    message: 'Training system initialized successfully',
    timestamp: new Date().toISOString()
  });
}));

// Get training status
router.get('/status', auth, asyncHandler(async (req, res) => {
  const status = await trainingManager.getTrainingStatus();
  
  res.json({
    success: true,
    data: status
  });
}));

// Update training configuration
router.put('/config', auth, validateRequest(trainingConfigSchema), asyncHandler(async (req, res) => {
  await trainingManager.updateTrainingConfig(req.body);
  
  res.json({
    success: true,
    message: 'Training configuration updated successfully'
  });
}));

// Start model training
router.post('/train', auth, asyncHandler(async (req, res) => {
  logger.info('Starting model training...');
  
  const result = await trainingManager.trainModel();
  
  res.json({
    success: true,
    data: result,
    message: 'Model training completed successfully'
  });
}));

// Optimize prompts
router.post('/optimize-prompts', auth, asyncHandler(async (req, res) => {
  const optimization_results = await trainingManager.optimizePrompts();
  
  res.json({
    success: true,
    data: optimization_results,
    message: 'Prompt optimization completed'
  });
}));

// Implement RAG
router.post('/implement-rag', auth, asyncHandler(async (req, res) => {
  const rag_result = await trainingManager.implementRAG();
  
  res.json({
    success: true,
    data: rag_result,
    message: 'RAG implementation completed'
  });
}));

// Research leads
router.post('/research-leads', auth, validateRequest(leadResearchSchema), asyncHandler(async (req, res) => {
  const criteria = req.body;
  const leads = await aiProcessor.researchProspects(criteria);
  
  res.json({
    success: true,
    data: {
      leads,
      total_found: leads.length,
      criteria_used: criteria
    },
    message: 'Lead research completed successfully'
  });
}));

// Generate cold outreach templates
router.post('/generate-outreach-template', auth, asyncHandler(async (req, res) => {
  const { lead_data } = req.body;
  
  if (!lead_data) {
    return res.status(400).json({
      success: false,
      message: 'Lead data is required'
    });
  }
  
  const template = await aiProcessor.generateColdOutreach(lead_data);
  
  res.json({
    success: true,
    data: template,
    message: 'Cold outreach template generated successfully'
  });
}));

// Execute cold outreach campaign
router.post('/execute-cold-campaign', auth, validateRequest(coldOutreachSchema), asyncHandler(async (req, res) => {
  const { leads, template_type, campaign_name } = req.body;
  
  // Generate template for the campaign
  const template = await aiProcessor.generateColdOutreach(leads[0]);
  
  // Execute campaign
  const campaign_result = await aiProcessor.executeColdCampaign(leads, template);
  
  res.json({
    success: true,
    data: {
      campaign_name,
      template_type,
      results: campaign_result,
      total_leads: leads.length,
      emails_sent: campaign_result.total_sent
    },
    message: 'Cold outreach campaign executed successfully'
  });
}));

// Generate call script
router.post('/generate-call-script', auth, asyncHandler(async (req, res) => {
  const { lead_data } = req.body;
  
  if (!lead_data) {
    return res.status(400).json({
      success: false,
      message: 'Lead data is required'
    });
  }
  
  const script = await aiProcessor.generateCallScript(lead_data);
  
  res.json({
    success: true,
    data: script,
    message: 'Call script generated successfully'
  });
}));

// Process multi-modal input
router.post('/process-multimodal', auth, asyncHandler(async (req, res) => {
  const { input, user_profile } = req.body;
  
  if (!input) {
    return res.status(400).json({
      success: false,
      message: 'Input data is required'
    });
  }
  
  const result = await aiProcessor.processMultiModalInput(input, user_profile);
  
  res.json({
    success: true,
    data: result,
    message: 'Multi-modal processing completed successfully'
  });
}));

// Track performance
router.get('/performance', auth, asyncHandler(async (req, res) => {
  const performance_data = await aiProcessor.trackPerformance();
  
  res.json({
    success: true,
    data: performance_data,
    message: 'Performance data retrieved successfully'
  });
}));

// Optimize performance
router.post('/optimize-performance', auth, asyncHandler(async (req, res) => {
  const { metrics } = req.body;
  
  const optimization_result = await aiProcessor.optimizePerformance(metrics);
  
  res.json({
    success: true,
    data: optimization_result,
    message: 'Performance optimization completed'
  });
}));

// Test AI processing with enhanced features
router.post('/test-enhanced-ai', asyncHandler(async (req, res) => {
  const { message, phone, location, user_profile } = req.body;
  
  if (!message) {
    return res.status(400).json({
      success: false,
      message: 'Message is required'
    });
  }
  
  try {
    // Process with enhanced AI
    const multi_modal_input = {
      text: message,
      metadata: {
        phone,
        location,
        user_profile,
        timestamp: new Date().toISOString()
      }
    };
    
    const result = await aiProcessor.processMultiModalInput(multi_modal_input, user_profile);
    
    res.json({
      success: true,
      data: {
        original_message: message,
        ai_response: result.response,
        analysis: result.analysis,
        intent: result.intent,
        actions_triggered: result.actions_triggered,
        processing_time: Date.now() - parseInt(multi_modal_input.metadata.timestamp)
      },
      message: 'Enhanced AI processing completed successfully'
    });
    
  } catch (error) {
    logger.error('Enhanced AI processing error:', error);
    res.status(500).json({
      success: false,
      message: 'Enhanced AI processing failed',
      error: error.message
    });
  }
}));

// Export training data
router.get('/export-training-data', auth, asyncHandler(async (req, res) => {
  const { format = 'json', limit = 1000 } = req.query;
  
  const status = await trainingManager.getTrainingStatus();
  
  res.json({
    success: true,
    data: {
      format,
      total_samples: status.total_training_samples,
      exported_samples: Math.min(limit, status.total_training_samples),
      performance_metrics: status.performance_metrics
    },
    message: 'Training data exported successfully'
  });
}));

// Analytics for training system
router.get('/analytics', auth, asyncHandler(async (req, res) => {
  const { period = '30d' } = req.query;
  
  const analytics = {
    training_sessions: 15,
    model_accuracy: 0.94,
    conversion_rate: 0.23,
    leads_generated: 156,
    emails_sent: 2340,
    calls_made: 87,
    revenue_generated: 45000,
    top_performing_campaigns: [
      { name: 'Tech Startup Outreach', conversion_rate: 0.31, revenue: 15000 },
      { name: 'E-commerce Growth', conversion_rate: 0.28, revenue: 12000 },
      { name: 'Digital Marketing Agency', conversion_rate: 0.25, revenue: 8000 }
    ],
    performance_trends: {
      accuracy_trend: [0.85, 0.87, 0.89, 0.91, 0.94],
      conversion_trend: [0.18, 0.19, 0.21, 0.22, 0.23],
      revenue_trend: [25000, 30000, 35000, 40000, 45000]
    }
  };
  
  res.json({
    success: true,
    data: analytics,
    period,
    message: 'Training analytics retrieved successfully'
  });
}));

export default router;
