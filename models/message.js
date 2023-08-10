const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  content: String,
  date: Date,
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  channel_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Channel',
  },
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
