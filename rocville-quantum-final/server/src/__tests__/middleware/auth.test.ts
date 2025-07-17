
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authenticateToken, requireRole } from '../../middleware/auth.js';

interface MockRequest extends Partial<Request> {
  headers?: { authorization?: string };
  user?: any;
}

interface MockResponse extends Partial<Response> {
  status: jest.Mock;
  json: jest.Mock;
}

describe('Authentication Middleware', () => {
  let mockReq: MockRequest;
  let mockRes: MockResponse;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    mockNext = jest.fn();
  });

  describe('authenticateToken', () => {
    it('should return 401 if no token provided', async () => {
      mockReq.headers = {};

      await authenticateToken(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Access token required' });
    });

    it('should return 403 if token is invalid', async () => {
      mockReq.headers = { authorization: 'Bearer invalid-token' };
      jest.spyOn(jwt, 'verify').mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await authenticateToken(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid or expired token' });
    });

    it('should call next if token is valid', async () => {
      const mockUser = { userId: 1, email: 'test@example.com', role: 'user' };
      mockReq.headers = { authorization: 'Bearer valid-token' };
      jest.spyOn(jwt, 'verify').mockReturnValue(mockUser);

      await authenticateToken(mockReq as Request, mockRes as Response, mockNext);

      expect(mockReq.user).toEqual(mockUser);
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('requireRole', () => {
    it('should return 403 if user does not have required role', () => {
      mockReq.user = { role: 'user' };
      const middleware = requireRole('admin');

      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Insufficient permissions' });
    });

    it('should call next if user has required role', () => {
      mockReq.user = { role: 'admin' };
      const middleware = requireRole('admin');

      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });
});
