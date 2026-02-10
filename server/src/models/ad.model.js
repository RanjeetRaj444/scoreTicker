import mongoose, { Schema } from "mongoose";

const adSchema = new Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["Banner", "Video", "Popup"],
      default: "Banner",
    },
    imageUrl: { type: String, required: true },
    targetUrl: { type: String, required: true },
    placement: {
      type: String,
      enum: ["HomeHero", "Sidebar", "ScorecardBottom", "NewsList"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    impressions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  { timestamps: true },
);

export const Ad = mongoose.model("Ad", adSchema);
