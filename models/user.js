const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  name: String,
  password: String,
  createdChannels: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Channel',
    },
  ],
  subscribedChannels: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Channel',
    },
  ],
  timestamp: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
