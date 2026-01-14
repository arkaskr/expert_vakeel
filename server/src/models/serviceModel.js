// models/service.model.js
export class ServiceModel {
    constructor({
        id = null,
        name = "",
        description = "",
        categories = [], // Array of category strings
        number = "", // Number/identifier field
        createdAt = null, // Firestore Timestamp
        updatedAt = null, // Firestore Timestamp
    } = {}) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.categories = categories;
        this.number = number;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    static fromData(data = {}) {
        if (!data) return null;
        return new ServiceModel({ ...data });
    }

    static fromDoc(doc) {
        const data = doc.data() || {};
        return new ServiceModel({
            id: doc.id,
            name: String(data.name ?? ""),
            description: String(data.description ?? ""),
            categories: Array.isArray(data.categories) ? data.categories : [],
            number: String(data.number ?? ""),
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        });
    }

    toJSON() {
        return {
            name: this.name,
            description: this.description,
            categories: this.categories,
            number: this.number,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }

    toPublicJSON() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            categories: this.categories,
            number: this.number,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}

// Optional: Firestore data converter
export const serviceConverter = {
    toFirestore(model) {
        return model.toJSON();
    },
    fromFirestore(snapshot, options) {
        return ServiceModel.fromDoc(snapshot);
    },
};
