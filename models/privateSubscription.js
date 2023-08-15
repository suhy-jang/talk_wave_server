const mongoose = require('mongoose');

const privateSubscriptionSchema = new mongoose.Schema({
  subscriber: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  channel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Channel',
    required: true,
  },
  timestamp: { type: Date, default: Date.now },
});

const PrivateSubscription = mongoose.model(
  'PrivateSubscription',
  privateSubscriptionSchema
);

module.exports = PrivateSubscription;
