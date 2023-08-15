const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  key: String,
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  timestamp: { type: Date, default: Date.now },
});

const Channel = mongoose.model('Channel', channelSchema);

module.exports = Channel;
