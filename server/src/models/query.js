// models/queryPost.model.js
class QueryPost {
  constructor({
    id,
    title,
    description = "",
    askedByName,
    askedById,
    answersCount,
    source,
    createdAt, // Firestore Timestamp or JS Date
  }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.askedByName = askedByName;
    this.askedById = askedById;
    this.answersCount = answersCount;
    this.source = source;
    this.createdAt = createdAt;
  }

  static fromDoc(doc) {
    const data = doc.data() || {};
    return new QueryPost({
      id: doc.id,
      title: String(data.title ?? ""),
      description: String(data.description ?? ""),
      askedByName: String(data.askedByName ?? ""),
      askedById: String(data.askedById ?? ""),
      answersCount:
        typeof data.answersCount === "number"
          ? data.answersCount
          : parseInt(data.answersCount ?? 0, 10),
      source: String(data.source ?? ""),
      createdAt: data.createdAt, // Firestore Timestamp (preferred)
    });
  }

  toJson() {
    return {
      title: this.title,
      description: this.description,
      askedByName: this.askedByName,
      askedById: this.askedById,
      answersCount: this.answersCount,
      source: this.source,
      createdAt: this.createdAt,
    };
  }
}

// Optional: Firestore data converter (if you want typed reads/writes)
const queryPostConverter = {
  toFirestore(model) {
    return model.toJson();
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return QueryPost.fromDoc({ id: snapshot.id, data: () => data });
  },
};

export { QueryPost, queryPostConverter };
