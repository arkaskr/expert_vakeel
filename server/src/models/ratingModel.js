// models/rating.model.js
import { db } from "../config/firebase.js";

export class RatingModel {
  constructor({
    id = null,
    rating = null, // number: 1-5 stars
    userId = null, // who gave the rating (user/lawyer being rated)
    clientId = null, // who gave the rating (client giving the rating)
    createdAt = null, // Firestore Timestamp
    updatedAt = null, // Firestore Timestamp
  } = {}) {
    this.id = id;
    this.rating = rating;
    this.userId = userId;
    this.clientId = clientId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromData(data = {}) {
    if (!data) return null;
    return new RatingModel({ ...data });
  }

  toJSON() {
    return {
      rating: this.rating,
      userId: this.userId,
      clientId: this.clientId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  // Public JSON (same as toJSON for ratings)
  toPublicJSON() {
    return this.toJSON();
  }
}

// ---------- Static Helper Functions ----------
const COLLECTION = "ratings";

export async function getRatingById(id) {
  const doc = await db.collection(COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return RatingModel.fromData({ id: doc.id, ...doc.data() });
}

export async function getRatingsByUserId(userId) {
  const snap = await db.collection(COLLECTION).where("userId", "==", userId).get();
  return snap.docs.map(doc => RatingModel.fromData({ id: doc.id, ...doc.data() }));
}

export async function getAverageRatingForUser(userId) {
  const ratings = await getRatingsByUserId(userId);
  if (ratings.length === 0) return 0;

  const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0);
  return sum / ratings.length;
}

export async function getRatingCountForUser(userId) {
  const ratings = await getRatingsByUserId(userId);
  return ratings.length;
}

export async function createRating(ratingData) {
  const docRef = db.collection(COLLECTION).doc();
  const model = new RatingModel({
    id: docRef.id,
    ...ratingData,
  });
  await docRef.set(model.toJSON());
  return docRef.id;
}
