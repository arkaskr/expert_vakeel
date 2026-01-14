// routes/authRoutes.js
import express from 'express';
import { authenticateAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/auth/me - Get current authenticated admin/sub-admin info
router.get('/me', authenticateAdmin, (req, res) => {
  return res.json({
    success: true,
    data: req.user
  });
});

// POST /api/auth/logout - Clear authentication cookie
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });

  return res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

export default router;
