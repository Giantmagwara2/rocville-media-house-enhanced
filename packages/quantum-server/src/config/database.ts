
import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/rocville';
    
    await mongoose.connect(mongoUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      retryReads: true,
      connectTimeoutMS: 10000,
    });

    logger.info('Database connected successfully');

    mongoose.connection.on('error', (error) => {
      logger.error('Database connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('Database disconnected');
      // Auto-reconnect logic
      setTimeout(() => {
        logger.info('Attempting to reconnect to database...');
        connectDatabase().catch(err => {
          logger.error('Reconnection failed:', err);
        });
      }, 5000);
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('Database reconnected successfully');
    });

  } catch (error) {
    logger.error('Database connection failed:', error);
    
    // In development, continue without database
    if (process.env.NODE_ENV === 'development') {
      logger.warn('Continuing in offline mode for development');
      return;
    }
    
    throw error;
  }
};

export const closeDatabaseConnection = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    logger.info('Database connection closed');
  } catch (error) {
    logger.error('Error closing database connection:', error);
  }
};
