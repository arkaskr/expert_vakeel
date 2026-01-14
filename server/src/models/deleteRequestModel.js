// models/deleteRequestModel.js
import { db } from "../config/firebase.js";

class DeleteRequestModel {
    constructor({
        id,
        userId = "",
        userName = "",
        userEmail = "",
        userPhone = "",
        reason = "",
        status = "pending", // pending, approved, rejected
        adminNotes = null,
        requestedAt,  // Firestore Timestamp or JS Date
        reviewedAt = null,   // Firestore Timestamp or JS Date
        reviewedBy = null,   // Admin ID who reviewed
    }) {
        this.id = id;
        this.userId = userId;
        this.userName = userName;
        this.userEmail = userEmail;
        this.userPhone = userPhone;
        this.reason = reason;
        this.status = status;
        this.adminNotes = adminNotes;
        this.requestedAt = requestedAt;
        this.reviewedAt = reviewedAt;
        this.reviewedBy = reviewedBy;
    }

    static fromDoc(doc) {
        const data = doc?.data?.() ?? {};
        return new DeleteRequestModel({
            id: doc.id,
            userId: String(data.userId ?? ""),
            userName: String(data.userName ?? ""),
            userEmail: String(data.userEmail ?? ""),
            userPhone: String(data.userPhone ?? ""),
            reason: String(data.reason ?? ""),
            status: String(data.status ?? "pending"),
            adminNotes: data.adminNotes ?? null,
            requestedAt: data.requestedAt, // keep Firestore Timestamp as-is
            reviewedAt: data.reviewedAt ?? null,
            reviewedBy: data.reviewedBy ?? null,
        });
    }

    toJson() {
        return {
            userId: this.userId,
            userName: this.userName,
            userEmail: this.userEmail,
            userPhone: this.userPhone,
            reason: this.reason,
            status: this.status,
            adminNotes: this.adminNotes,
            requestedAt: this.requestedAt,
            reviewedAt: this.reviewedAt,
            reviewedBy: this.reviewedBy,
        };
    }
}

// Optional Firestore converter
const deleteRequestConverter = {
    toFirestore(model) {
        return model.toJson();
    },
    fromFirestore(snapshot, options) {
        const data = snapshot.data(options);
        return DeleteRequestModel.fromDoc({ id: snapshot.id, data: () => data });
    },
};

export { DeleteRequestModel, deleteRequestConverter };
