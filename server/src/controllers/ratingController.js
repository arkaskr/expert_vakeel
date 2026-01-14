// controllers/ratingController.js
import { db, admin } from '../config/firebase.js';
import { RatingModel, getRatingById, getRatingsByUserId, getAverageRatingForUser, getRatingCountForUser, createRating } from '../models/ratingModel.js';

const COLLECTION = 'ratings';

// POST /ratings (create rating)
export async function createRatingController(req, res) {
  try {
    const { rating, userId, clientId } = req.body || {};

    // Validation
    if (!rating || !userId || !clientId) {
      return res.status(400).json({
        success: false,
        error: 'rating, userId, and clientId are required'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: 'rating must be between 1 and 5'
      });
    }

    // Check if client already rated this user
    const existingRatings = await getRatingsByUserId(userId);
    const existingRating = existingRatings.find(r => r.clientId === clientId);

    if (existingRating) {
      return res.status(409).json({
        success: false,
        error: 'You have already rated this user'
      });
    }

    const now = admin.firestore.FieldValue.serverTimestamp();
    const ratingData = {
      rating: Number(rating),
      userId,
      clientId,
      createdAt: now,
      updatedAt: now,
    };

    const ratingId = await createRating(ratingData);
    const createdRating = await getRatingById(ratingId);

    return res.status(201).json({
      success: true,
      data: createdRating.toPublicJSON()
    });
  } catch (err) {
    console.error('createRatingController error:', err);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}

// GET /ratings/user/:userId (get ratings for a user)
export async function getRatingsByUserController(req, res) {
  try {
    const { userId } = req.params;
    const ratings = await getRatingsByUserId(userId);

    return res.json({
      success: true,
      data: ratings.map(r => r.toPublicJSON())
    });
  } catch (err) {
    console.error('getRatingsByUserController error:', err);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}

// GET /ratings/user/:userId/stats (get rating stats for a user)
export async function getRatingStatsController(req, res) {
  try {
    const { userId } = req.params;

    const [averageRating, ratingCount] = await Promise.all([
      getAverageRatingForUser(userId),
      getRatingCountForUser(userId)
    ]);

    return res.json({
      success: true,
      data: {
        averageRating,
        ratingCount,
        userId
      }
    });
  } catch (err) {
    console.error('getRatingStatsController error:', err);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}

// GET /ratings/:id (get rating by ID)
export async function getRatingByIdController(req, res) {
  try {
    const { id } = req.params;
    const rating = await getRatingById(id);

    if (!rating) {
      return res.status(404).json({
        success: false,
        error: 'Rating not found'
      });
    }

    return res.json({
      success: true,
      data: rating.toPublicJSON()
    });
  } catch (err) {
    console.error('getRatingByIdController error:', err);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}

// PUT /ratings/:id (update rating)
export async function updateRatingController(req, res) {
  try {
    const { id } = req.params;
    const { rating } = req.body || {};

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: 'Valid rating (1-5) is required'
      });
    }

    const existingRating = await getRatingById(id);
    if (!existingRating) {
      return res.status(404).json({
        success: false,
        error: 'Rating not found'
      });
    }

    const updateData = {
      rating: Number(rating),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection(COLLECTION).doc(id).update(updateData);

    const updatedRating = await getRatingById(id);
    return res.json({
      success: true,
      data: updatedRating.toPublicJSON()
    });
  } catch (err) {
    console.error('updateRatingController error:', err);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}

// DELETE /ratings/:id (delete rating)
export async function deleteRatingController(req, res) {
  try {
    const { id } = req.params;

    const existingRating = await getRatingById(id);
    if (!existingRating) {
      return res.status(404).json({
        success: false,
        error: 'Rating not found'
      });
    }

    await db.collection(COLLECTION).doc(id).delete();

    return res.json({
      success: true,
      data: { id }
    });
  } catch (err) {
    console.error('deleteRatingController error:', err);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}

// GET /ratings (get all ratings - admin only, paginated)
export async function getAllRatingsController(req, res) {
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
    console.error('getAllRatingsController error:', err);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}

// DELETE /ratings (delete all ratings - admin only)
export async function deleteAllRatingsController(req, res) {
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
    console.error('deleteAllRatingsController error:', err);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}
