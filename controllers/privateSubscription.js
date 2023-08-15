const { PrivateSubscription } = require('../models');

exports.subscribedChannels = async (req, res) => {
  const channels = await PrivateSubscription.find({
    subscriber: req.user.userId,
  }).select('channel');

  const channelIds = channels.map((sub) => sub.channel);
  res.status(200).json({ channelIds });
};
