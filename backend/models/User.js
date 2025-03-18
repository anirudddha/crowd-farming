const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
  street:   { type: String, required: true },
  name:   { type: String, required: true },
  phone:   { type: String, required: true },
  city:     { type: String, required: true },
  state:    { type: String, required: true },
  zipcode:  { type: String, required: true },
  country:  { type: String, required: true },
  landmark: { type: String } // Optional extra field
}, { timestamps: true });

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  profilePicture: { type: String },
  addresses: { type: [AddressSchema], default: [] } , // Multiple addresses
  phone:    { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
