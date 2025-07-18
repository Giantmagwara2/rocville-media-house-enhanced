import request from 'supertest';
import app from '../index';

describe('API Endpoints', () => {
  it('GET /health returns healthy', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('healthy');
  });
});
