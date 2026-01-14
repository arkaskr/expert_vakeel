// controllers/notificationController.js
import { db, admin } from "../config/firebase.js";
import { Notification } from "../models/notificationModel.js";

const COLLECTION = "notifications";

// small coercers (local to keep file self-contained)
const s = (v) => (v ?? "").toString().trim();
const b = (v, def = false) => (v === true || v === "true" ? true : v === false || v === "false" ? false : def);

// POST /notifications
export async function createNotification(req, res) {
  try {
    const body = req.body || {};
    const title = s(body.title);
    const description = s(body.description);
    const image = s(body.image);
    const published = b(body.published, true);
    const read = b(body.read, false);

    if (!title) return res.status(400).json({ success: false, error: "title is required" });
    if (!description) return res.status(400).json({ success: false, error: "description is required" });

    const docRef = db.collection(COLLECTION).doc();
    const payload = new Notification({
      id: docRef.id,
      title,
      description,
      image,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      published,
      read,
    });

    await docRef.set({
      ...payload.toJson(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const saved = await docRef.get();
    return res.status(201).json({ success: true, data: { id: saved.id, ...saved.data() } });
  } catch (err) {
    console.error("createNotification error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// GET /notifications/:id
export async function getNotificationById(req, res) {
  try {
    const { id } = req.params;
    const snap = await db.collection(COLLECTION).doc(id).get();
    if (!snap.exists) return res.status(404).json({ success: false, error: "Not found" });
    return res.json({ success: true, data: { id: snap.id, ...snap.data() } });
  } catch (err) {
    console.error("getNotificationById error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// GET /notifications
// query params: limit, startAfter (docId), published (bool), read (bool)
export async function listNotifications(req, res) {
  try {
    let q = db.collection(COLLECTION).orderBy("createdAt", "desc");

    // filters (all optional)
    const {
      published,
      read,
      limit,
      startAfter,
    } = req.query;

    if (typeof published !== "undefined") {
      q = q.where("published", "==", b(published, true));
    }
    if (typeof read !== "undefined") {
      q = q.where("read", "==", b(read, false));
    }

    const take = Math.min(Number(limit) || 50, 200);

    if (startAfter) {
      const cursor = await db.collection(COLLECTION).doc(startAfter).get();
      if (cursor.exists) q = q.startAfter(cursor);
    }

    const snaps = await q.limit(take).get();
    const data = snaps.docs.map((d) => ({ id: d.id, ...d.data() }));

    return res.json({ success: true, data });
  } catch (err) {
    console.error("listNotifications error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// PUT /notifications/:id  (full replace, preserve createdAt)
export async function updateNotificationById(req, res) {
  try {
    const { id } = req.params;

    const body = req.body || {};
    const title = s(body.title);
    const description = s(body.description);
    const image = s(body.image);
    const published = b(body.published, true);
    const read = b(body.read, false);

    if (!title) return res.status(400).json({ success: false, error: "title is required" });
    if (!description) return res.status(400).json({ success: false, error: "description is required" });

    const docRef = db.collection(COLLECTION).doc(id);
    const existing = await docRef.get();
    if (!existing.exists) return res.status(404).json({ success: false, error: "Not found" });

    const prev = existing.data() || {};

    const payload = {
      title,
      description,
      image,
      published,
      read,
      createdAt: prev.createdAt || admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await docRef.set(payload, { merge: false });
    const saved = await docRef.get();
    return res.json({ success: true, data: { id: saved.id, ...saved.data() } });
  } catch (err) {
    console.error("updateNotificationById error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// DELETE /notifications/:id
export async function deleteNotificationById(req, res) {
  try {
    const { id } = req.params;
    await db.collection(COLLECTION).doc(id).delete();
    return res.json({ success: true });
  } catch (err) {
    console.error("deleteNotificationById error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// DELETE /notifications  (dangerous — batch delete)
export async function deleteAllNotifications(_req, res) {
  try {
    const batchSize = 300;
    let deleted = 0;
    while (true) {
      const snaps = await db.collection(COLLECTION).limit(batchSize).get();
      if (snaps.empty) break;
      const batch = db.batch();
      snaps.docs.forEach((doc) => batch.delete(doc.ref));
      await batch.commit();
      deleted += snaps.size;
      if (snaps.size < batchSize) break;
    }
    return res.json({ success: true, deleted });
  } catch (err) {
    console.error("deleteAllNotifications error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
