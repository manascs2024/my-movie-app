const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  likedMovies: { type: [Object], default: [] },
  isVerified: { type: Boolean, default: false },
  verifyToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

module.exports = mongoose.model('User', UserSchema);
