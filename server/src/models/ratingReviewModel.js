// models/ratingReviewModel.js
import { db } from "../config/firebase.js";

export class RatingReviewModel {
  constructor({
    id = null,
    rating = null, // number: 1-5 stars
    review = "", // text review content (optional)
    userId = null, // who is being rated/reviewed (user/lawyer)
    clientId = null, // who gave the rating/review (client)
    clientName = "", // name of the client who gave the rating/review
    createdAt = null, // Firestore Timestamp
    updatedAt = null, // Firestore Timestamp
  } = {}) {
    this.id = id;
    this.rating = rating;
    this.review = review;
    this.userId = userId;
    this.clientId = clientId;
    this.clientName = clientName;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromData(data = {}) {
    if (!data) return null;
    return new RatingReviewModel({ ...data });
  }

  toJSON() {
    return {
      rating: this.rating,
      review: this.review,
      userId: this.userId,
      clientId: this.clientId,
      clientName: this.clientName,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  // Public JSON (convert timestamps to ISO strings for easier parsing)
  toPublicJSON() {
    const json = this.toJSON();
    return {
      ...json,
      createdAt: this.createdAt ? (this.createdAt.toDate ? this.createdAt.toDate().toISOString() : this.createdAt) : null,
      updatedAt: this.updatedAt ? (this.updatedAt.toDate ? this.updatedAt.toDate().toISOString() : this.updatedAt) : null,
    };
  }
}

// ---------- Static Helper Functions ----------
const COLLECTION = "ratings_reviews";

export async function getRatingReviewById(id) {
  const doc = await db.collection(COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return RatingReviewModel.fromData({ id: doc.id, ...doc.data() });
}

export async function getRatingReviewsByUserId(userId) {
  const snap = await db.collection(COLLECTION).where("userId", "==", userId).get();
  return snap.docs.map(doc => RatingReviewModel.fromData({ id: doc.id, ...doc.data() }));
}

export async function getAverageRatingForUser(userId) {
  const ratingReviews = await getRatingReviewsByUserId(userId);
  if (ratingReviews.length === 0) return 0;

  const ratingsWithValues = ratingReviews.filter(rr => rr.rating && rr.rating > 0);
  if (ratingsWithValues.length === 0) return 0;

  const sum = ratingsWithValues.reduce((acc, rr) => acc + rr.rating, 0);
  return sum / ratingsWithValues.length;
}

export async function getRatingCountForUser(userId) {
  const ratingReviews = await getRatingReviewsByUserId(userId);
  return ratingReviews.filter(rr => rr.rating && rr.rating > 0).length;
}

export async function getReviewCountForUser(userId) {
  const ratingReviews = await getRatingReviewsByUserId(userId);
  return ratingReviews.filter(rr => rr.review && rr.review.trim().length > 0).length;
}

export async function createRatingReview(ratingReviewData) {
  const docRef = db.collection(COLLECTION).doc();
  const model = new RatingReviewModel({
    id: docRef.id,
    ...ratingReviewData,
  });
  await docRef.set(model.toJSON());
  return docRef.id;
}
