// models/queryAnswerModel.js

/**
 * QueryAnswer Model
 * Represents an answer to a query in the system
 */
class QueryAnswerModel {
  constructor({
    id,
    queryId = "",
    userId = "",
    userType = "",
    userName = "",
    answer = "",
    createdAt,
    updatedAt,
  }) {
    this.id = id;
    this.queryId = queryId;
    this.userId = userId;
    this.userType = userType;
    this.userName = userName;
    this.answer = answer;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromDoc(doc) {
    const data = doc?.data?.() ?? {};
    return new QueryAnswerModel({
      id: doc.id,
      queryId: String(data.queryId ?? ""),
      userId: String(data.userId ?? ""),
      userType: String(data.userType ?? ""),
      userName: String(data.userName ?? ""),
      answer: String(data.answer ?? ""),
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  toJson() {
    return {
      queryId: this.queryId,
      userId: this.userId,
      userType: this.userType,
      userName: this.userName,
      answer: this.answer,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

// Optional Firestore converter
const queryAnswerConverter = {
  toFirestore(model) {
    return model.toJson();
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return QueryAnswerModel.fromDoc({ id: snapshot.id, data: () => data });
  },
};

export { QueryAnswerModel, queryAnswerConverter };
