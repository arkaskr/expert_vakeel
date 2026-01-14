// routes/caseRoutes.js
import express from 'express';
import {
  getAllCases,
  getUserCases,
  getCaseById,
  createCase,
  updateCaseById,
  deleteCaseById,
  deleteAllCases,
  getUpcomingHearings,
  getOverdueReminders,
  getCasesByStatus
} from '../controllers/caseController.js';

const router = express.Router();

// GET /cases/user/:createdById - Get all cases for a specific user
router.get('/user/:createdById', getUserCases);

// GET /cases/status/:status - Get cases by status
router.get('/status/:status', getCasesByStatus);

// GET /cases/hearings/upcoming - Get upcoming hearings
router.get('/hearings/upcoming', getUpcomingHearings);

// GET /cases/reminders/overdue - Get overdue reminders
router.get('/reminders/overdue', getOverdueReminders);

// GET /cases/:id - Get specific case by ID
router.get('/:id', getCaseById);

// GET /cases - Get all cases (paginated)
router.get('/', getAllCases);

// POST /cases - Create new case
router.post('/', createCase);

// PUT /cases/:id - Update existing case
router.put('/:id', updateCaseById);

// DELETE /cases/:id - Delete specific case
router.delete('/:id', deleteCaseById);

// DELETE /cases - Delete all cases (DANGER - admin only)
router.delete('/', deleteAllCases);

export default router;
