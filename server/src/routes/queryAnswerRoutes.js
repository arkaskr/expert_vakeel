// routes/queryAnswerRoutes.js
import express from 'express';
import {
  getAllQueryAnswers,
  getQueryAnswerById,
  createQueryAnswer,
  updateQueryAnswerById,
  deleteQueryAnswerById,
  deleteAllQueryAnswers,
  getAnswersByQueryId,
  getAnswersByUserId
} from '../controllers/queryAnswerController.js';

const router = express.Router();

// GET /query-answers/query/:queryId - Get all answers for a specific query
router.get('/query/:queryId', getAnswersByQueryId);

// GET /query-answers/user/:userId - Get all answers by a specific user
router.get('/user/:userId', getAnswersByUserId);

// GET /query-answers/:id - Get specific query answer by ID
router.get('/:id', getQueryAnswerById);

// GET /query-answers - Get all query answers (paginated with filters)
router.get('/', getAllQueryAnswers);

// POST /query-answers - Create new query answer
router.post('/', createQueryAnswer);

// PUT /query-answers/:id - Update existing query answer (replace all fields)
router.put('/:id', updateQueryAnswerById);

// DELETE /query-answers/:id - Delete specific query answer
router.delete('/:id', deleteQueryAnswerById);

// DELETE /query-answers - Delete all query answers (DANGER - admin only)
router.delete('/', deleteAllQueryAnswers);

export default router;
