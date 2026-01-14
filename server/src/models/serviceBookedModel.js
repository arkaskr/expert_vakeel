// models/serviceBooked.model.js
export class ServiceBookedModel {
    constructor({
        id = null,
        clientId = "", // UUID
        phoneNumber = "", // Stored as string for flexibility
        title = "",
        description = "",
        servicesBooked = [], // Array of service IDs or service objects
        createdAt = null, // Firestore Timestamp
        updatedAt = null, // Firestore Timestamp
    } = {}) {
        this.id = id;
        this.clientId = clientId;
        this.phoneNumber = phoneNumber;
        this.title = title;
        this.description = description;
        this.servicesBooked = servicesBooked;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    static fromData(data = {}) {
        if (!data) return null;
        return new ServiceBookedModel({ ...data });
    }

    static fromDoc(doc) {
        const data = doc.data() || {};
        return new ServiceBookedModel({
            id: doc.id,
            clientId: String(data.clientId ?? ""),
            phoneNumber: String(data.phoneNumber ?? ""),
            title: String(data.title ?? ""),
            description: String(data.description ?? ""),
            servicesBooked: Array.isArray(data.servicesBooked) ? data.servicesBooked : [],
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        });
    }

    toJSON() {
        return {
            clientId: this.clientId,
            phoneNumber: this.phoneNumber,
            title: this.title,
            description: this.description,
            servicesBooked: this.servicesBooked,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }

    toPublicJSON() {
        return {
            id: this.id,
            clientId: this.clientId,
            phoneNumber: this.phoneNumber,
            title: this.title,
            description: this.description,
            servicesBooked: this.servicesBooked,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}

// Optional: Firestore data converter
export const serviceBookedConverter = {
    toFirestore(model) {
        return model.toJSON();
    },
    fromFirestore(snapshot, options) {
        return ServiceBookedModel.fromDoc(snapshot);
    },
};
