// models/blogModel.js
class Blog {
    constructor({
      id,
      title = "",
      category = "",
      subtitle = "",
      description = "",
      image = "",
      createdAt,  // Firestore Timestamp or JS Date
      published = true,
    }) {
      this.id = id;
      this.title = title;
      this.category = category;
      this.subtitle = subtitle;
      this.description = description;
      this.image = image;
      this.createdAt = createdAt;
      this.published = !!published;
    }

    static fromDoc(doc) {
      const data = doc?.data?.() ?? {};
      return new Blog({
        id: doc.id,
        title: String(data.title ?? ""),
        category: String(data.category ?? ""),
        subtitle: String(data.subtitle ?? ""),
        description: String(data.description ?? ""),
        image: String(data.image ?? ""),
        createdAt: data.createdAt, // keep Firestore Timestamp as-is
        published: data.published !== false, // default true
      });
    }

    toJson() {
      return {
        title: this.title,
        category: this.category,
        subtitle: this.subtitle,
        description: this.description,
        image: this.image,
        createdAt: this.createdAt,
        published: this.published,
      };
    }
  }

  // Optional Firestore converter
  const blogConverter = {
    toFirestore(model) {
      return model.toJson();
    },
    fromFirestore(snapshot, options) {
      const data = snapshot.data(options);
      return Blog.fromDoc({ id: snapshot.id, data: () => data });
    },
  };

  export { Blog, blogConverter };
