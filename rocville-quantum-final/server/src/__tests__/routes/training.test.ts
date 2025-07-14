
import request from 'supertest';
import express from 'express';
import trainingRoutes from '../../routes/training.js';

const app = express();
app.use(express.json());
app.use('/api/training', trainingRoutes);

describe('Training Routes', () => {
  describe('POST /api/training/start', () => {
    it('should start training with valid data', async () => {
      const trainingData = {
        dataset: 'customer_support',
        epochs: 10,
        learningRate: 0.001
      };

      const response = await request(app)
        .post('/api/training/start')
        .send(trainingData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.sessionId).toBeDefined();
    });

    it('should return 400 for invalid training data', async () => {
      const invalidData = {
        dataset: '',
        epochs: -1
      };

      const response = await request(app)
        .post('/api/training/start')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('GET /api/training/status/:sessionId', () => {
    it('should return training status', async () => {
      const sessionId = 'test-session-123';

      const response = await request(app)
        .get(`/api/training/status/${sessionId}`)
        .expect(200);

      expect(response.body.sessionId).toBe(sessionId);
      expect(response.body.status).toBeDefined();
    });
  });
});
