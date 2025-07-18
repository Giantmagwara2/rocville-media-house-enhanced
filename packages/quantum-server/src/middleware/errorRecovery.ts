
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export interface ErrorRecoveryOptions {
  maxRetries: number;
  retryDelay: number;
  circuitBreakerThreshold: number;
  healthCheckInterval: number;
}

class ErrorRecoveryManager {
  private retryAttempts = new Map<string, number>();
  private circuitBreakers = new Map<string, boolean>();
  private errorCounts = new Map<string, number>();
  private options: ErrorRecoveryOptions;

  constructor(options: Partial<ErrorRecoveryOptions> = {}) {
    this.options = {
      maxRetries: 3,
      retryDelay: 1000,
      circuitBreakerThreshold: 5,
      healthCheckInterval: 30000,
      ...options
    };

    // Start health check interval
    setInterval(() => this.healthCheck(), this.options.healthCheckInterval);
  }

  async retryOperation<T>(
    operation: () => Promise<T>,
    operationId: string,
    context?: any
  ): Promise<T> {
    const currentRetries = this.retryAttempts.get(operationId) || 0;
    
    // Check circuit breaker
    if (this.circuitBreakers.get(operationId)) {
      throw new Error(`Circuit breaker open for operation: ${operationId}`);
    }

    try {
      const result = await operation();
      // Reset retry count on success
      this.retryAttempts.delete(operationId);
      this.resetErrorCount(operationId);
      return result;
    } catch (error) {
      logger.error(`Operation failed: ${operationId}`, { error, context, attempt: currentRetries + 1 });
      
      this.incrementErrorCount(operationId);
      
      if (currentRetries < this.options.maxRetries) {
        this.retryAttempts.set(operationId, currentRetries + 1);
        
        // Exponential backoff
        const delay = this.options.retryDelay * Math.pow(2, currentRetries);
        await this.sleep(delay);
        
        return this.retryOperation(operation, operationId, context);
      } else {
        // Max retries reached, activate circuit breaker if threshold met
        if (this.getErrorCount(operationId) >= this.options.circuitBreakerThreshold) {
          this.activateCircuitBreaker(operationId);
        }
        
        this.retryAttempts.delete(operationId);
        throw error;
      }
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private incrementErrorCount(operationId: string): void {
    const current = this.errorCounts.get(operationId) || 0;
    this.errorCounts.set(operationId, current + 1);
  }

  private getErrorCount(operationId: string): number {
    return this.errorCounts.get(operationId) || 0;
  }

  private resetErrorCount(operationId: string): void {
    this.errorCounts.set(operationId, 0);
  }

  private activateCircuitBreaker(operationId: string): void {
    logger.warn(`Activating circuit breaker for operation: ${operationId}`);
    this.circuitBreakers.set(operationId, true);
    
    // Auto-reset circuit breaker after some time
    setTimeout(() => {
      this.circuitBreakers.set(operationId, false);
      this.resetErrorCount(operationId);
      logger.info(`Circuit breaker reset for operation: ${operationId}`);
    }, 60000); // Reset after 1 minute
  }

  private healthCheck(): void {
    // Reset error counts periodically
    for (const [operationId, count] of this.errorCounts.entries()) {
      if (count > 0) {
        this.errorCounts.set(operationId, Math.max(0, count - 1));
      }
    }
  }

  // Graceful degradation
  async withFallback<T>(
    primaryOperation: () => Promise<T>,
    fallbackOperation: () => Promise<T>,
    operationId: string
  ): Promise<T> {
    try {
      return await this.retryOperation(primaryOperation, `primary_${operationId}`);
    } catch (error) {
      logger.warn(`Primary operation failed, using fallback for: ${operationId}`, { error });
      return await fallbackOperation();
    }
  }

  // Get system status
  getStatus() {
    return {
      activeRetries: Object.fromEntries(this.retryAttempts),
      circuitBreakers: Object.fromEntries(this.circuitBreakers),
      errorCounts: Object.fromEntries(this.errorCounts)
    };
  }
}

// Global error recovery manager
export const errorRecovery = new ErrorRecoveryManager();

// Express middleware for automatic error recovery
export const errorRecoveryMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Add error recovery utilities to request
  req.errorRecovery = errorRecovery;
  
  // Wrap response methods for automatic retry
  const originalSend = res.send;
  const originalJson = res.json;
  
  res.send = function(body) {
    try {
      return originalSend.call(this, body);
    } catch (error) {
      logger.error('Response send error:', error);
      if (!res.headersSent) {
        return res.status(500).json({
          success: false,
          message: 'Internal server error',
          error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
      }
    }
  };
  
  res.json = function(obj) {
    try {
      return originalJson.call(this, obj);
    } catch (error) {
      logger.error('Response JSON error:', error);
      if (!res.headersSent) {
        return res.status(500).json({
          success: false,
          message: 'Internal server error',
          error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
      }
    }
  };
  
  next();
};

// Declare module augmentation for Request
declare global {
  namespace Express {
    interface Request {
      errorRecovery: ErrorRecoveryManager;
    }
  }
}
