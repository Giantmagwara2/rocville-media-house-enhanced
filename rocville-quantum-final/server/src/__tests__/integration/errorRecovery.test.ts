
import request from 'supertest';
import express from 'express';
import { errorRecoveryMiddleware, errorRecovery } from '../../middleware/errorRecovery';

describe('Error Recovery Integration Tests', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use(errorRecoveryMiddleware);

    // Test routes
    app.get('/test/success', (req, res) => {
      res.json({ success: true, message: 'Success' });
    });

    app.get('/test/error', (req, res) => {
      throw new Error('Test error');
    });

    app.get('/test/retry', async (req, res) => {
      const result = await req.errorRecovery.retryOperation(
        async () => {
          if (Math.random() > 0.7) {
            return { success: true };
          }
          throw new Error('Random failure');
        },
        'random_operation'
      );
      res.json(result);
    });

    app.get('/test/fallback', async (req, res) => {
      const result = await req.errorRecovery.withFallback(
        async () => {
          throw new Error('Primary failed');
        },
        async () => {
          return { success: true, fallback: true };
        },
        'fallback_test'
      );
      res.json(result);
    });

    app.get('/test/status', (req, res) => {
      res.json(errorRecovery.getStatus());
    });

    // Error handler
    app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: 'Internal server error',
          error: error.message
        });
      }
    });
  });

  test('should handle successful requests', async () => {
    const response = await request(app)
      .get('/test/success')
      .expect(200);

    expect(response.body).toEqual({
      success: true,
      message: 'Success'
    });
  });

  test('should handle errors gracefully', async () => {
    const response = await request(app)
      .get('/test/error')
      .expect(500);

    expect(response.body).toEqual({
      success: false,
      message: 'Internal server error',
      error: 'Test error'
    });
  });

  test('should provide fallback functionality', async () => {
    const response = await request(app)
      .get('/test/fallback')
      .expect(200);

    expect(response.body).toEqual({
      success: true,
      fallback: true
    });
  });

  test('should provide system status', async () => {
    const response = await request(app)
      .get('/test/status')
      .expect(200);

    expect(response.body).toHaveProperty('activeRetries');
    expect(response.body).toHaveProperty('circuitBreakers');
    expect(response.body).toHaveProperty('errorCounts');
  });
});
