// controllers/queryPost.controller.js
import { db, admin } from '../config/firebase.js';
import { QueryPost } from '../models/query.js';

const COLLECTION = 'queries';

// Helper function to get answer count for a query
async function getAnswerCountForQuery(queryId) {
  try {
    const answerCountSnap = await db.collection('queryAnswers')
      .where('queryId', '==', queryId)
      .get();

    return answerCountSnap.size;
  } catch (error) {
    console.error(`Error getting answer count for query ${queryId}:`, error);
    return 0; // Return 0 on error
  }
}

// POST /queries  (create)
export async function postQuery(req, res) {
  try {
    const {
      title = "",
      description = "",
      askedByName = "",
      askedById = "",
      answersCount = 0,
      source = "",
    } = req.body || {};

    if (!title) return res.status(400).json({ success: false, error: 'title is required' });
    if (!askedById) return res.status(400).json({ success: false, error: 'askedById is required' });

    const docRef = db.collection(COLLECTION).doc(); // auto-id
    const payload = new QueryPost({
      id: docRef.id,
      title,
      description,
      askedByName,
      askedById,
      answersCount: Number(answersCount) || 0,
      source,
      createdAt: admin.firestore.Timestamp.now(),
    });

    await docRef.set(payload.toJson());
    const saved = await docRef.get();

    return res.status(201).json({ success: true, data: { id: saved.id, ...saved.data() } });
  } catch (err) {
    console.error('postQuery error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// GET /queries/:id
export async function getQueryById(req, res) {
  try {
    const { id } = req.params;
    const snap = await db.collection(COLLECTION).doc(id).get();
    if (!snap.exists) return res.status(404).json({ success: false, error: 'Not found' });

    const query = { id: snap.id, ...snap.data() };

    // Get actual answer count for this query
    const actualAnswerCount = await getAnswerCountForQuery(id);
    query.answersCount = actualAnswerCount;

    return res.json({ success: true, data: query });
  } catch (err) {
    console.error('getQueryById error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// GET /queries
// Optional query params: limit, startAfter (docId), askedById (if you prefer filter here)
export async function getAllQueries(req, res) {
  try {
    let q = db.collection(COLLECTION).orderBy('createdAt', 'desc');

    const { limit, startAfter } = req.query;
    const take = Math.min(Number(limit) || 50, 200);

    if (startAfter) {
      const cursorDoc = await db.collection(COLLECTION).doc(startAfter).get();
      if (cursorDoc.exists) {
        q = q.startAfter(cursorDoc);
      }
    }

    const snaps = await q.limit(take).get();
    const queries = snaps.docs.map(d => ({ id: d.id, ...d.data() }));

    // Get actual answer count for each query
    const queriesWithAnswerCount = await Promise.all(
      queries.map(async (query) => {
        const actualAnswerCount = await getAnswerCountForQuery(query.id);
        return {
          ...query,
          answersCount: actualAnswerCount
        };
      })
    );

    return res.json({ success: true, data: queriesWithAnswerCount });
  } catch (err) {
    console.error('getAllQueries error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// GET /queries/user/:userId  (get by askedById)
export async function getQueriesByUserId(req, res) {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ success: false, error: 'userId is required' });

    const snaps = await db
      .collection(COLLECTION)
      .where('askedById', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    const queries = snaps.docs.map(d => ({ id: d.id, ...d.data() }));

    // Get actual answer count for each query
    const queriesWithAnswerCount = await Promise.all(
      queries.map(async (query) => {
        const actualAnswerCount = await getAnswerCountForQuery(query.id);
        return {
          ...query,
          answersCount: actualAnswerCount
        };
      })
    );

    return res.json({ success: true, data: queriesWithAnswerCount });
  } catch (err) {
    console.error('getQueriesByUserId error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// PUT /queries/:id  (replace all fields)
export async function updateQueryById(req, res) {
  try {
    const { id } = req.params;
    const {
      title = "",
      description = "",
      askedByName = "",
      askedById = "",
      answersCount = 0,
      source = "",
      createdAt, // optional (if you want to preserve original)
    } = req.body || {};

    const docRef = db.collection(COLLECTION).doc(id);
    const existing = await docRef.get();
    if (!existing.exists) return res.status(404).json({ success: false, error: 'Not found' });

    // Replace the entire document (no merge)
    const payload = {
      title,
      description,
      askedByName,
      askedById,
      answersCount: Number(answersCount) || 0,
      source,
      createdAt: createdAt ? createdAt : existing.data().createdAt ?? admin.firestore.Timestamp.now(),
    };

    await docRef.set(payload, { merge: false });
    const saved = await docRef.get();

    return res.json({ success: true, data: { id: saved.id, ...saved.data() } });
  } catch (err) {
    console.error('updateQueryById error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// DELETE /queries/:id
export async function deleteQueryById(req, res) {
  try {
    const { id } = req.params;
    await db.collection(COLLECTION).doc(id).delete();
    return res.json({ success: true });
  } catch (err) {
    console.error('deleteQueryById error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// DELETE /queries  (danger: delete all documents in collection)
export async function deleteAllQueries(req, res) {
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
      return snaps.size === batchSize; // if full batch, continue
    }

    // Keep deleting until empty
    // NOTE: consider restricting this endpoint in production
    //       (e.g., admin auth, dry-run, etc.)
    // eslint-disable-next-line no-constant-condition
    while (await deleteBatch()) {}

    return res.json({ success: true, deleted });
  } catch (err) {
    console.error('deleteAllQueries error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

