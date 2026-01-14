// models/notificationModel.js
class Notification {
    constructor({
      id,
      title = "",
      description = "",
      image = "",
      createdAt,  // Firestore Timestamp or JS Date
      published = true,
      read = false,
    }) {
      this.id = id;
      this.title = title;
      this.description = description;
      this.image = image;
      this.createdAt = createdAt;
      this.published = !!published;
      this.read = !!read;
    }

    static fromDoc(doc) {
      const data = doc?.data?.() ?? {};
      return new Notification({
        id: doc.id,
        title: String(data.title ?? ""),
        description: String(data.description ?? ""),
        image: String(data.image ?? ""),
        createdAt: data.createdAt, // keep Firestore Timestamp as-is
        published: data.published !== false, // default true
        read: data.read === true,
      });
    }

    toJson() {
      return {
        title: this.title,
        description: this.description,
        image: this.image,
        createdAt: this.createdAt,
        published: this.published,
        read: this.read,
      };
    }
  }

  // Optional Firestore converter
  const notificationConverter = {
    toFirestore(model) {
      return model.toJson();
    },
    fromFirestore(snapshot, options) {
      const data = snapshot.data(options);
      return Notification.fromDoc({ id: snapshot.id, data: () => data });
    },
  };

  export { Notification, notificationConverter };
