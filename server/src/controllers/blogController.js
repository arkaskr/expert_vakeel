// controllers/blogController.js
import { db, admin } from "../config/firebase.js";
import { Blog } from "../models/blogModel.js";

const COLLECTION = "blogs";

// small coercers (local to keep file self-contained)
const s = (v) => (v ?? "").toString().trim();
const b = (v, def = false) => (v === true || v === "true" ? true : v === false || v === "false" ? false : def);

// POST /blogs
export async function createBlog(req, res) {
  try {
    const body = req.body || {};
    const title = s(body.title);
    const category = s(body.category);
    const subtitle = s(body.subtitle);
    const description = s(body.description);
    const image = s(body.image);
    const published = b(body.published, true);

    if (!title) return res.status(400).json({ success: false, error: "title is required" });
    if (!description) return res.status(400).json({ success: false, error: "description is required" });

    const docRef = db.collection(COLLECTION).doc();
    const payload = new Blog({
      id: docRef.id,
      title,
      category,
      subtitle,
      description,
      image,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      published,
    });

    await docRef.set({
      ...payload.toJson(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const saved = await docRef.get();
    return res.status(201).json({ success: true, data: { id: saved.id, ...saved.data() } });
  } catch (err) {
    console.error("createBlog error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// GET /blogs/:id
export async function getBlogById(req, res) {
  try {
    const { id } = req.params;
    const snap = await db.collection(COLLECTION).doc(id).get();
    if (!snap.exists) return res.status(404).json({ success: false, error: "Not found" });
    return res.json({ success: true, data: { id: snap.id, ...snap.data() } });
  } catch (err) {
    console.error("getBlogById error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// GET /blogs
// query params: limit, startAfter (docId), category, published (bool)
export async function listBlogs(req, res) {
  try {
    let q = db.collection(COLLECTION).orderBy("createdAt", "desc");

    // filters (all optional)
    const {
      category,
      published,
      limit,
      startAfter,
    } = req.query;

    if (typeof category === "string" && category.trim()) {
      q = q.where("category", "==", category.trim());
    }
    if (typeof published !== "undefined") {
      q = q.where("published", "==", b(published, true));
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
    console.error("listBlogs error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// PUT /blogs/:id  (full replace, preserve createdAt)
export async function updateBlogById(req, res) {
  try {
    const { id } = req.params;

    const body = req.body || {};
    const title = s(body.title);
    const category = s(body.category);
    const subtitle = s(body.subtitle);
    const description = s(body.description);
    const image = s(body.image);
    const published = b(body.published, true);

    if (!title) return res.status(400).json({ success: false, error: "title is required" });
    if (!description) return res.status(400).json({ success: false, error: "description is required" });

    const docRef = db.collection(COLLECTION).doc(id);
    const existing = await docRef.get();
    if (!existing.exists) return res.status(404).json({ success: false, error: "Not found" });

    const prev = existing.data() || {};

    const payload = {
      title,
      category,
      subtitle,
      description,
      image,
      published,
      createdAt: prev.createdAt || admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await docRef.set(payload, { merge: false });
    const saved = await docRef.get();
    return res.json({ success: true, data: { id: saved.id, ...saved.data() } });
  } catch (err) {
    console.error("updateBlogById error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// DELETE /blogs/:id
export async function deleteBlogById(req, res) {
  try {
    const { id } = req.params;
    await db.collection(COLLECTION).doc(id).delete();
    return res.json({ success: true });
  } catch (err) {
    console.error("deleteBlogById error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// DELETE /blogs  (dangerous — batch delete)
export async function deleteAllBlogs(_req, res) {
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
    console.error("deleteAllBlogs error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
