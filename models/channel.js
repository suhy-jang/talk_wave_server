const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
  name: String,
  key: String,
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
  ],
});

const Channel = mongoose.model('Channel', channelSchema);

module.exports = Channel;
