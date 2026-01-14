// models/helpSupportModel.js
import { db } from "../config/firebase.js";

class HelpSupportModel {
  constructor({
    id,
    userId = "",
    from = "",
    title = "",
    description = "",
    category = "",
    answer = "",
    status = "PENDING", // PENDING, ANSWERED, CLOSED
    createdAt,  // Firestore Timestamp or JS Date
    updatedAt,  // Firestore Timestamp or JS Date
  }) {
    this.id = id;
    this.userId = userId;
    this.from = from;
    this.title = title;
    this.description = description;
    this.category = category;
    this.answer = answer;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromDoc(doc) {
    const data = doc?.data?.() ?? {};
    return new HelpSupportModel({
      id: doc.id,
      userId: String(data.userId ?? ""),
      from: String(data.from ?? ""),
      title: String(data.title ?? ""),
      description: String(data.description ?? ""),
      category: String(data.category ?? ""),
      answer: String(data.answer ?? ""),
      status: String(data.status ?? "PENDING"),
      createdAt: data.createdAt, // keep Firestore Timestamp as-is
      updatedAt: data.updatedAt, // keep Firestore Timestamp as-is
    });
  }

  toJson() {
    return {
      userId: this.userId,
      from: this.from,
      title: this.title,
      description: this.description,
      category: this.category,
      answer: this.answer,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

// Optional Firestore converter
const helpSupportConverter = {
  toFirestore(model) {
    return model.toJson();
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return HelpSupportModel.fromDoc({ id: snapshot.id, data: () => data });
  },
};

export { HelpSupportModel, helpSupportConverter };