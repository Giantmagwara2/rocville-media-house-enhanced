
import express from 'express';
import { body } from 'express-validator';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validateRequest } from '../middleware/validation.js';

const router = express.Router();

const services = [
  {
    id: 'web-development',
    title: 'Web Development',
    description: 'Custom websites and web applications built with modern technologies.',
    features: ['Responsive Design', 'E-commerce Solutions', 'CMS', 'PWAs', 'API Development'],
    pricing: { starting: 2500, currency: 'USD' }
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing',
    description: 'Strategic marketing campaigns that drive traffic and conversions.',
    features: ['SEO', 'PPC Advertising', 'Social Media', 'Email Marketing', 'Analytics'],
    pricing: { starting: 1500, currency: 'USD' }
  },
  {
    id: 'branding',
    title: 'Branding & Identity',
    description: 'Distinctive brand identities that resonate with your audience.',
    features: ['Logo Design', 'Brand Strategy', 'Visual Identity', 'Guidelines', 'Rebranding'],
    pricing: { starting: 3000, currency: 'USD' }
  }
];

router.get('/', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: services
  });
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const service = services.find(s => s.id === req.params.id);
  
  if (!service) {
    return res.status(404).json({
      success: false,
      message: 'Service not found'
    });
  }
  
  res.json({
    success: true,
    data: service
  });
}));

router.post('/quote',
  [
    body('serviceId').notEmpty(),
    body('name').trim().isLength({ min: 2 }),
    body('email').isEmail().normalizeEmail(),
    body('message').trim().isLength({ min: 10 })
  ],
  validateRequest,
  asyncHandler(async (req, res) => {
    const { serviceId, name, email, message, budget } = req.body;
    
    const service = services.find(s => s.id === serviceId);
    if (!service) {
      return res.status(400).json({
        success: false,
        message: 'Invalid service ID'
      });
    }
    
    // In production, save to database and send email
    const quote = {
      id: Date.now().toString(),
      serviceId,
      serviceName: service.title,
      name,
      email,
      message,
      budget,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    res.status(201).json({
      success: true,
      message: 'Quote request submitted successfully',
      data: quote
    });
  })
);

export default router;
