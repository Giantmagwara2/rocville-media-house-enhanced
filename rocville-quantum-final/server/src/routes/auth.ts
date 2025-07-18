
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body } from 'express-validator';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validateRequest } from '../middleware/validation.js';
import { generateOTP, verifyOTP, clearOTP } from '../utils/otpService.js';

const router = express.Router();

// Mock user for demo (replace with actual user model)
const mockUsers = [
  {
    id: 1,
    email: 'admin@rocville.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    role: 'admin'
  }
];

// MFA Step 1: Password check, send OTP
router.post('/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 })
  ],
  validateRequest,
  asyncHandler(async (req: express.Request, res: express.Response) => {
    const { email, password } = req.body;
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // Generate and send OTP (simulate sending via email/SMS)
    const otp = generateOTP(email);
    // In production, send OTP via email/SMS here
    res.json({ mfaRequired: true, message: 'OTP sent to your email', otp }); // For demo, return OTP
  })
);

// MFA Step 2: Verify OTP and issue JWT
router.post('/login/verify-otp',
  [
    body('email').isEmail().normalizeEmail(),
    body('otp').isLength({ min: 6, max: 6 })
  ],
  validateRequest,
  asyncHandler(async (req: express.Request, res: express.Response) => {
    const { email, otp } = req.body;
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    if (!verifyOTP(email, otp)) {
      return res.status(401).json({ message: 'Invalid or expired OTP' });
    }
    clearOTP(email);
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  })
);

router.post('/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('name').trim().isLength({ min: 2 })
  ],
  validateRequest,
  asyncHandler(async (req: express.Request, res: express.Response) => {
    const { email, password, name } = req.body;
    
    // Check if user exists
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = {
      id: mockUsers.length + 1,
      email,
      name,
      password: hashedPassword,
      role: 'user'
    };
    
    mockUsers.push(newUser);
    
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      }
    });
  })
);

export default router;
