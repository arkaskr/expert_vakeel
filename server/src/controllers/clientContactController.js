// controllers/clientContactController.js
import { ClientContactModel, getClientContactById, getClientContactsByClientId, getClientContactsByLawyerId, getClientContactsByConversationId, getClientContactByParticipants, createClientContact, updateClientContact, updateContactStatus } from '../models/clientContactModel.js';

// POST /api/client-contacts (create client contact record)
export async function createClientContactController(req, res) {
  try {
    const { clientId, lawyerId, contactType = 'chat', conversationId, notes } = req.body || {};

    // Validation
    if (!clientId || !lawyerId) {
      return res.status(400).json({
        success: false,
        error: 'clientId and lawyerId are required'
      });
    }

    // Check if contact already exists between these participants
    const existingContact = await getClientContactByParticipants(clientId, lawyerId);

    if (existingContact) {
      // Update the existing contact's last activity
      await updateClientContact(existingContact.id, {
        status: existingContact.status === 'initiated' ? 'responded' : existingContact.status,
        conversationId: conversationId || existingContact.conversationId,
        notes: notes || existingContact.notes,
      });

      return res.json({
        success: true,
        data: existingContact.toPublicJSON(),
        message: 'Contact record updated'
      });
    }

    // Create new contact record
    const contactData = {
      clientId,
      lawyerId,
      contactType,
      conversationId,
      notes,
    };

    const contactId = await createClientContact(contactData);
    const createdContact = await getClientContactById(contactId);

    return res.status(201).json({
      success: true,
      data: createdContact.toPublicJSON()
    });
  } catch (err) {
    console.error('createClientContactController error:', err);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}

// GET /api/client-contacts/:id (get client contact by ID)
export async function getClientContactByIdController(req, res) {
  try {
    const { id } = req.params;
    const contact = await getClientContactById(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Client contact not found'
      });
    }

    return res.json({
      success: true,
      data: contact.toPublicJSON()
    });
  } catch (err) {
    console.error('getClientContactByIdController error:', err);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}

// GET /api/client-contacts/client/:clientId (get contacts by client)
export async function getClientContactsByClientController(req, res) {
  try {
    const { clientId } = req.params;
    const contacts = await getClientContactsByClientId(clientId);

    return res.json({
      success: true,
      data: contacts.map(contact => contact.toPublicJSON())
    });
  } catch (err) {
    console.error('getClientContactsByClientController error:', err);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}

// GET /api/client-contacts/lawyer/:lawyerId (get contacts by lawyer)
export async function getClientContactsByLawyerController(req, res) {
  try {
    const { lawyerId } = req.params;
    const contacts = await getClientContactsByLawyerId(lawyerId);

    return res.json({
      success: true,
      data: contacts.map(contact => contact.toPublicJSON())
    });
  } catch (err) {
    console.error('getClientContactsByLawyerController error:', err);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}

// GET /api/client-contacts/conversation/:conversationId (get contact by conversation)
export async function getClientContactByConversationController(req, res) {
  try {
    const { conversationId } = req.params;
    const contact = await getClientContactsByConversationId(conversationId);

    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'No contact found for this conversation'
      });
    }

    return res.json({
      success: true,
      data: contact.toPublicJSON()
    });
  } catch (err) {
    console.error('getClientContactByConversationController error:', err);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}

// PUT /api/client-contacts/:id/status (update contact status)
export async function updateClientContactStatusController(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body || {};

    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Status is required'
      });
    }

    const validStatuses = ['initiated', 'responded', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
      });
    }

    await updateContactStatus(id, status);

    const updatedContact = await getClientContactById(id);
    return res.json({
      success: true,
      data: updatedContact.toPublicJSON()
    });
  } catch (err) {
    console.error('updateClientContactStatusController error:', err);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}

// PUT /api/client-contacts/:id (update contact details)
export async function updateClientContactController(req, res) {
  try {
    const { id } = req.params;
    const { contactType, status, conversationId, notes } = req.body || {};

    const updateData = {};
    if (contactType) updateData.contactType = contactType;
    if (status) updateData.status = status;
    if (conversationId) updateData.conversationId = conversationId;
    if (notes !== undefined) updateData.notes = notes;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'At least one field must be provided for update'
      });
    }

    await updateClientContact(id, updateData);

    const updatedContact = await getClientContactById(id);
    return res.json({
      success: true,
      data: updatedContact.toPublicJSON()
    });
  } catch (err) {
    console.error('updateClientContactController error:', err);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}
