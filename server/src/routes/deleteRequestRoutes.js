// routes/deleteRequestRoutes.js
import express from 'express';
import {
    getAllDeleteRequests,
    getDeleteRequestById,
    getDeleteRequestsByUserId,
    getDeleteRequestsByStatus,
    createDeleteRequest,
    updateDeleteRequestById,
    reviewDeleteRequest,
    deleteDeleteRequestById,
    deleteAllDeleteRequests,
} from '../controllers/deleteRequestController.js';

const router = express.Router();

// GET /delete-requests/user/:userId - Get all delete requests for a specific user
router.get('/user/:userId', getDeleteRequestsByUserId);

// GET /delete-requests/status/:status - Get delete requests by status
router.get('/status/:status', getDeleteRequestsByStatus);

// GET /delete-requests/:id - Get specific delete request by ID
router.get('/:id', getDeleteRequestById);

// GET /delete-requests - Get all delete requests (paginated with filters)
router.get('/', getAllDeleteRequests);

// POST /delete-requests - Create new delete request
router.post('/', createDeleteRequest);

// PUT /delete-requests/:id - Update existing delete request (replace all fields)
router.put('/:id', updateDeleteRequestById);

// PATCH /delete-requests/:id/review - Review (approve/reject) delete request
router.patch('/:id/review', reviewDeleteRequest);

// DELETE /delete-requests/:id - Delete specific delete request
router.delete('/:id', deleteDeleteRequestById);

// DELETE /delete-requests - Delete all delete requests (DANGER - admin only)
router.delete('/', deleteAllDeleteRequests);

export default router;
