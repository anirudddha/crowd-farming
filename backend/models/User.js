const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
  street:   { type: String, required: true },
  name:     { type: String, required: true },
  phone:    { type: String, required: true },
  city:     { type: String, required: true },
  state:    { type: String, required: true },
  zipcode:  { type: String, required: true },
  country:  { type: String, required: true },
  landmark: { type: String }
}, { timestamps: true });

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { 
    type: String, 
    required: function() { return !this.googleId; } 
  },
  googleId: { type: String },
  name: { type: String, required: true },
  
  // --- MODIFIED --- Store profile picture as an object
  profilePicture: {
    url: { 
      type: String, 
      // Provide a default image URL for new users
      default: 'https://res.cloudinary.com/demo/image/upload/v1699198585/default_profile_picture.png' 
    },
    public_id: { type: String }
  },

  addresses: { type: [AddressSchema], default: [] },
  phone: { type: String, default: null },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);