
import { Router, Request, Response } from 'express';
import { Conversation, UserProfile, Lead, Analytics } from '../models/AIAgent';
import { WhatsAppService } from '../services/whatsappService';
import { AIProcessor } from '../services/aiProcessor';
import { asyncHandler } from '../utils/asyncHandler';
import { logger } from '../utils/logger';

const router = Router();

// Initialize services
const whatsappService = new WhatsAppService();
const aiProcessor = new AIProcessor();

// WhatsApp webhook endpoint
router.get('/webhook', (req: Request, res: Response) => {
  const mode = req.query['hub.mode'] as string;
  const token = req.query['hub.verify_token'] as string;
  const challenge = req.query['hub.challenge'] as string;

  const result = whatsappService.verifyWebhook(mode, token, challenge);
  
  if (result) {
    res.status(200).send(result);
  } else {
    res.status(403).send('Forbidden');
  }
});

router.post('/webhook', asyncHandler(async (req: Request, res: Response) => {
  try {
    const data = req.body;
    
    if (!data) {
      return res.status(400).json({ error: 'No data received' });
    }

    const result = await whatsappService.processWebhook(data);
    
    // Log analytics
    await logWebhookAnalytics(result);
    
    res.json(result);
  } catch (error) {
    logger.error('Webhook processing error:', error);
    res.status(500).json({
      status: 'error',
      message: (error as Error).message
    });
  }
}));

// Send message endpoint
router.post('/send-message', asyncHandler(async (req: Request, res: Response) => {
  const { to, message, type = 'text' } = req.body;
  
  if (!to || !message) {
    return res.status(400).json({
      status: 'error',
      message: 'Missing required fields: to, message'
    });
  }
  
  const result = await whatsappService.sendMessage(to, message, type);
  
  // Store outgoing message if successful
  if (result.success) {
    const conversation = new Conversation({
      phone_number: to,
      message_type: 'outgoing',
      message_content: message,
      message_id: result.message_id,
      timestamp: new Date(),
      processed: true
    });
    await conversation.save();
  }
  
  res.json(result);
}));

// Send interactive message endpoint
router.post('/send-interactive', asyncHandler(async (req: Request, res: Response) => {
  const { to, header, body, buttons } = req.body;
  
  if (!to || !header || !body || !buttons) {
    return res.status(400).json({
      status: 'error',
      message: 'Missing required fields: to, header, body, buttons'
    });
  }
  
  const result = await whatsappService.sendInteractiveMessage(to, header, body, buttons);
  res.json(result);
}));

// Get conversations
router.get('/conversations', asyncHandler(async (req: Request, res: Response) => {
  const { phone, limit = 50, offset = 0 } = req.query;
  
  const query: any = {};
  if (phone) {
    query.phone_number = phone;
  }
  
  const conversations = await Conversation.find(query)
    .sort({ timestamp: -1 })
    .skip(Number(offset))
    .limit(Number(limit));
  
  const total = await Conversation.countDocuments(query);
  
  res.json({
    status: 'success',
    conversations,
    total
  });
}));

// Get users
router.get('/users', asyncHandler(async (req: Request, res: Response) => {
  const { limit = 50, offset = 0 } = req.query;
  
  const users = await UserProfile.find()
    .sort({ last_interaction: -1 })
    .skip(Number(offset))
    .limit(Number(limit));
  
  const total = await UserProfile.countDocuments();
  
  res.json({
    status: 'success',
    users,
    total
  });
}));

// Get specific user profile
router.get('/users/:phone', asyncHandler(async (req: Request, res: Response) => {
  const { phone } = req.params;
  
  const user = await UserProfile.findOne({ phone_number: phone });
  
  if (!user) {
    return res.status(404).json({
      status: 'error',
      message: 'User not found'
    });
  }
  
  // Get recent conversations
  const conversations = await Conversation.find({ phone_number: phone })
    .sort({ timestamp: -1 })
    .limit(10);
  
  res.json({
    status: 'success',
    user,
    recent_conversations: conversations
  });
}));

// Get leads
router.get('/leads', asyncHandler(async (req: Request, res: Response) => {
  const { status, limit = 50, offset = 0 } = req.query;
  
  const query: any = {};
  if (status) {
    query.status = status;
  }
  
  const leads = await Lead.find(query)
    .sort({ created_at: -1 })
    .skip(Number(offset))
    .limit(Number(limit));
  
  const total = await Lead.countDocuments(query);
  
  res.json({
    status: 'success',
    leads,
    total
  });
}));

// Get pricing
router.post('/pricing', asyncHandler(async (req: Request, res: Response) => {
  const { service_type, country_code = 'US', custom_requirements = [] } = req.body;
  
  if (!service_type) {
    return res.status(400).json({
      status: 'error',
      message: 'service_type is required'
    });
  }
  
  const pricing = aiProcessor.getServicePricing(service_type, country_code, custom_requirements);
  
  res.json({
    status: 'success',
    pricing
  });
}));

// Get location
router.post('/location', asyncHandler(async (req: Request, res: Response) => {
  const { ip = 'auto' } = req.body;
  
  // Simple location data (in production, would use real geolocation service)
  const locationData = {
    country: 'US',
    country_name: 'United States',
    region: 'California',
    city: 'San Francisco',
    latitude: 37.7749,
    longitude: -122.4194,
    timezone: 'America/Los_Angeles',
    currency: 'USD',
    language: 'en'
  };
  
  res.json({
    status: 'success',
    location: locationData
  });
}));

// Test AI processing
router.post('/test-ai', asyncHandler(async (req: Request, res: Response) => {
  const { message = 'Hello', phone = 'test_user', location } = req.body;
  
  if (!message) {
    return res.status(400).json({
      status: 'error',
      message: 'No message provided'
    });
  }
  
  const startTime = Date.now();
  const result = await aiProcessor.processMessage(message, phone);
  const processingTime = Date.now() - startTime;
  
  logger.info(`AI processing for ${phone}: ${processingTime}ms`);
  
  res.json({
    status: 'success',
    result,
    processing_time_ms: processingTime
  });
}));

// Get analytics
router.get('/analytics', asyncHandler(async (req: Request, res: Response) => {
  const { type, days = 30 } = req.query;
  
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - Number(days));
  
  const query: any = { timestamp: { $gte: startDate } };
  if (type) {
    query.metric_type = type;
  }
  
  const analytics = await Analytics.find(query).sort({ timestamp: -1 });
  
  // Aggregate data
  const aggregatedData: any = {};
  for (const record of analytics) {
    const key = `${record.metric_type}_${record.metric_name}`;
    if (!aggregatedData[key]) {
      aggregatedData[key] = {
        metric_type: record.metric_type,
        metric_name: record.metric_name,
        values: [],
        total: 0,
        count: 0
      };
    }
    
    aggregatedData[key].values.push({
      value: record.metric_value,
      timestamp: record.timestamp,
      dimensions: record.dimensions ? JSON.parse(record.dimensions) : {}
    });
    aggregatedData[key].total += record.metric_value;
    aggregatedData[key].count += 1;
  }
  
  // Calculate averages
  Object.keys(aggregatedData).forEach(key => {
    if (aggregatedData[key].count > 0) {
      aggregatedData[key].average = aggregatedData[key].total / aggregatedData[key].count;
    }
  });
  
  res.json({
    status: 'success',
    analytics: Object.values(aggregatedData),
    period_days: Number(days)
  });
}));

// Health check
router.get('/health', asyncHandler(async (req: Request, res: Response) => {
  try {
    // Check database connection by counting documents
    const totalUsers = await UserProfile.countDocuments();
    const totalConversations = await Conversation.countDocuments();
    const totalLeads = await Lead.countDocuments();
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      stats: {
        total_users: totalUsers,
        total_conversations: totalConversations,
        total_leads: totalLeads
      },
      services: {
        database: 'connected',
        whatsapp: process.env.WHATSAPP_ACCESS_TOKEN ? 'configured' : 'not_configured',
        ai_processor: 'configured'
      }
    });
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(500).json({
      status: 'unhealthy',
      error: (error as Error).message,
      timestamp: new Date().toISOString()
    });
  }
}));

// Helper function to log webhook analytics
async function logWebhookAnalytics(result: any): Promise<void> {
  try {
    const analyticsRecord = new Analytics({
      metric_type: 'webhook',
      metric_name: 'messages_processed',
      metric_value: result.responses?.length || 0,
      dimensions: JSON.stringify({
        status: result.status,
        processed: result.processed
      })
    });
    await analyticsRecord.save();
    
    // Log individual response metrics
    for (const response of result.responses || []) {
      if (response.message_processed) {
        const responseAnalytics = new Analytics({
          metric_type: 'message',
          metric_name: 'processing_success',
          metric_value: 1,
          dimensions: JSON.stringify({
            from: response.from,
            response_sent: response.response_sent
          })
        });
        await responseAnalytics.save();
      }
    }
  } catch (error) {
    logger.error('Analytics logging error:', error);
  }
}

export default router;
