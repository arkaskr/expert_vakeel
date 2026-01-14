// controllers/queryAnswerController.js
import { db, admin } from '../config/firebase.js';
import { QueryAnswerModel } from '../models/queryAnswerModel.js';

const COLLECTION = 'queryAnswers';

// Valid user types
const VALID_USER_TYPES = ['CLIENT', 'LAWYER', 'ADMIN', 'SUBADMIN'];

/**
 * Validates user type value
 * @param {string} userType - User type to validate
 * @returns {boolean}
 */
function isValidUserType(userType) {
  return VALID_USER_TYPES.includes(userType);
}

// POST /query-answers (create)
export async function createQueryAnswer(req, res) {
  try {
    const {
      queryId = "",
      userId = "",
      userType = "",
      userName = "",
      answer = "",
    } = req.body || {};

    // Validation
    if (!queryId) return res.status(400).json({ success: false, error: 'queryId is required' });
    if (!userId) return res.status(400).json({ success: false, error: 'userId is required' });
    if (!userType) return res.status(400).json({ success: false, error: 'userType is required' });
    if (!userName) return res.status(400).json({ success: false, error: 'userName is required' });
    if (!answer) return res.status(400).json({ success: false, error: 'answer is required' });

    // Validate userType
    if (!isValidUserType(userType.toUpperCase())) {
      return res.status(400).json({ 
        success: false, 
        error: `Invalid userType. Must be one of: ${VALID_USER_TYPES.join(', ')}` 
      });
    }

    const docRef = db.collection(COLLECTION).doc(); // auto id
    const payload = new QueryAnswerModel({
      id: docRef.id,
      queryId,
      userId,
      userType: userType.toUpperCase(),
      userName,
      answer,
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now(),
    });

    await docRef.set(payload.toJson());
    const saved = await docRef.get();
    return res.status(201).json({ success: true, data: { id: saved.id, ...saved.data() }, message: 'Query answer created successfully' });
  } catch (err) {
    console.error('createQueryAnswer error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// GET /query-answers/query/:queryId - Get all answers for a specific query
export async function getAnswersByQueryId(req, res) {
  try {
    const { queryId } = req.params;
    const { limit = 50 } = req.query;

    if (!queryId) {
      return res.status(400).json({ success: false, error: 'queryId is required' });
    }

    const take = Math.min(Number(limit) || 50, 200);
    const snaps = await db.collection(COLLECTION)
      .where('queryId', '==', queryId)
      .orderBy('createdAt', 'asc') // Show answers in chronological order
      .limit(take)
      .get();

    const data = snaps.docs.map(d => ({ id: d.id, ...d.data() }));
    return res.json({ success: true, data, count: data.length });
  } catch (err) {
    console.error('getAnswersByQueryId error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// GET /query-answers/user/:userId - Get all answers by a specific user
export async function getAnswersByUserId(req, res) {
  try {
    const { userId } = req.params;
    const { limit = 50 } = req.query;

    if (!userId) {
      return res.status(400).json({ success: false, error: 'userId is required' });
    }

    const take = Math.min(Number(limit) || 50, 200);
    const snaps = await db.collection(COLLECTION)
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(take)
      .get();

    const data = snaps.docs.map(d => ({ id: d.id, ...d.data() }));
    return res.json({ success: true, data, count: data.length });
  } catch (err) {
    console.error('getAnswersByUserId error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// GET /query-answers/:id
export async function getQueryAnswerById(req, res) {
  try {
    const { id } = req.params;
    const snap = await db.collection(COLLECTION).doc(id).get();
    if (!snap.exists) return res.status(404).json({ success: false, error: 'Not found' });
    return res.json({ success: true, data: { id: snap.id, ...snap.data() } });
  } catch (err) {
    console.error('getQueryAnswerById error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// PUT /query-answers/:id (update)
export async function updateQueryAnswerById(req, res) {
  try {
    const { id } = req.params;

    const existingRef = db.collection(COLLECTION).doc(id);
    const existing = await existingRef.get();
    if (!existing.exists) return res.status(404).json({ success: false, error: 'Not found' });

    // Build a full replacement object (no merge)
    const {
      queryId = "",
      userId = "",
      userType = "",
      userName = "",
      answer = "",
      createdAt, // optional: keep original if not sent
    } = req.body || {};

    // Validation
    if (!queryId) return res.status(400).json({ success: false, error: 'queryId is required' });
    if (!userId) return res.status(400).json({ success: false, error: 'userId is required' });
    if (!userType) return res.status(400).json({ success: false, error: 'userType is required' });
    if (!userName) return res.status(400).json({ success: false, error: 'userName is required' });
    if (!answer) return res.status(400).json({ success: false, error: 'answer is required' });

    // Validate userType
    if (!isValidUserType(userType.toUpperCase())) {
      return res.status(400).json({ 
        success: false, 
        error: `Invalid userType. Must be one of: ${VALID_USER_TYPES.join(', ')}` 
      });
    }

    const replacement = new QueryAnswerModel({
      id,
      queryId,
      userId,
      userType: userType.toUpperCase(),
      userName,
      answer,
      createdAt: createdAt || existing.data().createdAt || admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now(),
    }).toJson();

    await existingRef.set(replacement, { merge: false });
    const saved = await existingRef.get();
    return res.json({ success: true, data: { id: saved.id, ...saved.data() }, message: 'Query answer updated successfully' });
  } catch (err) {
    console.error('updateQueryAnswerById error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// DELETE /query-answers/:id
export async function deleteQueryAnswerById(req, res) {
  try {
    const { id } = req.params;
    await db.collection(COLLECTION).doc(id).delete();
    return res.json({ success: true, message: 'Query answer deleted successfully' });
  } catch (err) {
    console.error('deleteQueryAnswerById error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// GET /query-answers (paginated)
export async function getAllQueryAnswers(req, res) {
  try {
    let q = db.collection(COLLECTION).orderBy('createdAt', 'desc');

    const { limit, startAfter, queryId, userId, userType } = req.query;
    const take = Math.min(Number(limit) || 50, 200);

    // Add filters if provided
    if (queryId) {
      q = q.where('queryId', '==', queryId);
    }
    if (userId) {
      q = q.where('userId', '==', userId);
    }
    if (userType && isValidUserType(userType.toUpperCase())) {
      q = q.where('userType', '==', userType.toUpperCase());
    }

    if (startAfter) {
      const cursorDoc = await db.collection(COLLECTION).doc(startAfter).get();
      if (cursorDoc.exists) q = q.startAfter(cursorDoc);
    }

    const snaps = await q.limit(take).get();
    const data = snaps.docs.map(d => ({ id: d.id, ...d.data() }));

    return res.json({ success: true, data });
  } catch (err) {
    console.error('getAllQueryAnswers error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// DELETE /query-answers (danger: delete all)
export async function deleteAllQueryAnswers(req, res) {
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
    // ⚠️ Lock this down in production (admin-only)
    // eslint-disable-next-line no-constant-condition
    while (await deleteBatch()) {}

    return res.json({ success: true, deleted });
  } catch (err) {
    console.error('deleteAllQueryAnswers error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
