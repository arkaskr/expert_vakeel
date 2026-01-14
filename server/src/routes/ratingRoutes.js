// routes/ratingRoutes.js
import express from 'express';
import {
  createRatingController,
  getRatingsByUserController,
  getRatingStatsController,
  getRatingByIdController,
  updateRatingController,
  deleteRatingController,
  getAllRatingsController,
  deleteAllRatingsController,
} from '../controllers/ratingController.js';

const router = express.Router();

// POST /ratings (create rating)
router.post('/', createRatingController);

// GET /ratings/user/:userId (get ratings for a user)
router.get('/user/:userId', getRatingsByUserController);

// GET /ratings/user/:userId/stats (get rating stats for a user)
router.get('/user/:userId/stats', getRatingStatsController);

// GET /ratings/:id (get rating by ID)
router.get('/:id', getRatingByIdController);

// PUT /ratings/:id (update rating)
router.put('/:id', updateRatingController);

// DELETE /ratings/:id (delete rating)
router.delete('/:id', deleteRatingController);

// GET /ratings (get all ratings - admin only)
router.get('/', getAllRatingsController);

// DELETE /ratings (delete all ratings - admin only)
router.delete('/', deleteAllRatingsController);

export default router;
