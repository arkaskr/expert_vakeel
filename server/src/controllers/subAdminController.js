// controllers/subAdminController.js
import { db, admin } from '../config/firebase.js';
import { SubAdminModel } from '../models/subAdminModel.js';
import bcrypt from 'bcrypt';
import { signToken } from '../utils/jwt.js';

const COLLECTION = 'subAdmins';

// Valid tab keys that must match the frontend sidebar exactly
const VALID_TAB_KEYS = [
  "Lawyers", "Clients", "Cases", "News", "Queries", 
  "Admins", "SubAdmins", "Blogs", "Notifications"
];

/**
 * Validates allowedTabs array
 * @param {string[]} tabs - Array of tab keys to validate
 * @returns {{ valid: boolean, invalidTabs: string[] }}
 */
function validateAllowedTabs(tabs) {
  if (!Array.isArray(tabs)) {
    return { valid: false, invalidTabs: [] };
  }
  const invalidTabs = tabs.filter(tab => !VALID_TAB_KEYS.includes(tab));
  return {
    valid: invalidTabs.length === 0,
    invalidTabs
  };
}

// POST /subAdmins  (create)
export async function createSubAdmin(req, res) {
  try {
    const {
      name = "",
      email = "",
      password = "",
      phoneNumber = "",
      role = "",
      allowedTabs = [],
      isActive = true,
    } = req.body || {};

    // Validation
    if (!name) return res.status(400).json({ success: false, error: 'name is required' });
    if (!email) return res.status(400).json({ success: false, error: 'email is required' });
    if (!password) return res.status(400).json({ success: false, error: 'password is required' });
    if (!role) return res.status(400).json({ success: false, error: 'role is required' });

    // Validate allowedTabs
    const tabValidation = validateAllowedTabs(allowedTabs);
    if (!tabValidation.valid) {
      return res.status(400).json({ 
        success: false, 
        error: `Invalid tab keys: ${tabValidation.invalidTabs.join(', ')}. Valid keys are: ${VALID_TAB_KEYS.join(', ')}` 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(String(password), 10);

    const docRef = db.collection(COLLECTION).doc(); // auto id
    const payload = new SubAdminModel({
      id: docRef.id,
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      role,
      allowedTabs,
      createdAt: admin.firestore.Timestamp.now(),
      isActive,
    });

    await docRef.set(payload.toJson());
    const saved = await docRef.get();
    return res.status(201).json({ success: true, data: { id: saved.id, ...saved.data() } });
  } catch (err) {
    console.error('createSubAdmin error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// POST /subAdmins/login  (login)
export async function loginSubAdmin(req, res) {
  try {
    let { email = "", password = "" } = req.body || {};
    email = email.toLowerCase().trim();

    if (!email || !password)
      return res.status(400).json({ success: false, error: "email and password are required" });

    // Find subAdmin by email
    const snapshot = await db.collection(COLLECTION).where('email', '==', email).limit(1).get();
    if (snapshot.empty) return res.status(401).json({ success: false, error: "invalid credentials" });

    const doc = snapshot.docs[0];
    const data = doc.data();

    // Check password
    const ok = await bcrypt.compare(String(password), data.password || "");
    if (!ok) return res.status(401).json({ success: false, error: "invalid credentials" });

    // Generate JWT token
    const token = signToken({
      id: doc.id,
      email: data.email,
      role: 'subAdmin',
      allowedTabs: data.allowedTabs || []
    });

    // Set token in httpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: true, // Always use secure in production with Vercel
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'none' // Required for cross-origin cookies
    });

    return res.json({
      success: true,
      data: {
        id: doc.id,
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        role: data.role,
        allowedTabs: data.allowedTabs,
        isActive: data.isActive
      }
    });
  } catch (err) {
    console.error('loginSubAdmin error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// GET /subAdmins/:id
export async function getSubAdminById(req, res) {
  try {
    const { id } = req.params;
    const snap = await db.collection(COLLECTION).doc(id).get();
    if (!snap.exists) return res.status(404).json({ success: false, error: 'Not found' });
    return res.json({ success: true, data: { id: snap.id, ...snap.data() } });
  } catch (err) {
    console.error('getSubAdminById error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// GET /subAdmins  (paginated)
export async function getAllSubAdmins(req, res) {
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
    console.error('getAllSubAdmins error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// PUT /subAdmins/:id  (replace all fields)
export async function updateSubAdminById(req, res) {
  try {
    const { id } = req.params;

    const existingRef = db.collection(COLLECTION).doc(id);
    const existing = await existingRef.get();
    if (!existing.exists) return res.status(404).json({ success: false, error: 'Not found' });

    // Build a full replacement object (no merge)
    const {
      name = "",
      email = "",
      password = "",
      phoneNumber = "",
      role = "",
      allowedTabs = [],
      createdAt, // optional: keep original if not sent
      isActive = true,
    } = req.body || {};

    // Validation
    if (!name) return res.status(400).json({ success: false, error: 'name is required' });
    if (!email) return res.status(400).json({ success: false, error: 'email is required' });
    if (!password) return res.status(400).json({ success: false, error: 'password is required' });
    if (!role) return res.status(400).json({ success: false, error: 'role is required' });

    // Validate allowedTabs
    const tabValidation = validateAllowedTabs(allowedTabs);
    if (!tabValidation.valid) {
      return res.status(400).json({ 
        success: false, 
        error: `Invalid tab keys: ${tabValidation.invalidTabs.join(', ')}. Valid keys are: ${VALID_TAB_KEYS.join(', ')}` 
      });
    }

    // Hash password if provided
    const hashedPassword = await bcrypt.hash(String(password), 10);

    const replacement = new SubAdminModel({
      id,
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      role,
      allowedTabs,
      createdAt: createdAt || existing.data().createdAt || admin.firestore.Timestamp.now(),
      isActive,
    }).toJson();

    await existingRef.set(replacement, { merge: false });
    const saved = await existingRef.get();
    return res.json({ success: true, data: { id: saved.id, ...saved.data() } });
  } catch (err) {
    console.error('updateSubAdminById error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// DELETE /subAdmins/:id
export async function deleteSubAdminById(req, res) {
  try {
    const { id } = req.params;
    await db.collection(COLLECTION).doc(id).delete();
    return res.json({ success: true });
  } catch (err) {
    console.error('deleteSubAdminById error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// DELETE /subAdmins  (danger: delete all)
export async function deleteAllSubAdmins(req, res) {
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
    console.error('deleteAllSubAdmins error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
