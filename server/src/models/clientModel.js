// models/client.model.js
import { db } from "../config/firebase.js";

export class ClientModel {
  constructor({
    id = null,
    fullName = "",
    email = "",
    phone = "",
    city = "",
    profilePic = "",
    // store only hashedPassword in DB
    hashedPassword = "",
    createdAt = null, // Firestore Timestamp
    updatedAt = null, // Firestore Timestamp
  } = {}) {
    this.id = id;
    this.fullName = fullName;
    this.email = email;
    this.phone = phone;
    this.city = city;
    this.profilePic = profilePic;
    this.hashedPassword = hashedPassword;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromData(data = {}) {
    if (!data) return null;
    return new ClientModel({ ...data });
  }

  toJSON() {
    return {
      fullName: this.fullName,
      email: this.email,
      phone: this.phone,
      city: this.city,
      profilePic: this.profilePic,
      hashedPassword: this.hashedPassword,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  // never expose hashedPassword outward
  toPublicJSON() {
    return {
      id: this.id,
      fullName: this.fullName,
      email: this.email,
      phone: this.phone,
      city: this.city,
      profilePic: this.profilePic,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

// ---------- Static Helper Functions ----------
const COLLECTION = "clients";

export async function getClientByEmail(email) {
  const snap = await db.collection(COLLECTION).where("email", "==", email).limit(1).get();
  if (snap.empty) return null;
  const doc = snap.docs[0];
  return {
    id: doc.id,
    ...doc.data(),
    firstName: doc.data().fullName?.split(' ')[0] || '',
    lastName: doc.data().fullName?.split(' ').slice(1).join(' ') || '',
    password: doc.data().hashedPassword, // for compatibility
    role: 'client'
  };
}

export async function createClient(clientData) {
  const docRef = db.collection(COLLECTION).doc();
  const model = new ClientModel({
    id: docRef.id,
    fullName: `${clientData.firstName} ${clientData.lastName}`.trim(),
    email: clientData.email,
    phone: clientData.phone,
    hashedPassword: clientData.password,
  });
  await docRef.set(model.toJSON());
  return docRef.id;
}
