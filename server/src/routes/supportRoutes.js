// routes/supportRoutes.js
import express from 'express';
import {
  getAllSupport,
  getSupportById,
  createSupport,
  updateSupportById,
  deleteSupportById,
  deleteAllSupport,
  getSupportByUserId,
  getSupportByStatus,
  updateSupportStatus,
  addSupportAnswer
} from '../controllers/supportController.js';

const router = express.Router();

// GET /support/user/:userId - Get all support tickets for a specific user
router.get('/user/:userId', getSupportByUserId);

// GET /support/status/:status - Get support tickets by status
router.get('/status/:status', getSupportByStatus);

// GET /support/:id - Get specific support ticket by ID
router.get('/:id', getSupportById);

// GET /support - Get all support tickets (paginated with filters)
router.get('/', getAllSupport);

// POST /support - Create new support ticket
router.post('/', createSupport);

// PUT /support/:id - Update existing support ticket (replace all fields)
router.put('/:id', updateSupportById);

// PATCH /support/:id/status - Update support ticket status
router.patch('/:id/status', updateSupportStatus);

// POST /support/:id/answer - Add answer to support ticket
router.post('/:id/answer', addSupportAnswer);

// DELETE /support/:id - Delete specific support ticket
router.delete('/:id', deleteSupportById);

// DELETE /support - Delete all support tickets (DANGER - admin only)
router.delete('/', deleteAllSupport);

export default router;
