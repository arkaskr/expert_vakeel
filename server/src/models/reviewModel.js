// models/review.model.js
import { db } from "../config/firebase.js";

export class ReviewModel {
  constructor({
    id = null,
    review = "", // text review content
    userId = null, // who is being reviewed (user/lawyer)
    clientId = null, // who wrote the review (client)
    ratingId = null, // optional: reference to rating
    createdAt = null, // Firestore Timestamp
    updatedAt = null, // Firestore Timestamp
  } = {}) {
    this.id = id;
    this.review = review;
    this.userId = userId;
    this.clientId = clientId;
    this.ratingId = ratingId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromData(data = {}) {
    if (!data) return null;
    return new ReviewModel({ ...data });
  }

  toJSON() {
    return {
      review: this.review,
      userId: this.userId,
      clientId: this.clientId,
      ratingId: this.ratingId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  // Public JSON (same as toJSON for reviews)
  toPublicJSON() {
    return this.toJSON();
  }
}

// ---------- Static Helper Functions ----------
const COLLECTION = "reviews";

export async function getReviewById(id) {
  const doc = await db.collection(COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return ReviewModel.fromData({ id: doc.id, ...doc.data() });
}

export async function getReviewsByUserId(userId) {
  const snap = await db.collection(COLLECTION).where("userId", "==", userId).get();
  return snap.docs.map(doc => ReviewModel.fromData({ id: doc.id, ...doc.data() }));
}

export async function getReviewCountForUser(userId) {
  const reviews = await getReviewsByUserId(userId);
  return reviews.length;
}

export async function createReview(reviewData) {
  const docRef = db.collection(COLLECTION).doc();
  const model = new ReviewModel({
    id: docRef.id,
    ...reviewData,
  });
  await docRef.set(model.toJSON());
  return docRef.id;
}
