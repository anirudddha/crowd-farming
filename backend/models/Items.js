const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    rating: { type: Number, required: true, min: 0, max: 5 },
    comment: { type: String, required: true },
    email : { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false } // No need for separate _id for each review
);

const ItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    farmName: { type: String, required: true },
    weights: { type: [Number], required: true },
    isOrganic: { type: Boolean, default: false },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    deliveryTime: { type: String, required: true },
    tags: { type: [String], default: [] },
    variants: [
      {
        size: { type: String, required: true },
        price: { type: Number, required: true },
        available: { type: Boolean, required: true },
      },
    ],
    images: { type: [String] },
    reviews: [ReviewSchema], // Nested schema for reviews
  },
  { timestamps: true }
);

module.exports = mongoose.model("Item", ItemSchema);
