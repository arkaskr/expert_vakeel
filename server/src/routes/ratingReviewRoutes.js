// routes/ratingReviewRoutes.js
import express from 'express';
import {
  createRatingReviewController,
  getRatingReviewsByUserController,
  getRatingReviewStatsController,
  getRatingReviewByIdController,
  updateRatingReviewController,
  deleteRatingReviewController,
  getAllRatingReviewsController,
  deleteAllRatingReviewsController,
} from '../controllers/ratingReviewController.js';

const router = express.Router();

// POST /api/ratings-reviews (create rating and/or review)
router.post('/', createRatingReviewController);

// GET /api/ratings-reviews/user/:userId (get ratings/reviews for a user)
router.get('/user/:userId', getRatingReviewsByUserController);

// GET /api/ratings-reviews/user/:userId/stats (get rating/review stats for a user)
router.get('/user/:userId/stats', getRatingReviewStatsController);

// GET /api/ratings-reviews/:id (get rating/review by ID)
router.get('/:id', getRatingReviewByIdController);

// PUT /api/ratings-reviews/:id (update rating/review)
router.put('/:id', updateRatingReviewController);

// DELETE /api/ratings-reviews/:id (delete rating/review)
router.delete('/:id', deleteRatingReviewController);

// GET /api/ratings-reviews (get all ratings/reviews - admin only)
router.get('/', getAllRatingReviewsController);

// DELETE /api/ratings-reviews (delete all ratings/reviews - admin only)
router.delete('/', deleteAllRatingReviewsController);

export default router;
