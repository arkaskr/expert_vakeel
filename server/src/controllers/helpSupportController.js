// controllers/helpSupportController.js
import { db, admin } from '../config/firebase.js';
import { HelpSupportModel } from '../models/helpSupportModel.js';

const COLLECTION = 'helpSupport';

// POST /help-support  (create)
export async function createHelpSupport(req, res) {
  try {
    const {
      userId = "",
      from = "",
      title = "",
      description = "",
      category = "",
      answer = "",
      status = "PENDING",
    } = req.body || {};

    // Validation
    if (!userId) return res.status(400).json({ success: false, error: 'userId is required' });
    if (!from) return res.status(400).json({ success: false, error: 'from is required' });
    if (!title) return res.status(400).json({ success: false, error: 'title is required' });
    if (!description) return res.status(400).json({ success: false, error: 'description is required' });
    if (!category) return res.status(400).json({ success: false, error: 'category is required' });

    const docRef = db.collection(COLLECTION).doc(); // auto id
    const payload = new HelpSupportModel({
      id: docRef.id,
      userId,
      from,
      title,
      description,
      category,
      answer,
      status,
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now(),
    });

    await docRef.set(payload.toJson());
    const saved = await docRef.get();
    return res.status(201).json({ success: true, data: { id: saved.id, ...saved.data() } });
  } catch (err) {
    console.error('createHelpSupport error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// GET /help-support/:id
export async function getHelpSupportById(req, res) {
  try {
    const { id } = req.params;
    const snap = await db.collection(COLLECTION).doc(id).get();
    if (!snap.exists) return res.status(404).json({ success: false, error: 'Not found' });
    return res.json({ success: true, data: { id: snap.id, ...snap.data() } });
  } catch (err) {
    console.error('getHelpSupportById error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// GET /help-support  (paginated)
export async function getAllHelpSupports(req, res) {
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

    return res.json({ success: true, data });
  } catch (err) {
    console.error('getAllHelpSupports error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// PUT /help-support/:id  (replace all fields)
export async function updateHelpSupportById(req, res) {
  try {
    const { id } = req.params;

    const existingRef = db.collection(COLLECTION).doc(id);
    const existing = await existingRef.get();
    if (!existing.exists) return res.status(404).json({ success: false, error: 'Not found' });

    // Build a full replacement object (no merge)
    const {
      userId = "",
      from = "",
      title = "",
      description = "",
      category = "",
      answer = "",
      status = "PENDING",
      createdAt, // optional: keep original if not sent
      updatedAt, // optional: update to now if not sent
    } = req.body || {};

    // Validation
    if (!userId) return res.status(400).json({ success: false, error: 'userId is required' });
    if (!from) return res.status(400).json({ success: false, error: 'from is required' });
    if (!title) return res.status(400).json({ success: false, error: 'title is required' });
    if (!description) return res.status(400).json({ success: false, error: 'description is required' });
    if (!category) return res.status(400).json({ success: false, error: 'category is required' });

    const replacement = new HelpSupportModel({
      id,
      userId,
      from,
      title,
      description,
      category,
      answer,
      status,
      createdAt: createdAt || existing.data().createdAt || admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now(),
    }).toJson();

    await existingRef.set(replacement, { merge: false });
    const saved = await existingRef.get();
    return res.json({ success: true, data: { id: saved.id, ...saved.data() } });
  } catch (err) {
    console.error('updateHelpSupportById error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// DELETE /help-support/:id
export async function deleteHelpSupportById(req, res) {
  try {
    const { id } = req.params;
    await db.collection(COLLECTION).doc(id).delete();
    return res.json({ success: true });
  } catch (err) {
    console.error('deleteHelpSupportById error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// DELETE /help-support  (danger: delete all)
export async function deleteAllHelpSupports(req, res) {
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
    console.error('deleteAllHelpSupports error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}