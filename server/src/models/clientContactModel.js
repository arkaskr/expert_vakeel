// models/clientContactModel.js
import { db, admin } from '../config/firebase.js';

export class ClientContactModel {
  constructor({
    id = null,
    clientId = null, // who is contacting
    lawyerId = null, // who is being contacted
    contactType = 'chat', // 'chat', 'call', 'email', 'inquiry'
    status = 'initiated', // 'initiated', 'responded', 'completed', 'cancelled'
    conversationId = null, // reference to chat conversation if applicable
    contactDate = null, // Firestore Timestamp
    lastActivity = null, // Firestore Timestamp
    notes = "", // optional notes
  } = {}) {
    this.id = id;
    this.clientId = clientId;
    this.lawyerId = lawyerId;
    this.contactType = contactType;
    this.status = status;
    this.conversationId = conversationId;
    this.contactDate = contactDate;
    this.lastActivity = lastActivity;
    this.notes = notes;
  }

  static fromData(data = {}) {
    if (!data) return null;
    return new ClientContactModel({ ...data });
  }

  toJSON() {
    return {
      clientId: this.clientId,
      lawyerId: this.lawyerId,
      contactType: this.contactType,
      status: this.status,
      conversationId: this.conversationId,
      contactDate: this.contactDate,
      lastActivity: this.lastActivity,
      notes: this.notes,
    };
  }

  // Public JSON (convert timestamps to ISO strings for easier parsing)
  toPublicJSON() {
    const json = this.toJSON();
    return {
      ...json,
      id: this.id,
      contactDate: this.contactDate ? (this.contactDate.toDate ? this.contactDate.toDate().toISOString() : this.contactDate) : null,
      lastActivity: this.lastActivity ? (this.lastActivity.toDate ? this.lastActivity.toDate().toISOString() : this.lastActivity) : null,
    };
  }
}

// ---------- Static Helper Functions ----------
const COLLECTION = "client_contacts";

export async function getClientContactById(id) {
  const doc = await db.collection(COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return ClientContactModel.fromData({ id: doc.id, ...doc.data() });
}

export async function getClientContactsByClientId(clientId) {
  const snap = await db.collection(COLLECTION).where("clientId", "==", clientId).orderBy("contactDate", "desc").get();
  return snap.docs.map(doc => ClientContactModel.fromData({ id: doc.id, ...doc.data() }));
}

export async function getClientContactsByLawyerId(lawyerId) {
  const snap = await db.collection(COLLECTION).where("lawyerId", "==", lawyerId).orderBy("contactDate", "desc").get();
  return snap.docs.map(doc => ClientContactModel.fromData({ id: doc.id, ...doc.data() }));
}

export async function getClientContactsByConversationId(conversationId) {
  const snap = await db.collection(COLLECTION).where("conversationId", "==", conversationId).limit(1).get();
  if (snap.empty) return null;
  const doc = snap.docs[0];
  return ClientContactModel.fromData({ id: doc.id, ...doc.data() });
}

export async function getClientContactByParticipants(clientId, lawyerId) {
  const snap = await db.collection(COLLECTION)
    .where("clientId", "==", clientId)
    .where("lawyerId", "==", lawyerId)
    .orderBy("contactDate", "desc")
    .limit(1)
    .get();

  if (snap.empty) return null;
  const doc = snap.docs[0];
  return ClientContactModel.fromData({ id: doc.id, ...doc.data() });
}

export async function createClientContact(contactData) {
  const docRef = db.collection(COLLECTION).doc();
  const now = admin.firestore.FieldValue.serverTimestamp();
  const model = new ClientContactModel({
    id: docRef.id,
    ...contactData,
    contactDate: contactData.contactDate || now,
    lastActivity: contactData.lastActivity || now,
  });
  await docRef.set(model.toJSON());
  return docRef.id;
}

export async function updateClientContact(id, updateData) {
  const updateObj = {
    ...updateData,
    lastActivity: admin.firestore.FieldValue.serverTimestamp(),
  };
  await db.collection(COLLECTION).doc(id).update(updateObj);
}

export async function updateContactStatus(id, status) {
  await updateClientContact(id, { status });
}
