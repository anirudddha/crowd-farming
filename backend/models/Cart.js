const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Refers to the 'users' collection
      required: true,
    },
    items: [
      {
        itemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Item', // Refers to the 'items' collection
          required: true,
        },
        size: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
        totalPrice: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

module.exports = mongoose.model('Cart', CartSchema);
