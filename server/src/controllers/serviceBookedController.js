// controllers/serviceBookedController.js
import { db, admin } from "../config/firebase.js";
import { ServiceBookedModel } from "../models/serviceBookedModel.js";

const COLLECTION = "servicesBooked";

// Helper functions
const s = (v) => (v ?? "").toString().trim();

// POST /services-booked
export async function createServiceBooked(req, res) {
    try {
        const body = req.body || {};
        const clientId = s(body.clientId);
        const phoneNumber = s(body.phoneNumber);
        const title = s(body.title);
        const description = s(body.description);
        const servicesBooked = Array.isArray(body.servicesBooked) ? body.servicesBooked : [];

        if (!clientId) return res.status(400).json({ success: false, error: "clientId is required" });
        if (!phoneNumber) return res.status(400).json({ success: false, error: "phoneNumber is required" });
        if (!title) return res.status(400).json({ success: false, error: "title is required" });

        const docRef = db.collection(COLLECTION).doc();
        const payload = new ServiceBookedModel({
            id: docRef.id,
            clientId,
            phoneNumber,
            title,
            description,
            servicesBooked,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        await docRef.set(payload.toJSON());

        const saved = await docRef.get();
        return res.status(201).json({ success: true, data: { id: saved.id, ...saved.data() } });
    } catch (err) {
        console.error("createServiceBooked error:", err);
        return res.status(500).json({ success: false, error: err.message });
    }
}

// GET /services-booked/:id
export async function getServiceBookedById(req, res) {
    try {
        const { id } = req.params;
        const snap = await db.collection(COLLECTION).doc(id).get();
        if (!snap.exists) return res.status(404).json({ success: false, error: "Service booking not found" });
        return res.json({ success: true, data: { id: snap.id, ...snap.data() } });
    } catch (err) {
        console.error("getServiceBookedById error:", err);
        return res.status(500).json({ success: false, error: err.message });
    }
}

// GET /services-booked
export async function listServicesBooked(req, res) {
    try {
        let q = db.collection(COLLECTION).orderBy("createdAt", "desc");

        const { limit } = req.query;
        const take = Math.min(Number(limit) || 50, 200);

        const snaps = await q.limit(take).get();
        const data = snaps.docs.map((d) => ({ id: d.id, ...d.data() }));

        return res.json({ success: true, data });
    } catch (err) {
        console.error("listServicesBooked error:", err);
        return res.status(500).json({ success: false, error: err.message });
    }
}

// GET /services-booked/client/:clientId
export async function getServiceBookedByClientId(req, res) {
    try {
        const { clientId } = req.params;

        if (!clientId) return res.status(400).json({ success: false, error: "clientId is required" });

        const snap = await db.collection(COLLECTION)
            .where("clientId", "==", clientId)
            .get();

        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

        // Sort in memory to avoid needing a composite index
        data.sort((a, b) => {
            // Handle Firestore timestamps or regular dates
            const dateA = a.createdAt && a.createdAt.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
            const dateB = b.createdAt && b.createdAt.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
            return dateB - dateA; // Descending order
        });

        return res.json({ success: true, data });
    } catch (err) {
        console.error("getServiceBookedByClientId error:", err);
        return res.status(500).json({ success: false, error: err.message });
    }
}

// PUT /services-booked/:id (update all fields)
export async function updateServiceBookedById(req, res) {
    try {
        const { id } = req.params;
        const body = req.body || {};
        const clientId = s(body.clientId);
        const phoneNumber = s(body.phoneNumber);
        const title = s(body.title);
        const description = s(body.description);
        const servicesBooked = Array.isArray(body.servicesBooked) ? body.servicesBooked : [];

        if (!clientId) return res.status(400).json({ success: false, error: "clientId is required" });
        if (!phoneNumber) return res.status(400).json({ success: false, error: "phoneNumber is required" });
        if (!title) return res.status(400).json({ success: false, error: "title is required" });

        const docRef = db.collection(COLLECTION).doc(id);
        const existing = await docRef.get();
        if (!existing.exists) return res.status(404).json({ success: false, error: "Service booking not found" });

        const prev = existing.data() || {};

        const payload = {
            clientId,
            phoneNumber,
            title,
            description,
            servicesBooked,
            createdAt: prev.createdAt || admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        await docRef.set(payload, { merge: false });
        const saved = await docRef.get();
        return res.json({ success: true, data: { id: saved.id, ...saved.data() } });
    } catch (err) {
        console.error("updateServiceBookedById error:", err);
        return res.status(500).json({ success: false, error: err.message });
    }
}

// DELETE /services-booked/:id
export async function deleteServiceBookedById(req, res) {
    try {
        const { id } = req.params;
        const docRef = db.collection(COLLECTION).doc(id);
        const snap = await docRef.get();
        if (!snap.exists) return res.status(404).json({ success: false, error: "Service booking not found" });

        await docRef.delete();
        return res.json({ success: true, data: { id } });
    } catch (err) {
        console.error("deleteServiceBookedById error:", err);
        return res.status(500).json({ success: false, error: err.message });
    }
}

// DELETE /services-booked (dangerous — batch delete)
export async function deleteAllServicesBooked(_req, res) {
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
        console.error("deleteAllServicesBooked error:", err);
        return res.status(500).json({ success: false, error: err.message });
    }
}
