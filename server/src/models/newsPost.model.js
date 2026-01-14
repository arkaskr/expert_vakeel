// models/newsPost.model.js
class NewsPost {
    constructor({
      id,
      title = "",
      imageUrl = "",
      description = "",
      brief = "",
      source = "",
      liveLink = "",
      category = "",
      createdAt,  // Firestore Timestamp or JS Date
      views = 0,
      isTrending = false,
      published = true,
    }) {
      this.id = id;
      this.title = title;
      this.imageUrl = imageUrl;
      this.description = description;
      this.brief = brief;
      this.source = source;
      this.liveLink = liveLink;
      this.category = category;
      this.createdAt = createdAt;
      this.views = Number.isFinite(views) ? views : 0;
      this.isTrending = !!isTrending;
      this.published = !!published;
    }
  
    static fromDoc(doc) {
      const data = doc?.data?.() ?? {};
      return new NewsPost({
        id: doc.id,
        title: String(data.title ?? ""),
        imageUrl: String(data.imageUrl ?? ""),
        description: String(data.description ?? ""),
        brief: String(data.brief ?? ""),
        source: String(data.source ?? ""),
        liveLink: String(data.liveLink ?? ""),
        category: String(data.category ?? ""),
        createdAt: data.createdAt, // keep Firestore Timestamp as-is
        views: typeof data.views === "number" ? data.views : 0,
        isTrending: data.isTrending === true,
        published: data.published !== false, // default true
      });
    }
  
    toJson() {
      return {
        title: this.title,
        imageUrl: this.imageUrl,
        description: this.description,
        brief: this.brief,
        source: this.source,
        liveLink: this.liveLink,
        category: this.category,
        createdAt: this.createdAt,
        views: this.views,
        isTrending: this.isTrending,
        published: this.published,
      };
    }
  }
  
  // Optional Firestore converter
  const newsPostConverter = {
    toFirestore(model) {
      return model.toJson();
    },
    fromFirestore(snapshot, options) {
      const data = snapshot.data(options);
      return NewsPost.fromDoc({ id: snapshot.id, data: () => data });
    },
  };
  
  export { NewsPost, newsPostConverter };
  