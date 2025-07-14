
import { Router } from 'express';
import { body, query, param } from 'express-validator';
import { Portfolio } from '../models/Portfolio.js';
import { validateRequest } from '../middleware/validation.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { logger } from '../utils/logger.js';

const router = Router();

// GET /api/portfolio - Get all portfolio items
router.get('/', [
  query('category').optional().isIn(['web', 'mobile', 'design', 'branding', 'photography']),
  query('featured').optional().isBoolean(),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('page').optional().isInt({ min: 1 }),
  validateRequest
], asyncHandler(async (req, res) => {
  const { category, featured, limit = 10, page = 1 } = req.query;
  
  const filter: any = { status: 'published' };
  if (category) filter.category = category;
  if (featured !== undefined) filter.featured = featured === 'true';

  const skip = (Number(page) - 1) * Number(limit);
  
  const [items, total] = await Promise.all([
    Portfolio.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Portfolio.countDocuments(filter)
  ]);

  res.json({
    success: true,
    data: items,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit))
    }
  });
}));

// GET /api/portfolio/:id - Get single portfolio item
router.get('/:id', [
  param('id').isMongoId(),
  validateRequest
], asyncHandler(async (req, res) => {
  const item = await Portfolio.findByIdAndUpdate(
    req.params.id,
    { $inc: { 'metadata.views': 1 } },
    { new: true }
  );

  if (!item || item.status !== 'published') {
    return res.status(404).json({
      success: false,
      message: 'Portfolio item not found'
    });
  }

  res.json({
    success: true,
    data: item
  });
}));

// POST /api/portfolio - Create new portfolio item
router.post('/', [
  body('title').trim().isLength({ min: 1, max: 200 }),
  body('description').trim().isLength({ min: 1, max: 2000 }),
  body('category').isIn(['web', 'mobile', 'design', 'branding', 'photography']),
  body('images').isArray({ min: 1 }),
  body('completedAt').isISO8601(),
  body('technologies').optional().isArray(),
  body('tags').optional().isArray(),
  validateRequest
], asyncHandler(async (req, res) => {
  const portfolio = new Portfolio(req.body);
  await portfolio.save();

  logger.info(`New portfolio item created: ${portfolio.title}`);

  res.status(201).json({
    success: true,
    data: portfolio
  });
}));

export default router;
