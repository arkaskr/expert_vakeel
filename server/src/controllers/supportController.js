// controllers/supportController.js
import { db, admin } from '../config/firebase.js';
import { SupportModel } from '../models/supportModel.js';

const COLLECTION = 'support';

// Valid status values
const VALID_STATUSES = ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

// Valid user types
const VALID_USER_TYPES = ['CLIENT', 'LAWYER', 'ADMIN', 'SUBADMIN'];

/**
 * Validates status value
 * @param {string} status - Status to validate
 * @returns {boolean}
 */
function isValidStatus(status) {
  return VALID_STATUSES.includes(status);
}

/**
 * Validates user type value
 * @param {string} userType - User type to validate
 * @returns {boolean}
 */
function isValidUserType(userType) {
  return VALID_USER_TYPES.includes(userType);
}

// POST /support (create)
export async function createSupport(req, res) {
  try {
    const {
      userId = "",
      userType = "",
      purpose = "",
      category = "",
      title = "",
      description = "",
      status = "PENDING",
      answers = [],
    } = req.body || {};

    // Validation
    if (!userId) return res.status(400).json({ success: false, error: 'userId is required' });
    if (!userType) return res.status(400).json({ success: false, error: 'userType is required' });
    if (!purpose) return res.status(400).json({ success: false, error: 'purpose is required' });
    if (!category) return res.status(400).json({ success: false, error: 'category is required' });
    if (!title) return res.status(400).json({ success: false, error: 'title is required' });
    if (!description) return res.status(400).json({ success: false, error: 'description is required' });

    // Validate userType
    if (!isValidUserType(userType.toUpperCase())) {
      return res.status(400).json({ 
        success: false, 
        error: `Invalid userType. Must be one of: ${VALID_USER_TYPES.join(', ')}` 
      });
    }

    // Validate status
    if (!isValidStatus(status.toUpperCase())) {
      return res.status(400).json({ 
        success: false, 
        error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` 
      });
    }

    const docRef = db.collection(COLLECTION).doc(); // auto id
    const payload = new SupportModel({
      id: docRef.id,
      userId,
      userType: userType.toUpperCase(),
      purpose,
      category,
      title,
      description,
      status: status.toUpperCase(),
      answers: Array.isArray(answers) ? answers : [],
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now(),
    });

    await docRef.set(payload.toJson());
    const saved = await docRef.get();
    return res.status(201).json({ success: true, data: { id: saved.id, ...saved.data() }, message: 'Support ticket created successfully' });
  } catch (err) {
    console.error('createSupport error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// GET /support/:id
export async function getSupportById(req, res) {
  try {
    const { id } = req.params;
    const snap = await db.collection(COLLECTION).doc(id).get();
    if (!snap.exists) return res.status(404).json({ success: false, error: 'Not found' });
    return res.json({ success: true, data: { id: snap.id, ...snap.data() } });
  } catch (err) {
    console.error('getSupportById error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// GET /support (paginated)
export async function getAllSupport(req, res) {
  try {
    let q = db.collection(COLLECTION).orderBy('createdAt', 'desc');

    const { limit, startAfter, status, userId, userType, category } = req.query;
    const take = Math.min(Number(limit) || 50, 200);

    // Add filters if provided
    if (status && isValidStatus(status.toUpperCase())) {
      q = q.where('status', '==', status.toUpperCase());
    }
    if (userId) {
      q = q.where('userId', '==', userId);
    }
    if (userType && isValidUserType(userType.toUpperCase())) {
      q = q.where('userType', '==', userType.toUpperCase());
    }
    if (category) {
      q = q.where('category', '==', category);
    }

    if (startAfter) {
      const cursorDoc = await db.collection(COLLECTION).doc(startAfter).get();
      if (cursorDoc.exists) q = q.startAfter(cursorDoc);
    }

    const snaps = await q.limit(take).get();
    const data = snaps.docs.map(d => ({ id: d.id, ...d.data() }));

    return res.json({ success: true, data });
  } catch (err) {
    console.error('getAllSupport error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// PUT /support/:id (replace all fields)
export async function updateSupportById(req, res) {
  try {
    const { id } = req.params;

    const existingRef = db.collection(COLLECTION).doc(id);
    const existing = await existingRef.get();
    if (!existing.exists) return res.status(404).json({ success: false, error: 'Not found' });

    // Build a full replacement object (no merge)
    const {
      userId = "",
      userType = "",
      purpose = "",
      category = "",
      title = "",
      description = "",
      status = "PENDING",
      answers = [],
      createdAt, // optional: keep original if not sent
    } = req.body || {};

    // Validation
    if (!userId) return res.status(400).json({ success: false, error: 'userId is required' });
    if (!userType) return res.status(400).json({ success: false, error: 'userType is required' });
    if (!purpose) return res.status(400).json({ success: false, error: 'purpose is required' });
    if (!category) return res.status(400).json({ success: false, error: 'category is required' });
    if (!title) return res.status(400).json({ success: false, error: 'title is required' });
    if (!description) return res.status(400).json({ success: false, error: 'description is required' });

    // Validate userType
    if (!isValidUserType(userType.toUpperCase())) {
      return res.status(400).json({ 
        success: false, 
        error: `Invalid userType. Must be one of: ${VALID_USER_TYPES.join(', ')}` 
      });
    }

    // Validate status
    if (!isValidStatus(status.toUpperCase())) {
      return res.status(400).json({ 
        success: false, 
        error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` 
      });
    }

    const replacement = new SupportModel({
      id,
      userId,
      userType: userType.toUpperCase(),
      purpose,
      category,
      title,
      description,
      status: status.toUpperCase(),
      answers: Array.isArray(answers) ? answers : [],
      createdAt: createdAt || existing.data().createdAt || admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now(),
    }).toJson();

    await existingRef.set(replacement, { merge: false });
    const saved = await existingRef.get();
    return res.json({ success: true, data: { id: saved.id, ...saved.data() }, message: 'Support ticket updated successfully' });
  } catch (err) {
    console.error('updateSupportById error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// DELETE /support/:id
export async function deleteSupportById(req, res) {
  try {
    const { id } = req.params;
    await db.collection(COLLECTION).doc(id).delete();
    return res.json({ success: true, message: 'Support ticket deleted successfully' });
  } catch (err) {
    console.error('deleteSupportById error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// DELETE /support (danger: delete all)
export async function deleteAllSupport(req, res) {
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
    console.error('deleteAllSupport error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// GET /support/user/:userId - Get all support tickets for a specific user
export async function getSupportByUserId(req, res) {
  try {
    const { userId } = req.params;
    const { status, limit = 50 } = req.query;

    if (!userId) {
      return res.status(400).json({ success: false, error: 'userId is required' });
    }

    let q = db.collection(COLLECTION)
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc');

    if (status && isValidStatus(status.toUpperCase())) {
      q = q.where('status', '==', status.toUpperCase());
    }

    const take = Math.min(Number(limit) || 50, 200);
    const snaps = await q.limit(take).get();
    const data = snaps.docs.map(d => ({ id: d.id, ...d.data() }));

    return res.json({ success: true, data, count: data.length });
  } catch (err) {
    console.error('getSupportByUserId error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// GET /support/status/:status - Get support tickets by status
export async function getSupportByStatus(req, res) {
  try {
    const { status } = req.params;
    const { limit = 50 } = req.query;

    if (!status) {
      return res.status(400).json({ success: false, error: 'Status is required' });
    }

    const upperStatus = status.toUpperCase();
    if (!isValidStatus(upperStatus)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`
      });
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
    console.error('getSupportByStatus error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// PATCH /support/:id/status - Update support ticket status
export async function updateSupportStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, error: 'Status is required' });
    }

    const upperStatus = status.toUpperCase();
    if (!isValidStatus(upperStatus)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`
      });
    }

    const ticketRef = db.collection(COLLECTION).doc(id);
    const ticket = await ticketRef.get();

    if (!ticket.exists) {
      return res.status(404).json({ success: false, error: 'Support ticket not found' });
    }

    await ticketRef.update({
      status: upperStatus,
      updatedAt: admin.firestore.Timestamp.now()
    });

    const updatedTicket = await ticketRef.get();
    return res.json({
      success: true,
      data: { id: updatedTicket.id, ...updatedTicket.data() },
      message: 'Support ticket status updated successfully'
    });
  } catch (err) {
    console.error('updateSupportStatus error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// POST /support/:id/answer - Add answer to support ticket
export async function addSupportAnswer(req, res) {
  try {
    const { id } = req.params;
    const { answer, answeredBy, answeredByType } = req.body;

    if (!answer || !answer.trim()) {
      return res.status(400).json({ success: false, error: 'Answer is required' });
    }

    if (!answeredBy) {
      return res.status(400).json({ success: false, error: 'answeredBy is required' });
    }

    if (!answeredByType || !['ADMIN', 'SUBADMIN'].includes(answeredByType.toUpperCase())) {
      return res.status(400).json({ success: false, error: 'Valid answeredByType is required (ADMIN or SUBADMIN)' });
    }

    const ticketRef = db.collection(COLLECTION).doc(id);
    const ticket = await ticketRef.get();

    if (!ticket.exists) {
      return res.status(404).json({ success: false, error: 'Support ticket not found' });
    }

    const ticketData = ticket.data();
    const answers = ticketData.answers || [];

    const newAnswer = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      answer: answer.trim(),
      answeredBy,
      answeredByType: answeredByType.toUpperCase(),
      answeredAt: admin.firestore.Timestamp.now()
    };

    answers.push(newAnswer);

    await ticketRef.update({
      answers,
      updatedAt: admin.firestore.Timestamp.now()
    });

    const updatedTicket = await ticketRef.get();
    return res.json({
      success: true,
      data: { id: updatedTicket.id, ...updatedTicket.data() },
      message: 'Answer added successfully'
    });
  } catch (err) {
    console.error('addSupportAnswer error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}