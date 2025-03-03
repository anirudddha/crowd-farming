const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema(
  {
    // Basic product details
    name: { type: String, required: true },
    category: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    farmName: { type: String, required: true },
    weights: { type: [Number], required: true }, // e.g., [1, 5, 10]
    isOrganic: { type: Boolean, default: false },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    reviews: { type: Number, default: 0 },
    deliveryTime: { type: String, required: true },
    tags: { type: [String], default: [] },

    // Variants information (e.g., different sizes and their availability)
    variants: [
      {
        size: { type: String, required: true },
        price: { type: Number, required: true },
        available: { type: Boolean, required: true },
      },
    ],

    // Image stored as Base64 with its MIME type
    images: {
      type: [String], // Array to store paths to uploaded files
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Item", ItemSchema);
