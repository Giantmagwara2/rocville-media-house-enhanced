
import { jest } from '@jest/globals';

// Mock environment variables for testing
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.DATABASE_URL = 'mongodb://localhost:27017/test';
process.env.OPENAI_API_KEY = 'test-openai-key';

// Mock external services
jest.mock('../services/whatsappService', () => ({
  sendMessage: jest.fn(),
  processWebhook: jest.fn()
}));

jest.mock('../services/emailService', () => ({
  sendEmail: jest.fn(),
  validateEmail: jest.fn()
}));
