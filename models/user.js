const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  name: String,
  password: { type: String, select: false },
  timestamp: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
