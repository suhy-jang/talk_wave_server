const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: String,
  name: String,
  password: String,
  channel_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Channel',
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
