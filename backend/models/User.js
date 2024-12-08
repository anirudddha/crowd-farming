const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  
  email: { type: String, unique: true },
  password: {type:String},
  name: { type: String },
  profilePicture: { type: String },
  address:{type:String},

}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
