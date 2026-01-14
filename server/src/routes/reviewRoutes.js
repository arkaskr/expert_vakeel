// routes/reviewRoutes.js
import express from 'express';
import {
  createReviewController,
  getReviewsByUserController,
  getReviewStatsController,
  getReviewByIdController,
  updateReviewController,
  deleteReviewController,
  getAllReviewsController,
  deleteAllReviewsController,
} from '../controllers/reviewController.js';

const router = express.Router();

// POST /reviews (create review)
router.post('/', createReviewController);

// GET /reviews/user/:userId (get reviews for a user)
router.get('/user/:userId', getReviewsByUserController);

// GET /reviews/user/:userId/stats (get review stats for a user)
router.get('/user/:userId/stats', getReviewStatsController);

// GET /reviews/:id (get review by ID)
router.get('/:id', getReviewByIdController);

// PUT /reviews/:id (update review)
router.put('/:id', updateReviewController);

// DELETE /reviews/:id (delete review)
router.delete('/:id', deleteReviewController);

// GET /reviews (get all reviews - admin only)
router.get('/', getAllReviewsController);

// DELETE /reviews (delete all reviews - admin only)
router.delete('/', deleteAllReviewsController);

export default router;
