const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    brand: { type: String, required: true },
    variants: [
      {
        size: { type: String, required: true },
        price: { type: Number, required: true },
        available: { type: Boolean, required: true },
      },
    ],
    image: {
      data: String,  // Base64 encoded image
      contentType: String, // MIME type like "image/png"
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Item", ItemSchema);