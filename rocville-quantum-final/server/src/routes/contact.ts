
import { Router } from 'express';
import { body } from 'express-validator';
import { Contact } from '../models/Contact.js';
import { validateRequest } from '../middleware/validation.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendEmail } from '../services/emailService';
import { logger } from '../utils/logger.js';

const router = Router();

// POST /api/contact - Submit contact form
router.post('/', [
  body('name').trim().isLength({ min: 2, max: 100 }),
  body('email').isEmail().normalizeEmail(),
  body('phone').optional().trim().isMobilePhone('any'),
  body('company').optional().trim().isLength({ max: 100 }),
  body('subject').trim().isLength({ min: 5, max: 200 }),
  body('message').trim().isLength({ min: 10, max: 2000 }),
  validateRequest
], asyncHandler(async (req, res) => {
  const contactData = {
    ...req.body,
    source: 'website',
    status: 'new',
    priority: 'medium'
  };

  const contact = new Contact(contactData);
  await contact.save();

  // Send confirmation email to user
  try {
    await sendEmail({
      to: contact.email,
      subject: 'Thank you for contacting RocVille Media House',
      template: 'contact-confirmation',
      data: {
        name: contact.name,
        subject: contact.subject
      }
    });

    // Send notification to admin
    await sendEmail({
      to: process.env.ADMIN_EMAIL || 'admin@rocville.com',
      subject: `New Contact Form Submission: ${contact.subject}`,
      template: 'contact-notification',
      data: contact
    });
  } catch (emailError) {
    logger.error('Failed to send email:', emailError);
  }

  logger.info(`New contact submission from ${contact.email}`);

  res.status(201).json({
    success: true,
    message: 'Your message has been sent successfully. We will get back to you soon!',
    data: {
      id: contact._id,
      status: contact.status
    }
  });
}));

// GET /api/contact - Get all contacts (admin only)
router.get('/', asyncHandler(async (req, res) => {
  const { status, priority, limit = 20, page = 1 } = req.query;
  
  const filter: any = {};
  if (status) filter.status = status;
  if (priority) filter.priority = priority;

  const skip = (Number(page) - 1) * Number(limit);
  
  const [contacts, total] = await Promise.all([
    Contact.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Contact.countDocuments(filter)
  ]);

  res.json({
    success: true,
    data: contacts,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit))
    }
  });
}));

export default router;
