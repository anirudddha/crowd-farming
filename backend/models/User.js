const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  investments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' }],
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
