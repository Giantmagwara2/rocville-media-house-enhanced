
export const productionConfig = {
  port: parseInt(process.env.PORT || '5000'),
  host: '0.0.0.0',
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  },
  security: {
    helmet: true,
    compression: true,
    trustProxy: true
  },
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/rocville-prod',
    options: {
      retryWrites: true,
      w: 'majority'
    }
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: 'combined'
  }
};
