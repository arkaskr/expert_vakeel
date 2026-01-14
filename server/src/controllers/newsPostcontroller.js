// controllers/newsPost.controller.js
import { db, admin } from "../config/firebase.js";
import { NewsPost } from "../models/newsPost.model.js";

const COLLECTION = "news";

// small coercers (local to keep file self-contained)
const s = (v) => (v ?? "").toString().trim();
const b = (v, def = false) => (v === true || v === "true" ? true : v === false || v === "false" ? false : def);
const i = (v, def = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.floor(n) : def;
};

// POST /news
export async function createNews(req, res) {
  try {
    const body = req.body || {};
    const title = s(body.title);
    const imageUrl = s(body.imageUrl);
    const description = s(body.description);
    const brief = s(body.brief);
    const source = s(body.source);
    const liveLink = s(body.liveLink);
    const category = s(body.category);
    const views = i(body.views, 0);
    const isTrending = b(body.isTrending, false);
    const published = b(body.published, true);

    if (!title) return res.status(400).json({ success: false, error: "title is required" });
    if (!imageUrl) return res.status(400).json({ success: false, error: "imageUrl is required" });

    const docRef = db.collection(COLLECTION).doc();
    const payload = new NewsPost({
      id: docRef.id,
      title,
      imageUrl,
      description,
      brief,
      source,
      liveLink,
      category,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      views,
      isTrending,
      published,
    });

    await docRef.set({
      ...payload.toJson(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const saved = await docRef.get();
    return res.status(201).json({ success: true, data: { id: saved.id, ...saved.data() } });
  } catch (err) {
    console.error("createNews error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// GET /news/:id
export async function getNewsById(req, res) {
  try {
    const { id } = req.params;
    const snap = await db.collection(COLLECTION).doc(id).get();
    if (!snap.exists) return res.status(404).json({ success: false, error: "Not found" });
    return res.json({ success: true, data: { id: snap.id, ...snap.data() } });
  } catch (err) {
    console.error("getNewsById error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// GET /news
// query params: limit, startAfter (docId), category, published (bool), trending (bool), source
export async function listNews(req, res) {
  try {
    let q = db.collection(COLLECTION).orderBy("createdAt", "desc");

    // filters (all optional)
    const {
      category,
      published,
      trending,
      source,
      limit,
      startAfter,
    } = req.query;

    if (typeof category === "string" && category.trim()) {
      q = q.where("category", "==", category.trim());
    }
    if (typeof source === "string" && source.trim()) {
      q = q.where("source", "==", source.trim());
    }
    if (typeof published !== "undefined") {
      q = q.where("published", "==", b(published, true));
    }
    if (typeof trending !== "undefined") {
      q = q.where("isTrending", "==", b(trending, false));
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
    console.error("listNews error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// PUT /news/:id  (full replace, preserve createdAt)
export async function updateNewsById(req, res) {
  try {
    const { id } = req.params;

    const body = req.body || {};
    const title = s(body.title);
    const imageUrl = s(body.imageUrl);
    const description = s(body.description);
    const brief = s(body.brief);
    const source = s(body.source);
    const liveLink = s(body.liveLink);
    const category = s(body.category);
    const views = i(body.views, 0);
    const isTrending = b(body.isTrending, false);
    const published = b(body.published, true);

    if (!title) return res.status(400).json({ success: false, error: "title is required" });
    if (!imageUrl) return res.status(400).json({ success: false, error: "imageUrl is required" });

    const docRef = db.collection(COLLECTION).doc(id);
    const existing = await docRef.get();
    if (!existing.exists) return res.status(404).json({ success: false, error: "Not found" });

    const prev = existing.data() || {};

    const payload = {
      title,
      imageUrl,
      description,
      brief,
      source,
      liveLink,
      category,
      views,
      isTrending,
      published,
      createdAt: prev.createdAt || admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await docRef.set(payload, { merge: false });
    const saved = await docRef.get();
    return res.json({ success: true, data: { id: saved.id, ...saved.data() } });
  } catch (err) {
    console.error("updateNewsById error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// DELETE /news/:id
export async function deleteNewsById(req, res) {
  try {
    const { id } = req.params;
    await db.collection(COLLECTION).doc(id).delete();
    return res.json({ success: true });
  } catch (err) {
    console.error("deleteNewsById error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// DELETE /news  (dangerous — batch delete)
export async function deleteAllNews(_req, res) {
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
    console.error("deleteAllNews error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// (Optional) POST /news/:id/views/increment  — atomic counter
export async function incrementViews(req, res) {
  try {
    const { id } = req.params;
    const ref = db.collection(COLLECTION).doc(id);
    await ref.update({
      views: admin.firestore.FieldValue.increment(1),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    const snap = await ref.get();
    return res.json({ success: true, data: { id: snap.id, ...snap.data() } });
  } catch (err) {
    console.error("incrementViews error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
