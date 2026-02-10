import mongoose, { Schema } from "mongoose";

const articleSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    category: {
      type: String,
      enum: ["News", "Match Preview", "Match Report", "Editorial", "Story"],
      default: "News",
    },
    status: {
      type: String,
      enum: ["Draft", "Published", "Archived"],
      default: "Draft",
    },
    thumbnail: { type: String },
    tags: [{ type: String }],
    matchId: { type: Schema.Types.ObjectId, ref: "Match" },
    seoDescription: { type: String },
    views: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// Auto-generate slug from title before saving
articleSchema.pre("validate", function (next) {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
  next();
});

export const Article = mongoose.model("Article", articleSchema);
