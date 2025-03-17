const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    rating: { type: Number, required: true, min: 0, max: 5 },
    comment: { type: String, required: true },
    email: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false } // No separate _id for each review
);

// Update images field to store Cloudinary-specific data
const ImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    public_id: { type: String, required: true },
  },
  { _id: false }
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
        originalPrice: { type: Number },
      },
    ],
    images: { type: [ImageSchema] }, // Now each image has a URL and a public_id
    reviews: [ReviewSchema], // Nested schema for reviews
  },
  { timestamps: true }
);

module.exports = mongoose.model("Item", ItemSchema);
