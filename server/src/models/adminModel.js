// models/adminModel.js
class AdminModel {
  constructor({
    id,
    name = "",
    email = "",
    password = "",
    phoneNumber = "",
    createdAt,  // Firestore Timestamp or JS Date
    isActive = true,
  }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.phoneNumber = phoneNumber;
    this.createdAt = createdAt;
    this.isActive = !!isActive;
  }

  static fromDoc(doc) {
    const data = doc?.data?.() ?? {};
    return new AdminModel({
      id: doc.id,
      name: String(data.name ?? ""),
      email: String(data.email ?? ""),
      password: String(data.password ?? ""),
      phoneNumber: String(data.phoneNumber ?? ""),
      createdAt: data.createdAt, // keep Firestore Timestamp as-is
      isActive: data.isActive !== false, // default true
    });
  }

  toJson() {
    return {
      name: this.name,
      email: this.email,
      password: this.password,
      phoneNumber: this.phoneNumber,
      createdAt: this.createdAt,
      isActive: this.isActive,
    };
  }
}

// Optional Firestore converter
const adminConverter = {
  toFirestore(model) {
    return model.toJson();
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return AdminModel.fromDoc({ id: snapshot.id, data: () => data });
  },
};

export { AdminModel, adminConverter };

