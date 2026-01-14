// controllers/reviewController.js
import { db, admin } from '../config/firebase.js';
import { ReviewModel, getReviewById, getReviewsByUserId, getReviewCountForUser, createReview } from '../models/reviewModel.js';

const COLLECTION = 'reviews';

// POST /reviews (create review)
export async function createReviewController(req, res) {
  try {
    const { review, userId, clientId, ratingId } = req.body || {};

    // Validation
    if (!review || !userId || !clientId) {
      return res.status(400).json({
        success: false,
        error: 'review, userId, and clientId are required'
      });
    }

    if (review.trim().length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Review must be at least 10 characters long'
      });
    }

    // Check if client already reviewed this user
    const existingReviews = await getReviewsByUserId(userId);
    const existingReview = existingReviews.find(r => r.clientId === clientId);

    if (existingReview) {
      return res.status(409).json({
        success: false,
        error: 'You have already reviewed this user'
      });
    }

    const now = admin.firestore.FieldValue.serverTimestamp();
    const reviewData = {
      review: review.trim(),
      userId,
      clientId,
      ratingId: ratingId || null,
      createdAt: now,
      updatedAt: now,
    };

    const reviewId = await createReview(reviewData);
    const createdReview = await getReviewById(reviewId);

    return res.status(201).json({
      success: true,
      data: createdReview.toPublicJSON()
    });
  } catch (err) {
    console.error('createReviewController error:', err);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}

// GET /reviews/user/:userId (get reviews for a user)
export async function getReviewsByUserController(req, res) {
  try {
    const { userId } = req.params;
    const reviews = await getReviewsByUserId(userId);

    return res.json({
      success: true,
      data: reviews.map(r => r.toPublicJSON())
    });
  } catch (err) {
    console.error('getReviewsByUserController error:', err);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}

// GET /reviews/user/:userId/stats (get review stats for a user)
export async function getReviewStatsController(req, res) {
  try {
    const { userId } = req.params;

    const reviewCount = await getReviewCountForUser(userId);

    return res.json({
      success: true,
      data: {
        reviewCount,
        userId
      }
    });
  } catch (err) {
    console.error('getReviewStatsController error:', err);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}

// GET /reviews/:id (get review by ID)
export async function getReviewByIdController(req, res) {
  try {
    const { id } = req.params;
    const review = await getReviewById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }

    return res.json({
      success: true,
      data: review.toPublicJSON()
    });
  } catch (err) {
    console.error('getReviewByIdController error:', err);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}

// PUT /reviews/:id (update review)
export async function updateReviewController(req, res) {
  try {
    const { id } = req.params;
    const { review } = req.body || {};

    if (!review || review.trim().length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Valid review (at least 10 characters) is required'
      });
    }

    const existingReview = await getReviewById(id);
    if (!existingReview) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }

    const updateData = {
      review: review.trim(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection(COLLECTION).doc(id).update(updateData);

    const updatedReview = await getReviewById(id);
    return res.json({
      success: true,
      data: updatedReview.toPublicJSON()
    });
  } catch (err) {
    console.error('updateReviewController error:', err);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}

// DELETE /reviews/:id (delete review)
export async function deleteReviewController(req, res) {
  try {
    const { id } = req.params;

    const existingReview = await getReviewById(id);
    if (!existingReview) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }

    await db.collection(COLLECTION).doc(id).delete();

    return res.json({
      success: true,
      data: { id }
    });
  } catch (err) {
    console.error('deleteReviewController error:', err);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}

// GET /reviews (get all reviews - admin only, paginated)
export async function getAllReviewsController(req, res) {
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
    console.error('getAllReviewsController error:', err);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}

// DELETE /reviews (delete all reviews - admin only)
export async function deleteAllReviewsController(req, res) {
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
    console.error('deleteAllReviewsController error:', err);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}
