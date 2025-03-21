const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
  street:   { type: String, required: true },
  name:     { type: String, required: true },
  phone:    { type: String, required: true },
  city:     { type: String, required: true },
  state:    { type: String, required: true },
  zipcode:  { type: String, required: true },
  country:  { type: String, required: true },
  landmark: { type: String } // Optional extra field
}, { timestamps: true });

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  // Conditionally require password only if googleId is not provided
  password: { 
    type: String, 
    required: function() { return !this.googleId; } 
  },
  googleId: { type: String }, // Stores the Google UID if user signed in via Google
  name: { type: String, required: true },
  profilePicture: { type: String },
  addresses: { type: [AddressSchema], default: [] },
  phone: { type: String, default:null},
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
