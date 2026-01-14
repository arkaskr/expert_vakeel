// models/subAdminModel.js

/**
 * SubAdmin Model
 * 
 * IMPORTANT: allowedTabs must use EXACT keys from the frontend sidebar:
 * Valid keys: ["Lawyers", "Clients", "Cases", "News", "Queries", "Admins", "SubAdmins", "Blogs", "Notifications"]
 * 
 * Example:
 * {
 *   name: "John Doe",
 *   email: "john@example.com",
 *   password: "hashedpassword",
 *   role: "Manager",
 *   allowedTabs: ["Lawyers", "Clients", "Cases", "News"]  // <-- Exactly as shown above
 * }
 * 
 * Note: Dashboard is always accessible and doesn't need to be in allowedTabs
 */
class SubAdminModel {
  constructor({
    id,
    name = "",
    email = "",
    password = "",
    phoneNumber = "",
    role = "",
    allowedTabs = [],  // Array of strings - MUST match frontend tab keys exactly
    createdAt,  // Firestore Timestamp or JS Date
    isActive = true,
  }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.phoneNumber = phoneNumber;
    this.role = role;
    this.allowedTabs = Array.isArray(allowedTabs) ? allowedTabs : [];
    this.createdAt = createdAt;
    this.isActive = !!isActive;
  }

  static fromDoc(doc) {
    const data = doc?.data?.() ?? {};
    return new SubAdminModel({
      id: doc.id,
      name: String(data.name ?? ""),
      email: String(data.email ?? ""),
      password: String(data.password ?? ""),
      phoneNumber: String(data.phoneNumber ?? ""),
      role: String(data.role ?? ""),
      allowedTabs: Array.isArray(data.allowedTabs) ? data.allowedTabs : [],
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
      role: this.role,
      allowedTabs: this.allowedTabs,
      createdAt: this.createdAt,
      isActive: this.isActive,
    };
  }
}

// Optional Firestore converter
const subAdminConverter = {
  toFirestore(model) {
    return model.toJson();
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return SubAdminModel.fromDoc({ id: snapshot.id, data: () => data });
  },
};

export { SubAdminModel, subAdminConverter };

