// routes/clientContactRoutes.js
import express from 'express';
import { createClientContactController, getClientContactByIdController, getClientContactsByClientController, getClientContactsByLawyerController, getClientContactByConversationController, updateClientContactStatusController, updateClientContactController } from '../controllers/clientContactController.js';

const router = express.Router();

// POST /api/client-contacts (create client contact record)
router.post('/', createClientContactController);

// GET /api/client-contacts/:id (get client contact by ID)
router.get('/:id', getClientContactByIdController);

// GET /api/client-contacts/client/:clientId (get contacts by client)
router.get('/client/:clientId', getClientContactsByClientController);

// GET /api/client-contacts/lawyer/:lawyerId (get contacts by lawyer)
router.get('/lawyer/:lawyerId', getClientContactsByLawyerController);

// GET /api/client-contacts/conversation/:conversationId (get contact by conversation)
router.get('/conversation/:conversationId', getClientContactByConversationController);

// PUT /api/client-contacts/:id/status (update contact status)
router.put('/:id/status', updateClientContactStatusController);

// PUT /api/client-contacts/:id (update contact details)
router.put('/:id', updateClientContactController);

export default router;
