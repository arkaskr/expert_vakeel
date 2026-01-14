// controllers/serviceController.js
import { db, admin } from "../config/firebase.js";
import { ServiceModel } from "../models/serviceModel.js";

const COLLECTION = "services";

// Helper functions
const s = (v) => (v ?? "").toString().trim();

// POST /services
export async function createService(req, res) {
    try {
        const body = req.body || {};
        const name = s(body.name);
        const description = s(body.description);
        const categories = Array.isArray(body.categories) ? body.categories : [];
        const number = s(body.number);

        if (!name) return res.status(400).json({ success: false, error: "name is required" });
        if (!description) return res.status(400).json({ success: false, error: "description is required" });

        const docRef = db.collection(COLLECTION).doc();
        const payload = new ServiceModel({
            id: docRef.id,
            name,
            description,
            categories,
            number,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        await docRef.set(payload.toJSON());

        const saved = await docRef.get();
        return res.status(201).json({ success: true, data: { id: saved.id, ...saved.data() } });
    } catch (err) {
        console.error("createService error:", err);
        return res.status(500).json({ success: false, error: err.message });
    }
}

// GET /services/:id
export async function getServiceById(req, res) {
    try {
        const { id } = req.params;
        const snap = await db.collection(COLLECTION).doc(id).get();
        if (!snap.exists) return res.status(404).json({ success: false, error: "Service not found" });
        return res.json({ success: true, data: { id: snap.id, ...snap.data() } });
    } catch (err) {
        console.error("getServiceById error:", err);
        return res.status(500).json({ success: false, error: err.message });
    }
}

// GET /services
export async function listServices(req, res) {
    try {
        let q = db.collection(COLLECTION).orderBy("createdAt", "desc");

        const { limit } = req.query;
        const take = Math.min(Number(limit) || 50, 200);

        const snaps = await q.limit(take).get();
        const data = snaps.docs.map((d) => ({ id: d.id, ...d.data() }));

        return res.json({ success: true, data });
    } catch (err) {
        console.error("listServices error:", err);
        return res.status(500).json({ success: false, error: err.message });
    }
}

// PUT /services/:id (update all fields)
export async function updateServiceById(req, res) {
    try {
        const { id } = req.params;
        const body = req.body || {};
        const name = s(body.name);
        const description = s(body.description);
        const categories = Array.isArray(body.categories) ? body.categories : [];
        const number = s(body.number);

        if (!name) return res.status(400).json({ success: false, error: "name is required" });
        if (!description) return res.status(400).json({ success: false, error: "description is required" });

        const docRef = db.collection(COLLECTION).doc(id);
        const existing = await docRef.get();
        if (!existing.exists) return res.status(404).json({ success: false, error: "Service not found" });

        const prev = existing.data() || {};

        const payload = {
            name,
            description,
            categories,
            number,
            createdAt: prev.createdAt || admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        await docRef.set(payload, { merge: false });
        const saved = await docRef.get();
        return res.json({ success: true, data: { id: saved.id, ...saved.data() } });
    } catch (err) {
        console.error("updateServiceById error:", err);
        return res.status(500).json({ success: false, error: err.message });
    }
}

// DELETE /services/:id
export async function deleteServiceById(req, res) {
    try {
        const { id } = req.params;
        const docRef = db.collection(COLLECTION).doc(id);
        const snap = await docRef.get();
        if (!snap.exists) return res.status(404).json({ success: false, error: "Service not found" });

        await docRef.delete();
        return res.json({ success: true, data: { id } });
    } catch (err) {
        console.error("deleteServiceById error:", err);
        return res.status(500).json({ success: false, error: err.message });
    }
}

// DELETE /services (dangerous — batch delete)
export async function deleteAllServices(_req, res) {
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
        console.error("deleteAllServices error:", err);
        return res.status(500).json({ success: false, error: err.message });
    }
}
