// models/supportModel.js

/**
 * Support Model
 * Represents a support ticket/request in the system
 */
class SupportModel {
  constructor({
    id,
    userId = "",
    userType = "",
    purpose = "",
    category = "",
    title = "",
    description = "",
    status = "PENDING",
    answers = [], // Array of answer objects
    createdAt,
    updatedAt,
  }) {
    this.id = id;
    this.userId = userId;
    this.userType = userType;
    this.purpose = purpose;
    this.category = category;
    this.title = title;
    this.description = description;
    this.status = status;
    this.answers = Array.isArray(answers) ? answers : [];
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromDoc(doc) {
    const data = doc?.data?.() ?? {};
    return new SupportModel({
      id: doc.id,
      userId: String(data.userId ?? ""),
      userType: String(data.userType ?? ""),
      purpose: String(data.purpose ?? ""),
      category: String(data.category ?? ""),
      title: String(data.title ?? ""),
      description: String(data.description ?? ""),
      status: String(data.status ?? "PENDING"),
      answers: Array.isArray(data.answers) ? data.answers : [],
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  toJson() {
    return {
      userId: this.userId,
      userType: this.userType,
      purpose: this.purpose,
      category: this.category,
      title: this.title,
      description: this.description,
      status: this.status,
      answers: this.answers,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

// Optional Firestore converter
const supportConverter = {
  toFirestore(model) {
    return model.toJson();
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return SupportModel.fromDoc({ id: snapshot.id, data: () => data });
  },
};

export { SupportModel, supportConverter };
