// controllers/deleteRequestController.js
import { db, admin } from '../config/firebase.js';
import { DeleteRequestModel } from '../models/deleteRequestModel.js';

const COLLECTION = 'delete_requests';

// POST /delete-requests  (create)
export async function createDeleteRequest(req, res) {
    try {
        const {
            userId = "",
            userName = "",
            userEmail = "",
            userPhone = "",
            reason = "",
            status = "pending",
            adminNotes = null,
        } = req.body || {};

        // Validation
        if (!userId) return res.status(400).json({ success: false, error: 'userId is required' });
        if (!reason) return res.status(400).json({ success: false, error: 'reason is required' });

        // Check if user already has a pending delete request
        const existingRequest = await db.collection(COLLECTION)
            .where('userId', '==', userId)
            .where('status', '==', 'pending')
            .get();

        if (!existingRequest.empty) {
            return res.status(400).json({
                success: false,
                error: 'User already has a pending delete request'
            });
        }

        const docRef = db.collection(COLLECTION).doc(); // auto id
        const payload = new DeleteRequestModel({
            id: docRef.id,
            userId,
            userName,
            userEmail,
            userPhone,
            reason,
            status,
            adminNotes,
            requestedAt: admin.firestore.Timestamp.now(),
            reviewedAt: null,
            reviewedBy: null,
        });

        await docRef.set(payload.toJson());
        const saved = await docRef.get();
        return res.status(201).json({ success: true, data: { id: saved.id, ...saved.data() } });
    } catch (err) {
        console.error('createDeleteRequest error:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
}

// GET /delete-requests/:id
export async function getDeleteRequestById(req, res) {
    try {
        const { id } = req.params;
        const snap = await db.collection(COLLECTION).doc(id).get();
        if (!snap.exists) return res.status(404).json({ success: false, error: 'Not found' });
        return res.json({ success: true, data: { id: snap.id, ...snap.data() } });
    } catch (err) {
        console.error('getDeleteRequestById error:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
}

// GET /delete-requests  (paginated)
export async function getAllDeleteRequests(req, res) {
    try {
        let q = db.collection(COLLECTION).orderBy('requestedAt', 'desc');

        const { limit, startAfter, status } = req.query;
        const take = Math.min(Number(limit) || 50, 200);

        // Filter by status if provided
        if (status) {
            q = db.collection(COLLECTION)
                .where('status', '==', status)
                .orderBy('requestedAt', 'desc');
        }

        if (startAfter) {
            const cursorDoc = await db.collection(COLLECTION).doc(startAfter).get();
            if (cursorDoc.exists) q = q.startAfter(cursorDoc);
        }

        const snaps = await q.limit(take).get();
        const data = snaps.docs.map(d => ({ id: d.id, ...d.data() }));

        return res.json({ success: true, data });
    } catch (err) {
        console.error('getAllDeleteRequests error:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
}

// GET /delete-requests/user/:userId
export async function getDeleteRequestsByUserId(req, res) {
    try {
        const { userId } = req.params;
        const snaps = await db.collection(COLLECTION)
            .where('userId', '==', userId)
            .orderBy('requestedAt', 'desc')
            .get();

        const data = snaps.docs.map(d => ({ id: d.id, ...d.data() }));
        return res.json({ success: true, data });
    } catch (err) {
        console.error('getDeleteRequestsByUserId error:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
}

// GET /delete-requests/status/:status
export async function getDeleteRequestsByStatus(req, res) {
    try {
        const { status } = req.params;
        const snaps = await db.collection(COLLECTION)
            .where('status', '==', status)
            .orderBy('requestedAt', 'desc')
            .get();

        const data = snaps.docs.map(d => ({ id: d.id, ...d.data() }));
        return res.json({ success: true, data });
    } catch (err) {
        console.error('getDeleteRequestsByStatus error:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
}

// PUT /delete-requests/:id  (replace all fields)
export async function updateDeleteRequestById(req, res) {
    try {
        const { id } = req.params;

        const existingRef = db.collection(COLLECTION).doc(id);
        const existing = await existingRef.get();
        if (!existing.exists) return res.status(404).json({ success: false, error: 'Not found' });

        const {
            userId = "",
            userName = "",
            userEmail = "",
            userPhone = "",
            reason = "",
            status = "pending",
            adminNotes = null,
            reviewedAt,
            reviewedBy,
        } = req.body || {};

        // Validation
        if (!userId) return res.status(400).json({ success: false, error: 'userId is required' });
        if (!reason) return res.status(400).json({ success: false, error: 'reason is required' });

        const replacement = new DeleteRequestModel({
            id,
            userId,
            userName,
            userEmail,
            userPhone,
            reason,
            status,
            adminNotes,
            requestedAt: existing.data().requestedAt || admin.firestore.Timestamp.now(),
            reviewedAt: reviewedAt || existing.data().reviewedAt,
            reviewedBy: reviewedBy || existing.data().reviewedBy,
        }).toJson();

        await existingRef.set(replacement, { merge: false });
        const saved = await existingRef.get();
        return res.json({ success: true, data: { id: saved.id, ...saved.data() } });
    } catch (err) {
        console.error('updateDeleteRequestById error:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
}

// PATCH /delete-requests/:id/review  (approve or reject)
export async function reviewDeleteRequest(req, res) {
    try {
        const { id } = req.params;
        const { status, adminNotes, reviewedBy } = req.body || {};

        if (!status || !['approved', 'rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                error: 'status must be "approved" or "rejected"'
            });
        }

        const existingRef = db.collection(COLLECTION).doc(id);
        const existing = await existingRef.get();
        if (!existing.exists) return res.status(404).json({ success: false, error: 'Not found' });

        const updateData = {
            status,
            adminNotes: adminNotes || null,
            reviewedAt: admin.firestore.Timestamp.now(),
            reviewedBy: reviewedBy || null,
        };

        await existingRef.update(updateData);
        const saved = await existingRef.get();
        return res.json({ success: true, data: { id: saved.id, ...saved.data() } });
    } catch (err) {
        console.error('reviewDeleteRequest error:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
}

// DELETE /delete-requests/:id
export async function deleteDeleteRequestById(req, res) {
    try {
        const { id } = req.params;
        await db.collection(COLLECTION).doc(id).delete();
        return res.json({ success: true });
    } catch (err) {
        console.error('deleteDeleteRequestById error:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
}

// DELETE /delete-requests  (danger: delete all)
export async function deleteAllDeleteRequests(req, res) {
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
        while (await deleteBatch()) { }

        return res.json({ success: true, deleted });
    } catch (err) {
        console.error('deleteAllDeleteRequests error:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
}
