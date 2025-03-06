const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderItemSchema = new Schema({
  itemId: {
    type: Schema.Types.ObjectId,
    ref: 'Item', // Assumes your item collection is named 'Item'
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  weight: {
    type: Number,
    required: true,
    min: 0
  }
});

const orderEntrySchema = new Schema({
  items: [orderItemSchema],
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  orderStatus: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  shippingAddress: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    country: { type: String }
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending'
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Update the updatedAt field before saving each order entry
orderEntrySchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const userOrdersSchema = new Schema({
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true  // One document per user
  },
  orders: [orderEntrySchema]
}, {
  timestamps: true // Automatically manages createdAt and updatedAt for the document
});

module.exports = mongoose.model('UserOrders', userOrdersSchema);
