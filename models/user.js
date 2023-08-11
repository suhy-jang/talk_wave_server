const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    id: { type: String, unique: true },
    name: String,
    password: String,
    channels: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Channel',
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
