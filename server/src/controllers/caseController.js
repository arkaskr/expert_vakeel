// controllers/caseController.js
import { db, admin } from '../config/firebase.js';
import { CaseModel } from '../models/caseModel.js';

const COLLECTION = 'cases';

// GET /cases/user/:createdById
export async function getUserCases(req, res) {
  try {
    const { createdById } = req.params;
    const { status, limit = 50 } = req.query;

    if (!createdById) {
      return res.status(400).json({ success: false, error: 'createdById is required' });
    }

    let q = db.collection(COLLECTION)
      .where('createdById', '==', createdById)
      .orderBy('createdAt', 'desc');

    if (status) {
      q = q.where('status', '==', status.toUpperCase());
    }

    const take = Math.min(Number(limit) || 50, 200);
    const snaps = await q.limit(take).get();
    const data = snaps.docs.map(d => ({ id: d.id, ...d.data() }));

    return res.json({ success: true, data, count: data.length });
  } catch (err) {
    console.error('getUserCases error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// GET /cases/:id
export async function getCaseById(req, res) {
  try {
    const { id } = req.params;
    const snap = await db.collection(COLLECTION).doc(id).get();
    if (!snap.exists) return res.status(404).json({ success: false, error: 'Not found' });
    return res.json({ success: true, data: { id: snap.id, ...snap.data() } });
  } catch (err) {
    console.error('getCaseById error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// POST /cases
export async function createCase(req, res) {
  try {
    const {
      createdById = "",
      caseNumber = "",
      caseTypeAndRegistration = "",
      firNumber = "",
      partitionarName = "",
      clientNumber = "",
      respondentName = "",
      secondPartyNumber = "",
      courtName = "",
      roomNumber = "",
      amountReceived = null,
      judgeName = "",
      judgePost = "",
      remarks = "",
      purpose = "",
      status = "OPEN",
      nextHearingDate = null,
      lastHearingDate = null,
      remindMeDate = null,
    } = req.body || {};

    // Validation
    if (!createdById) return res.status(400).json({ success: false, error: 'createdById is required' });
    if (!caseNumber) return res.status(400).json({ success: false, error: 'caseNumber is required' });
    if (!caseTypeAndRegistration) return res.status(400).json({ success: false, error: 'caseTypeAndRegistration is required' });
    if (!partitionarName) return res.status(400).json({ success: false, error: 'partitionarName is required' });
    if (!respondentName) return res.status(400).json({ success: false, error: 'respondentName is required' });
    if (!courtName) return res.status(400).json({ success: false, error: 'courtName is required' });
    if (!judgeName) return res.status(400).json({ success: false, error: 'judgeName is required' });
    if (!judgePost) return res.status(400).json({ success: false, error: 'judgePost is required' });
    if (!purpose) return res.status(400).json({ success: false, error: 'purpose is required' });

    // Validate status
    const validStatuses = ['OPEN', 'CLOSED', 'ADJOURNED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: 'status must be OPEN, CLOSED, or ADJOURNED' });
    }

    const docRef = db.collection(COLLECTION).doc(); // auto id
    const payload = new CaseModel({
      id: docRef.id,
      createdById,
      caseNumber,
      caseTypeAndRegistration,
      firNumber,
      partitionarName,
      clientNumber,
      respondentName,
      secondPartyNumber,
      courtName,
      roomNumber,
      amountReceived: amountReceived !== null ? Number(amountReceived) : null,
      judgeName,
      judgePost,
      remarks,
      purpose,
      status,
      nextHearingDate,
      lastHearingDate,
      remindMeDate,
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now(),
    });

    await docRef.set(payload.toJson());
    const saved = await docRef.get();
    return res.status(201).json({ success: true, data: { id: saved.id, ...saved.data() }, message: 'Case created successfully' });
  } catch (err) {
    console.error('createCase error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// PUT /cases/:id
export async function updateCaseById(req, res) {
  try {
    const { id } = req.params;
    const existingRef = db.collection(COLLECTION).doc(id);
    const existing = await existingRef.get();
    if (!existing.exists) return res.status(404).json({ success: false, error: 'Not found' });

    const updateData = req.body || {};

    // Validate status if provided
    if (updateData.status) {
      const validStatuses = ['OPEN', 'CLOSED', 'ADJOURNED'];
      if (!validStatuses.includes(updateData.status)) {
        return res.status(400).json({ success: false, error: 'status must be OPEN, CLOSED, or ADJOURNED' });
      }
    }

    // Add updatedAt timestamp
    updateData.updatedAt = admin.firestore.Timestamp.now();

    await existingRef.update(updateData);
    const saved = await existingRef.get();
    return res.json({ success: true, data: { id: saved.id, ...saved.data() }, message: 'Case updated successfully' });
  } catch (err) {
    console.error('updateCaseById error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// DELETE /cases/:id
export async function deleteCaseById(req, res) {
  try {
    const { id } = req.params;
    await db.collection(COLLECTION).doc(id).delete();
    return res.json({ success: true, message: 'Case deleted successfully' });
  } catch (err) {
    console.error('deleteCaseById error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// GET /cases/hearings/upcoming
export async function getUpcomingHearings(req, res) {
  try {
    const { limit = 20 } = req.query;
    const take = Math.min(Number(limit) || 20, 200);
    const now = admin.firestore.Timestamp.now();

    const snaps = await db.collection(COLLECTION)
      .where('nextHearingDate', '>=', now)
      .where('status', 'in', ['OPEN', 'ADJOURNED'])
      .orderBy('nextHearingDate', 'asc')
      .limit(take)
      .get();

    const data = snaps.docs.map(d => ({ id: d.id, ...d.data() }));
    return res.json({ success: true, data, count: data.length });
  } catch (err) {
    console.error('getUpcomingHearings error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// GET /cases/reminders/overdue
export async function getOverdueReminders(req, res) {
  try {
    const now = admin.firestore.Timestamp.now();

    const snaps = await db.collection(COLLECTION)
      .where('remindMeDate', '<=', now)
      .where('status', 'in', ['OPEN', 'ADJOURNED'])
      .orderBy('remindMeDate', 'desc')
      .get();

    const data = snaps.docs.map(d => ({ id: d.id, ...d.data() }));
    return res.json({ success: true, data, count: data.length });
  } catch (err) {
    console.error('getOverdueReminders error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// GET /cases/status/:status
export async function getCasesByStatus(req, res) {
  try {
    const { status } = req.params;
    const { limit = 50 } = req.query;

    if (!status) {
      return res.status(400).json({ success: false, error: 'Status is required' });
    }

    const validStatuses = ['OPEN', 'CLOSED', 'ADJOURNED'];
    const upperStatus = status.toUpperCase();
    if (!validStatuses.includes(upperStatus)) {
      return res.status(400).json({ success: false, error: 'Invalid status. Must be OPEN, CLOSED, or ADJOURNED' });
    }

    const take = Math.min(Number(limit) || 50, 200);
    const snaps = await db.collection(COLLECTION)
      .where('status', '==', upperStatus)
      .orderBy('createdAt', 'desc')
      .limit(take)
      .get();

    const data = snaps.docs.map(d => ({ id: d.id, ...d.data() }));
    return res.json({ success: true, data, count: data.length });
  } catch (err) {
    console.error('getCasesByStatus error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// GET /cases  (paginated)
export async function getAllCases(req, res) {
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
    console.error('getAllCases error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// DELETE /cases  (danger: delete all)
export async function deleteAllCases(req, res) {
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
    console.error('deleteAllCases error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

