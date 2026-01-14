// controllers/ratingReviewController.js
import { db, admin } from '../config/firebase.js';
import { RatingReviewModel, getRatingReviewById, getRatingReviewsByUserId, getAverageRatingForUser, getRatingCountForUser, getReviewCountForUser, createRatingReview } from '../models/ratingReviewModel.js';

const COLLECTION = 'ratings_reviews';

// POST /api/ratings-reviews (create rating and/or review)
export async function createRatingReviewController(req, res) {
  try {
    const { rating, review, userId, clientId, clientName } = req.body || {};

    // Validation - at least one of rating or review must be provided
    if ((!rating || rating < 1 || rating > 5) && (!review || review.trim().length < 10)) {
      return res.status(400).json({
        success: false,
        error: 'Either a valid rating (1-5) or a review (at least 10 characters) must be provided'
      });
    }

    if (!userId || !clientId) {
      return res.status(400).json({
        success: false,
        error: 'userId and clientId are required'
      });
    }

    // Check if client already rated/reviewed this user
    const existingRatingReviews = await getRatingReviewsByUserId(userId);
    const existingRatingReview = existingRatingReviews.find(rr => rr.clientId === clientId);

    if (existingRatingReview) {
      return res.status(409).json({
        success: false,
        error: 'You have already rated/reviewed this user'
      });
    }

    const now = admin.firestore.FieldValue.serverTimestamp();
    const ratingReviewData = {
      rating: rating ? Number(rating) : null,
      review: review ? review.trim() : "",
      userId,
      clientId,
      clientName: clientName || "", // Include client name
      createdAt: now,
      updatedAt: now,
    };

    const ratingReviewId = await createRatingReview(ratingReviewData);
    const createdRatingReview = await getRatingReviewById(ratingReviewId);

    return res.status(201).json({
      success: true,
      data: createdRatingReview.toPublicJSON()
    });
  } catch (err) {
    console.error('createRatingReviewController error:', err);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}

// GET /api/ratings-reviews/user/:userId (get ratings/reviews for a user)
export async function getRatingReviewsByUserController(req, res) {
  try {
    const { userId } = req.params;
    const ratingReviews = await getRatingReviewsByUserId(userId);

    return res.json({
      success: true,
      data: ratingReviews.map(rr => rr.toPublicJSON())
    });
  } catch (err) {
    console.error('getRatingReviewsByUserController error:', err);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}

// GET /api/ratings-reviews/user/:userId/stats (get rating/review stats for a user)
export async function getRatingReviewStatsController(req, res) {
  try {
    const { userId } = req.params;

    const [averageRating, ratingCount, reviewCount, reviews] = await Promise.all([
      getAverageRatingForUser(userId),
      getRatingCountForUser(userId),
      getReviewCountForUser(userId),
      getRatingReviewsByUserId(userId)
    ]);

    return res.json({
      success: true,
      data: {
        averageRating,
        ratingCount,
        reviewCount,
        userId,
        reviews: reviews.map(review => review.toPublicJSON())
      }
    });
  } catch (err) {
    console.error('getRatingReviewStatsController error:', err);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}

// GET /api/ratings-reviews/:id (get rating/review by ID)
export async function getRatingReviewByIdController(req, res) {
  try {
    const { id } = req.params;
    const ratingReview = await getRatingReviewById(id);

    if (!ratingReview) {
      return res.status(404).json({
        success: false,
        error: 'Rating/Review not found'
      });
    }

    return res.json({
      success: true,
      data: ratingReview.toPublicJSON()
    });
  } catch (err) {
    console.error('getRatingReviewByIdController error:', err);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}

// PUT /api/ratings-reviews/:id (update rating/review)
export async function updateRatingReviewController(req, res) {
  try {
    const { id } = req.params;
    const { rating, review } = req.body || {};

    if ((!rating || rating < 1 || rating > 5) && (!review || review.trim().length < 10)) {
      return res.status(400).json({
        success: false,
        error: 'Either a valid rating (1-5) or a review (at least 10 characters) must be provided'
      });
    }

    const existingRatingReview = await getRatingReviewById(id);
    if (!existingRatingReview) {
      return res.status(404).json({
        success: false,
        error: 'Rating/Review not found'
      });
    }

    const updateData = {
      ...(rating && { rating: Number(rating) }),
      ...(review && { review: review.trim() }),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection(COLLECTION).doc(id).update(updateData);

    const updatedRatingReview = await getRatingReviewById(id);
    return res.json({
      success: true,
      data: updatedRatingReview.toPublicJSON()
    });
  } catch (err) {
    console.error('updateRatingReviewController error:', err);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}

// DELETE /api/ratings-reviews/:id (delete rating/review)
export async function deleteRatingReviewController(req, res) {
  try {
    const { id } = req.params;

    const existingRatingReview = await getRatingReviewById(id);
    if (!existingRatingReview) {
      return res.status(404).json({
        success: false,
        error: 'Rating/Review not found'
      });
    }

    await db.collection(COLLECTION).doc(id).delete();

    return res.json({
      success: true,
      data: { id }
    });
  } catch (err) {
    console.error('deleteRatingReviewController error:', err);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}

// GET /api/ratings-reviews (get all ratings/reviews - admin only, paginated)
export async function getAllRatingReviewsController(req, res) {
  try {
    let q = db.collection(COLLECTION).orderBy('createdAt', 'desc');

    const { limit, startAfter } = req.query;
    const take = Math.min(Number(limit) || 50, 200);

    if (startAfter) {
      const cursorDoc = await db.collection(COLLECTION).doc(startAfter).get();
      if (cursorDoc.exists) q = q.startAfter(cursorDoc);
    }

    const snaps = await q.limit(take).get();
    const data = snaps.docs.map(d => ({ id: d.id, ...d.data() }));

    return res.json({
      success: true,
      data
    });
  } catch (err) {
    console.error('getAllRatingReviewsController error:', err);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}

// DELETE /api/ratings-reviews (delete all ratings/reviews - admin only)
export async function deleteAllRatingReviewsController(req, res) {
  try {
    const batchSize = 300;
    let deleted = 0;

    async function deleteBatch() {
      const snaps = await db.collection(COLLECTION).limit(batchSize).get();
      if (snaps.empty) return false;

      const batch = db.batch();
      snaps.docs.forEach(doc => batch.delete(doc.ref));
      await batch.commit();
      deleted += snaps.size;
      return snaps.size === batchSize;
    }

    // Keep deleting until empty
    while (await deleteBatch()) {}

    return res.json({
      success: true,
      deleted
    });
  } catch (err) {
    console.error('deleteAllRatingReviewsController error:', err);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}
