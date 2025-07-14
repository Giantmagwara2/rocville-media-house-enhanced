
import express from 'express';
import { errorRecovery } from '../middleware/errorRecovery';
import { logger } from '../utils/logger';

const router = express.Router();

interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  services: {
    database: 'healthy' | 'unhealthy';
    ai_processor: 'healthy' | 'degraded' | 'unhealthy';
    error_recovery: 'healthy' | 'degraded';
    memory: {
      used: number;
      total: number;
      percentage: number;
    };
    cpu: {
      load: number[];
    };
  };
  error_recovery_status: any;
}

// Comprehensive health check
router.get('/', async (req, res) => {
  try {
    const healthCheck: HealthCheckResult = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      services: {
        database: await checkDatabase(),
        ai_processor: await checkAIProcessor(),
        error_recovery: checkErrorRecovery(),
        memory: getMemoryStats(),
        cpu: getCPUStats()
      },
      error_recovery_status: errorRecovery.getStatus()
    };

    // Determine overall status
    const serviceStatuses = Object.values(healthCheck.services);
    if (serviceStatuses.some(status => status === 'unhealthy')) {
      healthCheck.status = 'unhealthy';
    } else if (serviceStatuses.some(status => status === 'degraded')) {
      healthCheck.status = 'degraded';
    }

    const statusCode = healthCheck.status === 'healthy' ? 200 : 
                     healthCheck.status === 'degraded' ? 200 : 503;

    res.status(statusCode).json(healthCheck);
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed'
    });
  }
});

// Liveness probe
router.get('/live', (req, res) => {
  res.status(200).json({
    status: 'alive',
    timestamp: new Date().toISOString()
  });
});

// Readiness probe
router.get('/ready', async (req, res) => {
  try {
    const databaseStatus = await checkDatabase();
    const aiProcessorStatus = await checkAIProcessor();

    if (databaseStatus === 'healthy' && aiProcessorStatus !== 'unhealthy') {
      res.status(200).json({
        status: 'ready',
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(503).json({
        status: 'not_ready',
        timestamp: new Date().toISOString(),
        details: {
          database: databaseStatus,
          ai_processor: aiProcessorStatus
        }
      });
    }
  } catch (error) {
    res.status(503).json({
      status: 'not_ready',
      timestamp: new Date().toISOString(),
      error: 'Readiness check failed'
    });
  }
});

async function checkDatabase(): Promise<'healthy' | 'unhealthy'> {
  try {
    // Add actual database ping here
    // For now, assume healthy if no database errors
    return 'healthy';
  } catch (error) {
    logger.error('Database health check failed:', error);
    return 'unhealthy';
  }
}

async function checkAIProcessor(): Promise<'healthy' | 'degraded' | 'unhealthy'> {
  try {
    // Check if AI processor is responsive
    const testResponse = await Promise.race([
      // Add actual AI processor test here
      Promise.resolve('healthy'),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 5000)
      )
    ]);
    return testResponse as 'healthy';
  } catch (error) {
    logger.warn('AI processor health check failed:', error);
    return 'degraded';
  }
}

function checkErrorRecovery(): 'healthy' | 'degraded' {
  const status = errorRecovery.getStatus();
  const hasActiveRetries = Object.keys(status.activeRetries).length > 0;
  const hasCircuitBreakers = Object.values(status.circuitBreakers).some(open => open);
  
  if (hasCircuitBreakers) {
    return 'degraded';
  }
  
  return 'healthy';
}

function getMemoryStats() {
  const memUsage = process.memoryUsage();
  return {
    used: memUsage.heapUsed,
    total: memUsage.heapTotal,
    percentage: Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100)
  };
}

function getCPUStats() {
  return {
    load: process.cpuUsage()
  };
}

export default router;
