// controllers/client.controller.js
import bcrypt from "bcrypt";
import { db, admin } from "../config/firebase.js";
import { ClientModel } from "../models/clientModel.js";
import { signToken } from "../utils/jwt.js";

const COLLECTION = "clients";

// ---------- Helpers ----------
const normalizeEmail = (e = "") => e.trim().toLowerCase();
const sanitize = (doc) => ClientModel.fromData({ id: doc.id, ...doc.data() }).toPublicJSON();

async function getClientDocByEmail(email) {
  const snap = await db.collection(COLLECTION).where("email", "==", email).limit(1).get();
  return snap.empty ? null : snap.docs[0];
}

// ---------- Controllers ----------
export async function createClient(req, res) {
  try {
    let { name = "", fullName = "", email = "", phone = "", city = "", password = "", profilePic = "" } = req.body || {};
    email = normalizeEmail(email);

    // Handle both 'name' and 'fullName' fields for compatibility
    const clientFullName = fullName || name;

    if (!clientFullName) return res.status(400).json({ success: false, error: "fullName is required" });
    if (!email) return res.status(400).json({ success: false, error: "email is required" });
    if (!password || String(password).length < 6)
      return res.status(400).json({ success: false, error: "password must be at least 6 chars" });

    // Ensure unique email
    const existing = await getClientDocByEmail(email);
    if (existing) return res.status(409).json({ success: false, error: "email already in use" });

    const hashedPassword = await bcrypt.hash(String(password), 10);

    const docRef = db.collection(COLLECTION).doc();
    const now = admin.firestore.FieldValue.serverTimestamp();
    const model = new ClientModel({
      id: docRef.id,
      fullName: clientFullName,
      email,
      phone,
      city,
      profilePic,
      hashedPassword,
      createdAt: now,
      updatedAt: now,
    });

    await docRef.set(model.toJSON());
    const saved = await docRef.get();

    // Generate JWT token for backend authentication
    const token = signToken({
      id: saved.id,
      email: saved.data().email,
      role: 'client'
    });

    // Generate Firebase custom token for frontend Firebase authentication
    const firebaseToken = await admin.auth().createCustomToken(saved.id);

    // Set JWT token in httpOnly cookie
    res.cookie('token', token, {
       httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.json({
      success: true,
      data: sanitize(saved),
      token,
      firebaseToken  // Send Firebase custom token to frontend
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function loginClient(req, res) {
  try {
    let { email = "", password = "" } = req.body || {};
    email = normalizeEmail(email);

    if (!email || !password)
      return res.status(400).json({ success: false, error: "email and password are required" });

    const doc = await getClientDocByEmail(email);
    if (!doc) return res.status(401).json({ success: false, error: "invalid credentials" });

    const data = doc.data();
    const ok = await bcrypt.compare(String(password), data.hashedPassword || "");
    if (!ok) return res.status(401).json({ success: false, error: "invalid credentials" });

    // Generate JWT token for backend authentication
    const token = signToken({
      id: doc.id,
      email: data.email,
      role: 'client'
    });

    // Generate Firebase custom token for frontend Firebase authentication
    const firebaseToken = await admin.auth().createCustomToken(doc.id);

    // Set JWT token in httpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.json({
      success: true,
      data: sanitize(doc),
      token,
      firebaseToken  // Send Firebase custom token to frontend
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function getClientById(req, res) {
  try {
    const { id } = req.params;
    const snap = await db.collection(COLLECTION).doc(id).get();
    if (!snap.exists) return res.status(404).json({ success: false, error: "not found" });
    return res.json({ success: true, data: sanitize(snap) });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function listClients(_req, res) {
  try {
    const snap = await db.collection(COLLECTION).orderBy("createdAt", "desc").get();
    const items = snap.docs.map(sanitize);
    return res.json({ success: true, data: items });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function updateClientById(req, res) {
  try {
    const { id } = req.params;
    const { fullName, email, phone, city, password } = req.body || {};

    const ref = db.collection(COLLECTION).doc(id);
    const snap = await ref.get();
    if (!snap.exists) return res.status(404).json({ success: false, error: "not found" });

    const update = {};
    if (typeof fullName !== "undefined") update.fullName = String(fullName);
    if (typeof email !== "undefined") {
      const normalized = normalizeEmail(email);
      // if changing email, enforce uniqueness
      if (normalized) {
        const other = await getClientDocByEmail(normalized);
        if (other && other.id !== id) {
          return res.status(409).json({ success: false, error: "email already in use" });
        }
      }
      update.email = normalized;
    }
    if (typeof phone !== "undefined") update.phone = String(phone);
    if (typeof city !== "undefined") update.city = String(city);
    if (typeof password !== "undefined" && password) {
      if (String(password).length < 6)
        return res.status(400).json({ success: false, error: "password must be at least 6 chars" });
      update.hashedPassword = await bcrypt.hash(String(password), 10);
    }

    update.updatedAt = admin.firestore.FieldValue.serverTimestamp();

    await ref.update(update);
    const updated = await ref.get();
    return res.json({ success: true, data: sanitize(updated) });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function deleteClientById(req, res) {
  try {
    const { id } = req.params;
    const ref = db.collection(COLLECTION).doc(id);
    const snap = await ref.get();
    if (!snap.exists) return res.status(404).json({ success: false, error: "not found" });
    await ref.delete();
    return res.json({ success: true, data: { id } });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function deleteAllClients(_req, res) {
  try {
    // Batch delete (use with care); for large collections use Firestore's bulk ops / functions.
    const snap = await db.collection(COLLECTION).get();
    const batch = db.batch();
    snap.docs.forEach((d) => batch.delete(d.ref));
    await batch.commit();
    return res.json({ success: true, data: { deleted: snap.size } });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function logoutClient(_req, res) {
  try {
    // Clear the JWT token cookie with the same options used when setting it
    res.clearCookie('token', {
     httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/'
    });
    return res.json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
