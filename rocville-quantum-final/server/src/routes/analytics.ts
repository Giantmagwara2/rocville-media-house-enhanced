
import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

// Mock analytics data
const analyticsData = {
  pageViews: {
    total: 15420,
    thisMonth: 3240,
    growth: 12.5
  },
  users: {
    total: 8930,
    active: 1240,
    returning: 65.4
  },
  conversions: {
    leads: 156,
    clients: 23,
    rate: 14.7
  },
  topPages: [
    { page: '/', views: 5420, bounceRate: 23.1 },
    { page: '/services', views: 3240, bounceRate: 18.5 },
    { page: '/portfolio', views: 2890, bounceRate: 21.3 },
    { page: '/contact', views: 1870, bounceRate: 15.2 }
  ],
  traffic: {
    organic: 45.2,
    direct: 28.7,
    social: 16.3,
    referral: 9.8
  }
};

router.get('/dashboard', asyncHandler(async (req, res) => {
  // Simulate real-time data
  const now = new Date();
  const realTimeData = {
    ...analyticsData,
    timestamp: now.toISOString(),
    activeUsers: Math.floor(Math.random() * 50) + 10
  };
  
  res.json({
    success: true,
    data: realTimeData
  });
}));

router.get('/performance', asyncHandler(async (req, res) => {
  const performanceMetrics = {
    loadTime: {
      average: 1.2,
      p95: 2.1,
      improvement: 15.3
    },
    coreWebVitals: {
      lcp: 1.8,
      fid: 45,
      cls: 0.08
    },
    seo: {
      score: 94,
      issues: 2,
      improvements: 3
    }
  };
  
  res.json({
    success: true,
    data: performanceMetrics
  });
}));

export default router;
